<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { xdzxbgl } from "@/api";
import { graphic } from "echarts/core";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";

const option = ref({});
const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime,
  };
  xdzxbgl(params)
    .then((res) => {
      console.log("左下--心电中心报告量 ", res);
      if (res.code === "10000") {
        const xData: string[] = [];
        const yData: Number[] = [];

        res.result.forEach((item: { 月份: string; 数量: any }) => {
          xData.push(item.月份 + "月");
          yData.push(item.数量);
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
      console.log("🚀 ~ getData ~ err:", err);
      ElMessage.error(err);
    });
};
const setOption = async (xData: any[], yData: any[]) => {
  option.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(255,255,255,0)", // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: "rgba(255,255,255,1)", // 100% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255,255,255,0)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    },
    grid: {
      top: "14%",
      left: "10%",
      right: "4%",
      bottom: "10%",
      // containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: xData,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#326D7B",
          },
        },
        axisLabel: {
          margin: 10,
          color: "#BDC2C2",
          textStyle: {
            fontSize: 10,
          },
        },
        axisTick: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "数量", // 这里设置了 y 轴的单位
        nameTextStyle: {
          color: "#BDC2C2",
          padding: [0, 42, -5, 0]
        },
        axisLabel: {
          formatter: "{value}",
          color: "#BDC2C2",
          fontSize: 10,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#326D7B",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: "#ffffff",
            type: "dotted",
            opacity: 0.33,
          },
        },
        lineStyle: {
          width: 1,
          color: "#dddddd",
          type: "dotted",
          opacity: 0.33,
        },
      },
    ],
    series: [
      {
        type: "bar",
        data: yData,
        barWidth: "6px",
        itemStyle: {
          normal: {
            barBorderRadius: 0,
            color: new graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(80,198,220,1)", // 0% 处的颜色
                },
                {
                  offset: 0.4,
                  color: "rgba(55,121,139,1)", // 100% 处的颜色
                },
                {
                  offset: 0.75,
                  color: "rgba(55,121,139,0.25)", // 100% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(55,121,139,0.1)", // 100% 处的颜色
                },
              ],
              false
            ),
            shadowColor: "rgba(238,189,98,1)",
            shadowBlur: 0,
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
