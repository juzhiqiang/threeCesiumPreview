import { Cesium } from '@umijs/max';

export class CesiumModel {
  viewer: Cesium.Viewer;
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  addModel(uri: string, positionProperty: Cesium.SampledPositionProperty) {
    const model = this.viewer.entities.add({
      // 设置模型显示消失时间
      //   availability: new Cesium.TimeIntervalCollection([
      //     new Cesium.TimeInterval({ start, stop }),
      //   ]),
      show: true,
      position: positionProperty,
      model: {
        uri,
      },
      //   根据点位自动计算方向
      orientation: new Cesium.VelocityOrientationProperty(positionProperty),
      path: new Cesium.PathGraphics({ width: 3 }),
    });

    // 设置相机视角跟随
    this.viewer.trackedEntity = model;
    return model;
  }
}
