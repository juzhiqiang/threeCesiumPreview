import { Cesium } from '@umijs/max';

export class CesiumUntils {
  viewer: Cesium.Viewer;
  handlePoint: Cesium.ScreenSpaceEventHandler;
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;

    this.handlePoint = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  }

  /**
   * 屏幕坐标转经纬度
   *
   * @param client 屏幕坐标在三维场景中位置，Cesium.Cartesian3
   * @returns 无返回值
   * */
  watchPosition = (client: Cesium.Cartesian3) => {
    if (!client) return null;
    const cartographic = Cesium.Cartographic.fromCartesian(client);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
    const height = cartographic.height;
    return {
      longitude: Number(longitude.toFixed(8)),
      latitude: Number(latitude.toFixed(8)),
      altitude: Number(height.toFixed(2)),
    };
  };

  /**
   * 鼠标左键点击事件
   * */
  leftClick() {
    return new Promise((resolve, reject) => {
      this.handlePoint.setInputAction((event: Cesium.ScreenSpaceEventType) => {
        let cartesianCoordinate = this.viewer.scene.pickPosition(
          event.position,
        );
        const position = this.watchPosition(cartesianCoordinate);
        resolve(position);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });
  }

  drawTravelPoint(data: any, start: Cesium.JulianDate, timeStepInSeconds: number) {
    if (!Array.isArray(data)) return '数据格式错误';

    // SampledPositedProperty 存储雷达样本序列中每个样本的位置和时间戳
    const positionProperty = new Cesium.SampledPositionProperty();
    for (let i = 0; i < data.length; i++) {
      const point = data[i];

      // 当前点位所在时间
      const time = Cesium.JulianDate.addSeconds(
        start,
        i * timeStepInSeconds,
        new Cesium.JulianDate(),
      );
      // 当前点位经纬度
      const position = Cesium.Cartesian3.fromDegrees(
        point.longitude,
        point.latitude,
        point.height,
      );

      this.viewer.entities.add({
        description: `Location: (${point.longitude}, ${point.latitude}, ${point.height})`,
        position: position,
        point: { pixelSize: 10, color: Cesium.Color.RED },
      });
      // 保存点位位置跟时间
      positionProperty.addSample(time, position);
    }

    return positionProperty;
  }
}
