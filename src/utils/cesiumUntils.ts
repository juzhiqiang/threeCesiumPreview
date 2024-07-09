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
  leftClick = () => {
    return new Promise((resolve, reject) => {
      this.handlePoint.setInputAction((event: Cesium.ScreenSpaceEventType) => {
        let cartesianCoordinate = this.viewer.scene.pickPosition(
          event.position,
        );
        const position = this.watchPosition(cartesianCoordinate);
        resolve(position);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });
  };
}
