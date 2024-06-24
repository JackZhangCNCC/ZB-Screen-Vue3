<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { kjypfx } from "@/api";
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
  kjypfx(params)
    .then((res) => {
      console.log("右下--抗菌药品分析 ", res);
      if (res.code === "10000") {
        const legend = res.result.map((item: { 类型: string; 金额: any; }) => {
          return {
            name: item.类型 || "其他",
            icon: "circle",
          }
        });
        const data = res.result.map((item: { 类型: string; 金额: any; }) => {
          return {
            name: item.类型 || "其他",
            value: item.金额,
          };
        });
        setOption(legend, data);
      } else {
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    })
    .catch((err) => {
      console.log("🚀 ~ getData ~ err:", err)
      ElMessage.error(err);
    });
};
const setOption = async (legend: any[], data: any[]) => {
  option.value = {
    color: ["#4BD19D", "#F5C039", "#489AED"],
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} (占比{d}%)",
      textStyle: {
        fontSize: 14,
      },
    },
    legend: {
      data: legend,
      orient: "vertical",
      left: "5%",
      top: "5%",
      itemWidth: 8,
      itemHeight: 8,
      borderRadius: "50%",
      itemGap: 10,
      textStyle: {
        color: "#",
        fontSize: 10,
      },
    },
    series: [
      {
        name: "金额",
        type: "pie",
        clockwise: false,
        startAngle: 90,
        radius: "65%",
        center: ["50%", "52%"],
        hoverAnimation: false,
        roseType: "radius", //area
        data: data,
        itemStyle: {
          normal: {
            borderColor: "#081111",
            borderWidth: "8",
          },
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}:{c}",
          fontSize: 10,
          color: "#BDC2C2",
        },
        labelLine: {
          normal: {
            length: 8,
            length2: 16,
            lineStyle: {
              width: 1,
              // color: "#BDC2C2",
            },
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
