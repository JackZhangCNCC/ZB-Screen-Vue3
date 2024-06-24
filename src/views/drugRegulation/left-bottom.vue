<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { jbywyyfx } from "@/api";
import { graphic, use } from "echarts/core";
import { ElMessage } from "element-plus";
import { CustomChart } from "echarts/charts";
import { dateState } from '@/enums/dateState';
import { hospitalName } from '@/enums/hospitalName';

use([CustomChart]);

const offsetX = 20;
const offsetY = 10;

// 绘制左侧面
const CubeLeft = graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function (ctx, shape) {
    const xAxisPoint = shape.xAxisPoint;
    const c0 = [shape.x, shape.y];
    const c1 = [shape.x - offsetX, shape.y - offsetY];
    const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
    const c3 = [xAxisPoint[0], xAxisPoint[1]];
    ctx
      .moveTo(c0[0], c0[1])
      .lineTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .closePath();
  },
});

// 绘制右侧面
const CubeRight = graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function (ctx, shape) {
    const xAxisPoint = shape.xAxisPoint;
    const c1 = [shape.x, shape.y];
    const c2 = [xAxisPoint[0], xAxisPoint[1]];
    const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
    const c4 = [shape.x + offsetX, shape.y - offsetY];
    ctx
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});

// 绘制顶面
const CubeTop = graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function (ctx, shape) {
    const c1 = [shape.x, shape.y];
    const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
    const c3 = [shape.x, shape.y - offsetX];
    const c4 = [shape.x - offsetX, shape.y - offsetY];
    ctx
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});

// 注册三个面图形
graphic.registerShape("CubeLeft", CubeLeft);
graphic.registerShape("CubeRight", CubeRight);
graphic.registerShape("CubeTop", CubeTop);

const option = ref({});

const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime
  };
  jbywyyfx(params)
    .then((res) => {
      console.log("左下--基本药物应用分析", res);
      if (res.code === "10000") {
        let xData = [];
        let yData = [];
        xData = res.result.map((item: { 类型: string; 占比: any }) => {
          return item.类型;
        });
        yData = res.result.map((item: { 类型: string; 占比: any }) => {
          return {
            value: item.占比,
          };
        });
        setOption(xData, yData);
      } else {
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};

const setOption = async (xData: any[], yData: any[]) => {
  option.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params, ticket, callback) {
        const item = params[1];
        return item.name + " : " + item.value;
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      top: "6%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xData,
      axisLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: "#1A7D80",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 10,
        color: "#BDC2C2",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
        lineStyle: {
          width: 2,
          color: "#2B7BD6",
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: "#BDC2C2",
          type: "dotted",
          opacity: 0.33,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 11,
        color: "#1A7D80",
      },
    },
    series: [
      {
        type: "custom",
        renderItem: (params, api) => {
          const location = api.coord([api.value(0), api.value(1)]);
          return {
            type: "group",
            children: [
              {
                type: "CubeLeft",
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#0099E1",
                    },
                    {
                      offset: 1,
                      color: "#032D6A",
                    },
                  ]),
                },
              },
              {
                type: "CubeRight",
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#0168B8",
                    },
                    {
                      offset: 1,
                      color: "#03205B",
                    },
                  ]),
                },
              },
              {
                type: "CubeTop",
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#007FE4",
                    },
                    {
                      offset: 1,
                      color: "#00C4FC",
                    },
                  ]),
                },
              },
            ],
          };
        },
        data: yData,
      },
      {
        type: "bar",
        // label: {
        //   normal: {
        //     show: true,
        //     position: 'top',
        //     formatter: (e) => {
        //       return e.value + '次';
        //     },
        //     fontSize: 16,
        //     color: '#43C4F1',
        //     offset: [0, -25],
        //   },
        // },
        itemStyle: {
          color: "transparent",
        },
        tooltip: {},
        data: yData,
      },
    ],
  };
};

onMounted(() => {
  // getData();
  watchEffect(() => {
    // 当 dateState.stime 或 dateState.etime 发生变化时，重新获取数据
    if (dateState.stime || dateState.etime || hospitalName.name) {
      getData();
    }
  });
});
</script>

<template>
  <v-chart
    class="chart"
    :option="option"
    v-if="JSON.stringify(option) != '{}'"
  />
</template>

<style scoped lang="scss"></style>
