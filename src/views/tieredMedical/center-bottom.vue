<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { hznlfb } from "@/api";
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
  hznlfb(params)
    .then((res) => {
      console.log("中下--患者年龄性别 ", res);
      if (res.code === "10000") {
        const dataMan: any[] = [];
        const dataWoman: any[] = [];
        // 提取所有的年龄段
        const yearsOlds: any[] = [...new Set(res.result.map((item: { 年龄: any; }) => item.年龄))];

        yearsOlds.forEach((year) => {
          const manData = res.result.find((item: { 年龄: any; 性别: string; }) => item.年龄 === year && item.性别 === "男");
          const womanData = res.result.find((item: { 年龄: any; 性别: string; }) => item.年龄 === year && item.性别 === "女");

          dataMan.push(manData ? manData.转诊人数 : 0);
          dataWoman.push(womanData ? womanData.转诊人数 : 0);
        });

        setOption(dataMan, dataWoman, yearsOlds);
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
const setOption = async (dataMan: any[], dataWoman: any[], yearsOlds: any[]) => {
  option.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "#57617B",
        },
      },
    },
    legend: {
      orient: "horizontal",
      right: "5%",
      top: "0%",
      itemWidth: 8,
      itemHeight: 8,
      borderRadius: "50%",
      itemGap: 10,
      textStyle: {
        color: "#",
        fontSize: 10,
      },
    },
    grid: {
      left: "2%",
      right: "3%",
      top: "20%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: "##399CA4",
          },
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 11,
            color: "#BDC2C2",
          },
        },
        data: yearsOlds,
      },
    ],
    yAxis: [
      {
        type: "value",
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#399CA4",
          },
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 11,
            color: "#BDC2C2",
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
      }
      },
    ],
    series: [
      {
        name: "男",
        type: "line",
        smooth: true,
        lineStyle: {
          normal: {
            width: 1,
          },
        },
        areaStyle: {
          normal: {
            color: new graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(0, 238, 254, 0.9)",
                },
                {
                  offset: 0.25,
                  color: "rgba(0, 238, 254, 0.75)",
                },
                {
                  offset: 0.5,
                  color: "rgba(0, 238, 254, 0.5)",
                },
                {
                  offset: 0.75,
                  color: "rgba(0, 238, 254, 0.33)",
                },
                {
                  offset: 1,
                  color: "rgba(0, 238, 254, 0.15)",
                },
              ],
              false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowBlur: 20,
          },
        },
        itemStyle: {
          normal: {
            color: "rgb(0, 238, 254)",
          },
        },
        data: dataMan,
      },
      {
        name: "女",
        type: "line",
        smooth: true,
        lineStyle: {
          normal: {
            width: 1,
          },
        },
        areaStyle: {
          normal: {
            color: new graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(255, 174, 28, 0.9)",
                },
                {
                  offset: 0.25,
                  color: "rgba(255, 174, 28, 0.75)",
                },
                {
                  offset: 0.5,
                  color: "rgba(255, 174, 28, 0.5)",
                },
                {
                  offset: 0.75,
                  color: "rgba(255, 174, 28, 0.33)",
                },
                {
                  offset: 1,
                  color: "rgba(255, 174, 28, 0.15)",
                },
              ],
              false
            ),
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowBlur: 10,
          },
        },
        itemStyle: {
          normal: {
            color: "rgb(255, 174, 28)",
          },
        },
        data: dataWoman,
      }
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
