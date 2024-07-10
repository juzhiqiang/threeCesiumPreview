/**
 * czml 文件格式
 * */
export const czml_team = [
  {
    id: 'document',
    name: 'flying_follow_team',
    version: '1.0',
    clock: {
      interval: '2023-03-08T10:00:00Z/2023-03-08T15:00:00Z',
      currentTime: '2023-03-08T10:00:00Z',
      multiplier: 9.8,
    },
  },
  {
    id: 'flying_follow_team',
    name: 'path with GPS flight data',
    description: '第一人称视角。',
    // 描述在这个时间范围内实体可见
    availability: '2023-03-08T10:00:00Z/2023-03-08T15:00:00Z',
    show: true,
    path: {
      material: {
        polylineGlow: {
          color: {
            rgba: [0, 0, 255, 200],
          },
          glowPower: 0.1,
          taperPower: 0.1,
        },
      },
      width: 20,
      leadTime: 0,
      trailTime: 1000,
      resolution: 0.5,
      show: true,
    },
    model: {
      // 模型参数
      gltf: 'http://openlayers.vip/cesium/Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
      // minimumPixelSize: 1000,
      maximumScale: 20,
    },
    orientation: {
      // 自动计算方向
      velocityReference: '#position',
    },
    position: {
      // 插值算法
      interpolationAlgorithm: 'LAGRANGE',
      interpolationDegree: 1,
      epoch: '2023-03-08T10:00:00Z',
      // 坐标组
      cartographicDegrees: [
        0, 116.432158, 39.51653, 18.2, 600, 116.435864, 39.515847, 20.32, 700,
        116.448942, 39.513471, 50, 800, 116.473694, 39.50902, 100, 1200,
        116.483373, 39.507851, 500, 1300, 116.482279, 39.494288, 700, 1300,
        116.482279, 39.494288, 700, 2300, 116.741655, 38.884464, 5000, 3000,
        117.333188, 37.393707, 10000, 4000, 118.328905, 33.868221, 10000, 5000,
        117.823463, 32.983233, 10000, 6000, 116.115243, 29.574566, 10000, 7000,
        115.748579, 28.527332, 10000, 8000, 111.060519, 25.43039, 10000, 8500,
        109.716016, 23.139481, 10000, 8600, 110.292616, 23.077368, 5000, 8700,
        112.486839, 22.823027, 700, 8900, 113.762709, 22.683676, 500, 9000,
        113.785911, 22.652653, -1.0, 9500, 113.795067, 22.636082, -2.0, 9600,
        113.797811, 22.634337, -2.01, 9700, 113.799311, 22.632105, -2.01, 9800,
        113.801758, 22.632125, -2.01,
      ],
    },
  },
];
