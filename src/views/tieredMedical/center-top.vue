<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { mnzzsj } from "@/api";
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
  mnzzsj(params)
    .then((res) => {
      console.log("中上--每年转诊数据 ", res);
      if (res.code === "10000") {
        const xData: string[] = [];
        const yData: Number[] = [];

        res.result.forEach((item: { 类型: string; 转诊人数: any; 年: any }) => {
          xData.push(item.年 + "年");
          yData.push(item.转诊人数);
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
        type: "shadow",
      },
    },
    grid: {
      top: "15%",
      right: "3%",
      left: "4%",
      bottom: "8%",
    },
    xAxis: [
      {
        type: "category",
        data: xData,
        axisLine: {
          lineStyle: {
            color: "#BDC2C2",
          },
        },
        axisLabel: {
          margin: 10,
          color: "#BDC2C2",
          textStyle: {
            fontSize: 12,
          },
        },
        axisTick: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: "{value}",
          color: "#BDC2C2",
          fontSize: 12,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "rgba(0,186,255,.6)",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.12)",
          },
        },
        lineStyle: {
          width: 1,
          color: "#BDC2C2",
          type: "dotted",
          opacity: 0.33,
        },
      },
    ],
    series: [
      {
        type: "bar",
        data: yData,
        barWidth: "26px",
        itemStyle: {
          normal: {
            barBorderRadius: 3,
            color: new graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(100,237,253,1)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(69,168,249,1)", // 100% 处的颜色
                },
              ],
              false
            ),
            shadowColor: "rgba(0,160,221,1)",
            shadowBlur: 4,
          },
        },
        // label: {
        //   normal: {
        //     show: true,
        //     lineHeight: 30,
        //     formatter: "{c}",
        //     position: "top",
        //     textStyle: {
        //       color: "#00D6F9",
        //       fontSize: 14,
        //     },
        //   },
        // },
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
