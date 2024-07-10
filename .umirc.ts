import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  plugins: ['umi-cesium-plugin'],
  cesium: {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5Njk3NTYzMS1lNmQwLTQ1MjYtYTE5ZC1hOGUxNWU3NWM2NWYiLCJpZCI6OTYzMTEsImlhdCI6MTcwMTQxNjU0Mn0.DfK_vk5rGeNnCBq8kNAmNgN1wJmNSrm3EefRpnH0nB8',
  },
  routes: [
    {
      path: '/',
      redirect: '/cesium/czmlRoam',
    },
    {
      name: 'Cesium 基于1.108',
      path: '/cesium',
      routes: [
        {
          name: '飞行漫游 czml',
          path: '/cesium/czmlRoam',
          component: './Roam/CzmlCesium',
        },
        {
          name: '飞行漫游 经纬度插值',
          path: '/cesium/lnglatRoam',
          component: './Roam/LnglatRoam',
        },
      ],
    },
    {
      name: '权限演示',
      path: '/access',
      routes: [
        {
          name: ' CRUD 示例',
          path: '/access/table',
          component: './Table',
        },
      ],
    },
  ],
  npmClient: 'pnpm',
});
