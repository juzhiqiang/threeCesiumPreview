import { Cesium } from '@umijs/max';

export const modelData: {
  uri: string;
  name: string;
  position: Cesium.Cartesian3;
  option: any;
}[] = [
  {
    uri: '/model/1F.glb',
    name: '1F',
    option: {
      height: 0,
    },
    position: Cesium.Cartesian3.fromDegrees(113.94708, 22.552329, 0),
  },
  {
    uri: '/model/2F.glb',
    name: '2F',
    option: {
      height: -2.5,
    },
    position: Cesium.Cartesian3.fromDegrees(113.94708, 22.552329, -2.5),
  },
  {
    uri: '/model/3F.glb',
    name: '3F',
    option: {
      height: -5,
    },
    position: Cesium.Cartesian3.fromDegrees(113.94708, 22.552329, -5),
  },
];
