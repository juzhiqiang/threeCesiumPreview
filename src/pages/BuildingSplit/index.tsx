import { CesiumUntils } from '@/utils/cesiumUntils';
import { PageContainer } from '@ant-design/pro-components';
import { Cesium } from '@umijs/max';
import { Button } from 'antd';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { modelData } from './data';
import styles from './index.less';

const CzmlCesiumRoam: React.FC = () => {
  const dom = useRef<HTMLDivElement>(null);
  const viewer = useRef<Cesium.Viewer>();
  const cesiumUntils = useRef<any>({});
  const modelList = useRef<Cesium.EntityCollection[]>([]);

  const init = async () => {
    if (viewer.current) viewer.current.destroy();
    if (!dom.current) return;

    viewer.current = new Cesium.Viewer(dom.current, {
      animation: false, // 是否创建动画小部件。
      baseLayerPicker: false, // 是否显示图层选择器。
      geocoder: false, // 是否显示geocoder小部件。
      homeButton: false, // 是否显示Home按钮。
      infoBox: false, // 是否显示信息框。
      sceneModePicker: false, // 是否显示3D/2D选择器。
      selectionIndicator: false, // 是否显示选取指示器组件。
      timeline: false, // 是否显示时间轴。
      scene3DOnly: true,
    });

    cesiumUntils.current = new CesiumUntils(viewer.current);

    // 开启深度检测，避免出现黑边
    viewer.current.scene.globe.depthTestAgainstTerrain = true;

    // 楼体数据
    modelData.forEach((item: any) => {
      const entity: Cesium.EntityCollection = viewer.current?.entities.add({
        position: item.position,
        model: {
          uri: item.uri,
          customShader: new Cesium.CustomShader({
            lightingModel: Cesium.LightingModel.UNLIT,
          }),
        },
        option: item.option,
        name: item.name,
      });
      modelList.current.push(entity);
    });

    viewer.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(113.94708, 22.552329, 150),
    });
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
  const handle = (type: 'opactiy' | 'split' | 'reset' | '1F' | '2F' | '3F') => {
    if (!viewer.current) return;
    const t = {
      '1F': 0,
      '2F': -2.5,
      '3F': -5,
      color1: 1,
      color2: 1,
      color3: 1,
      opactiy1: 1,
      opactiy2: 1,
      opactiy3: 1,
    };

    if (type === 'opactiy') {
      gsap.to(t, {
        duration: 1,
        color1: 0.5,
        color2: 0.5,
        color3: 0.5,
        opactiy1: 0.5,
        opactiy2: 0.4,
        opactiy3: 0.3,
        yoyo: true,
        ease: 'power1.inOut',
        onUpdate: () => {
          modelList.current.forEach((item: any) => {
            if (item.name === '1F') {
              item.model.color = new Cesium.Color(
                t.color1,
                t.color1,
                t.color1,
                t.opactiy1,
              );
            }
            if (item.name === '2F') {
              item.model.color = new Cesium.Color(
                t.color2,
                t.color2,
                t.color2,
                t.opactiy2,
              );
            }
            if (item.name === '3F') {
              item.model.color = new Cesium.Color(
                t.color3,
                t.color3,
                t.color3,
                t.opactiy3,
              );
            }
          });
        },
      });
      return;
    }

    if (type === 'split') {
      gsap.to(t, {
        duration: 2,
        '1F': 0,
        '2F': 4,
        '3F': 8,
        yoyo: true,
        ease: 'power1.inOut',
        onUpdate: () => {
          modelList.current.forEach((item: any) => {
            if (item.name === '1F') {
              item.position = Cesium.Cartesian3.fromDegrees(
                113.94708,
                22.552329,
                t['1F'],
              );
            }
            if (item.name === '2F') {
              item.position = Cesium.Cartesian3.fromDegrees(
                113.94708,
                22.552329,
                t['2F'],
              );
            }
            if (item.name === '3F') {
              item.position = Cesium.Cartesian3.fromDegrees(
                113.94708,
                22.552329,
                t['3F'],
              );
            }
          });
        },
      });
      return;
    }

    if (type === 'reset') {
      modelList.current.forEach((item: any) => {
        item.model.show = true;
        item.model.color = new Cesium.Color(1, 1, 1, 1);
        item.position = Cesium.Cartesian3.fromDegrees(
          113.94708,
          22.552329,
          item.option.height,
        );
        item.model.show = true;
      });
      return;
    }

    gsap.to(t, {
      duration: 2,
      '1F': 0,
      '2F': 4,
      '3F': 8,
      yoyo: true,
      ease: 'power1.inOut',
      onUpdate: () => {
        modelList.current.forEach((item: any) => {
          if (item.name === type) {
            item.position = Cesium.Cartesian3.fromDegrees(
              113.94708,
              22.552329,
              t['1F'],
            );
            item.model.show = true;
            return;
          }
          item.model.show = false;
        });
      },
    });
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '楼体拆分',
      }}
    >
      <div className={styles.demo}>
        <div ref={dom} className={styles.cesium}></div>

        <div className={styles.bottom}>
          <Button onClick={() => handle('opactiy')}>楼体虚化</Button>
          <Button onClick={() => handle('split')}>楼体拆分整体</Button>
          <Button onClick={() => handle('1F')}>展示1F</Button>
          <Button onClick={() => handle('2F')}>展示2F</Button>
          <Button onClick={() => handle('3F')}>展示3F</Button>
          <Button onClick={() => handle('reset')}>重置原样</Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default CzmlCesiumRoam;
