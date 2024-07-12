import { lnglatTeam } from '@/data/lnglatTeam';
import { CesiumModel } from '@/utils/cesiumModel';
import { CesiumUntils } from '@/utils/cesiumUntils';
import { PageContainer } from '@ant-design/pro-components';
import { Cesium } from '@umijs/max';
import { Button } from 'antd';
import { useEffect, useRef } from 'react';
import styles from './index.less';

const CzmlCesiumRoam: React.FC = () => {
  const dom = useRef<HTMLDivElement>(null);
  const viewer = useRef<Cesium.Viewer>();
  const cesiumUntils = useRef<any>({});

  const init = async () => {
    if (viewer.current) viewer.current.destroy();
    if (!dom.current) return;

    viewer.current = new Cesium.Viewer(dom.current, {
      animation: true, // 是否创建动画小部件。
      baseLayerPicker: false, // 是否显示图层选择器。
      geocoder: false, // 是否显示geocoder小部件。
      homeButton: false, // 是否显示Home按钮。
      infoBox: false, // 是否显示信息框。
      sceneModePicker: false, // 是否显示3D/2D选择器。
      selectionIndicator: false, // 是否显示选取指示器组件。
      timeline: true, // 是否显示时间轴。
      terrain: Cesium.Terrain.fromWorldTerrain({
        requestVertexNormals: true,
      }),
    });

    cesiumUntils.current = new CesiumUntils(viewer.current);

    // 开启深度检测，避免出现黑边
    viewer.current.scene.globe.depthTestAgainstTerrain = true;
    // 开启默认白膜
    viewer.current.scene.primitives.add(await Cesium.createOsmBuildingsAsync());

    // 初始化时钟,设置每条数据间隔时间
    const timeStepInSeconds = 30;
    const totalSeconds = timeStepInSeconds * lnglatTeam.length;
    // 创建开始结束时钟
    const start = Cesium.JulianDate.fromIso8601('2024-06-01T08:00:00Z');
    const stop = Cesium.JulianDate.addSeconds(
      start,
      totalSeconds,
      new Cesium.JulianDate(),
    );
    // 设置cesiun时钟开始结束时间
    viewer.current.clock.startTime = start.clone();
    viewer.current.clock.stopTime = stop.clone();
    // 设置时钟当前时间
    viewer.current.clock.currentTime = start.clone();
    // 只显示需要范围内时间
    viewer.current.timeline.zoomTo(start, stop);
    // 播放倍数
    viewer.current.clock.multiplier = 50;

    // 绘制线路点位
    const points = cesiumUntils.current.drawTravelPoint(
      lnglatTeam,
      start,
      timeStepInSeconds,
    );

    // 添加模型设置朝向
    const model = new CesiumModel(viewer.current).addModel(
      'http://openlayers.vip/cesium/Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
      points,
    );

    function adjust() {
      if (!viewer.current) return;
      if (viewer.current.clock.shouldAnimate === true) {
        // 获取当前模型方向和位置
        const orientation = model?.orientation;
        const position = model?.position;
        // 获取偏向角
        const ori = orientation?.getValue?.(viewer.current.clock.currentTime);
        // 获取位置
        const center = position?.getValue?.(viewer.current.clock.currentTime);

        const secondsDifference = Cesium.JulianDate.secondsDifference(
          viewer.current.clock.currentTime,
          Cesium.JulianDate.fromIso8601('2024-06-01T15:00:00Z'),
        );
        if (
          !ori ||
          !center ||
          (secondsDifference < -8200 && secondsDifference > -8201)
        ) {
          viewer.current.clock.shouldAnimate = false;
          return;
        }

        // 1、由四元数计算三维旋转矩阵
        const mtx3 = Cesium.Matrix3.fromQuaternion(ori);
        // 2、计算四维转换矩阵：
        const mtx4 = Cesium.Matrix4.fromRotationTranslation(mtx3, center);
        // 3、计算角度：
        const hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(mtx4);
        // 获取角度（弧度）
        const headingTemp = hpr.heading;
        const pitchTemp = hpr.pitch;

        // 调整角度为第一人称
        const heading = Cesium.Math.toRadians(
          Cesium.Math.toDegrees(headingTemp) + 90,
        );
        const pitch = Cesium.Math.toRadians(
          Cesium.Math.toDegrees(pitchTemp) - 12,
        );
        // 视角高度，根据模型大小调整
        const range = 50.0;
        // 动态改变模型视角
        viewer.current.camera.lookAt(
          center,
          new Cesium.HeadingPitchRange(heading, pitch, range),
        );
      }
    }

    // 锁定视角
    viewer.current.clock.onTick.addEventListener(adjust);
  };

  useEffect(() => {
    init();
  });

  /**
   * 根据给定的类型执行不同的操作
   *
   * @param type 操作类型，可选值为 'modelSite'、'start'、'stop'
   * @returns 无返回值
   */
  const handle = (type: 'start' | 'stop' | 'reset') => {
    if (!viewer.current) return;

    if (type === 'start') {
      viewer.current.clock.shouldAnimate = true;
    }
    if (type === 'stop') {
      viewer.current.clock.shouldAnimate = false;
    }
    if (type === 'reset') {
      viewer.current.clock.currentTime = Cesium.JulianDate.fromIso8601(
        '2023-03-08T10:00:00Z',
      );
      viewer.current.clock.shouldAnimate = true;
    }
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '飞行漫游 经纬度插值',
      }}
    >
      <div className={styles.demo}>
        <div ref={dom} className={styles.cesium}></div>

        <div className={styles.bottom}>
          <Button onClick={() => handle('start')}>开始漫游</Button>
          <Button onClick={() => handle('stop')}>停止漫游</Button>
          <Button onClick={() => handle('reset')}>重新开始</Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default CzmlCesiumRoam;
