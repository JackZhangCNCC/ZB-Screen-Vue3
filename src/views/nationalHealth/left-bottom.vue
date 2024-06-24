<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { wszygk } from "@/api";
import { graphic } from "echarts/core";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";
import { randomColor } from "@/utils/colorUtils";

const option = ref({});
// 颜色数组
const colors = [
  [
    { offset: 0, color: "rgba(212,62,104,1)" },
    { offset: 0.4, color: "rgba(212,62,104,0.75)" },
    { offset: 0.75, color: "rgba(212,62,104,0.45)" },
    { offset: 1, color: "rgba(212,62,104,0.1)" }
  ],
  [
    { offset: 0, color: "rgba(24,144,250,1)" },
    { offset: 0.4, color: "rgba(24,144,250,0.75)" },
    { offset: 0.75, color: "rgba(24,144,250,0.45)" },
    { offset: 1, color: "rgba(24,144,250,0.1)" }
  ],
  [
    { offset: 0, color: "rgba(42,156,148,1)" },
    { offset: 0.4, color: "rgba(42,156,148,0.75)" },
    { offset: 0.75, color: "rgba(42,156,148,0.45)" },
    { offset: 1, color: "rgba(42,156,148,0.1)" }
  ],
  [
    { offset: 0, color: "rgba(194,129,40,1)" },
    { offset: 0.4, color: "rgba(194,129,40,0.75)" },
    { offset: 0.75, color: "rgba(194,129,40,0.45)" },
    { offset: 1, color: "rgba(194,129,40,0.1)" }
  ]
];

const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime,
  };
  wszygk(params)
  .then((res) => {
    console.log("左下--卫生资源概况 ", res);
    if (res.code === "10000") {
      const seriesData = res.result.map((item: { 名称: any; 每千人口技术人员数目: any; 每千人口职业教师数: any; 每千人口注册护士数: any; 每千人口床位数: any; }, index: number) => {
        let color;
        if (index < colors.length) {
          color = colors[index];
        } else {
          const RC = randomColor();
          color = [
            { offset: 0, color: `${RC},1)` },
            { offset: 0.4, color: `${RC},0.75)` },
            { offset: 0.75, color: `${RC},0.45)` },
            { offset: 1, color: `${RC},0.1)` }
          ];
        }

        return {
          name: item.名称,
          type: 'bar',
          barMaxWidth: "16px",
          barGap: "33%",
          data: [
            item.每千人口技术人员数目,
            item.每千人口职业教师数,
            item.每千人口注册护士数,
            item.每千人口床位数
          ],
          itemStyle: {
            normal: {
              barBorderRadius: 0,
              color: new graphic.LinearGradient(0, 0, 0, 1, color, false),
              shadowColor: "rgba(238,189,98,1)",
              shadowBlur: 0,
            },
          },
        };
      });

      setOption(seriesData);
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
const setOption = async (seriesData: any[]) => {
  option.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {
      orient: "horizontal",
      left: "5%",
      top: "3%",
      itemWidth: 8,
      itemHeight: 8,
      borderRadius: "50%",
      itemGap: 10,
      textStyle: {
        color: "#dddddd",
        fontSize: 10,
      },
    },
    grid: {
      top: "18%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["每千人口技术人员数目", "每千人口职业教师数", "每千人口注册护士数", "每千人口床位数"],
        axisLine: {
          show: true,
          lineStyle: {
            color: "#326D7B",
          },
        },
        axisLabel: {
          margin: 10,
          color: "#999999",
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
        axisLine: {
          show: true,
          lineStyle: {
            color: "#326D7B",
          },
        },
        axisLabel: {
          margin: 10,
          color: "#999999",
          textStyle: {
            fontSize: 10,
          },
          formatter: "{value}",
        },
        axisTick: {
          show: false,
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
    series: seriesData
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
