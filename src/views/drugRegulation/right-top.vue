<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { ypxhqkpm } from "@/api";
import { graphic } from "echarts/core";
import { ElMessage } from "element-plus";
import { dateState } from '@/enums/dateState';
import { hospitalName } from '@/enums/hospitalName';

const option = ref({});
const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime
  };
  ypxhqkpm(params)
    .then((res) => {
      console.log("右上--药品消耗情况排名 ", res);
      if (res.code === "10000") {
        const xData: string[] = [];
        const yData: { name: string; value: any }[] = [];
        const yData2: { name: string; value: any }[] = [];

        res.result.forEach((item: { 医院: string; 住院消耗: any; 门诊消耗: any ; 总消耗: any }) => {
          xData.push(item.医院);
          yData.push({
            name: "住院消耗",
            value: item.住院消耗,
          });
          yData2.push({
            name: "门诊消耗",
            value: item.门诊消耗,
          });
        });

        setOption(xData, yData, yData2);
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
const setOption = async (xData: any[], yData: any[], yData2: any[]) => {
  option.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any[], ticket: any, callback: any) {
        const item = params[0];
        const item2 = params[1];
        return `${item.axisValue}
        <br/>
        ${item.name}: ${item.value}
        <br/>
        ${item2.name}: ${item2.value}`;
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      top: "5%",
      bottom: "0%",
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
        // rotate: 15,
        // fontSize: 9,
        fontSize: 7,
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
        name: "门诊消耗",
        type: "bar",
        data: yData,
        barWidth: 15,
        barGap: 0.5, //柱间距离
        label: {
          //图形上的文本标签
          normal: {
            show: true,
            position: "top",
            textStyle: {
              color: "#a8aab0",
              fontStyle: "normal",
              fontFamily: "微软雅黑",
              fontSize: 11,
            },
          },
        },
        itemStyle: {
          //图形样式
          normal: {
            barBorderRadius: [0, 0, 0, 0],
            color: new graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(27, 139, 254, 1.0)",
                },
                {
                  offset: 0.25,
                  color: "rgba(27, 139, 254, 0.85)",
                },
                {
                  offset: 0.5,
                  color: "rgba(27, 139, 254, 0.65)",
                },
                {
                  offset: 0.75,
                  color: "rgba(27, 139, 254, 0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(27, 139, 254, 0.3)",
                }
              ],
              false
            ),
          },
        },
      },
      {
        name: "住院消耗",
        type: "bar",
        data: yData2,
        barWidth: 15,
        barGap: 0.5, //柱间距离
        label: {
          //图形上的文本标签
          normal: {
            show: true,
            position: "top",
            textStyle: {
              color: "#a8aab0",
              fontStyle: "normal",
              fontFamily: "微软雅黑",
              fontSize: 11,
            },
          },
        },
        itemStyle: {
          //图形样式
          normal: {
            barBorderRadius: [0, 0, 0, 0],
            color: new graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(220, 62, 110, 1.0)",
                },
                {
                  offset: 0.25,
                  color: "rgba(220, 62, 110, 0.85)",
                },
                {
                  offset: 0.5,
                  color: "rgba(220, 62, 110, 0.65)",
                },
                {
                  offset: 0.75,
                  color: "rgba(220, 62, 110, 0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(220, 62, 110, 0.3)",
                }
              ],
              false
            ),
          },
        },
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
