<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { zzmdfx } from "@/api";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";

const index = ref(0);
const data = ref([]);
const colorList = ref([
  "#EEA35A",
  "#1AD598",
  "#0190FF",
  "#DB5AEE",
  "#3B36DC",
  "#9E87FF",
  "#73DDFF",
]);
const option = ref({});
const chartRef = ref(null);
const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime,
  };
  zzmdfx(params)
    .then((res) => {
      console.log("中右--转诊目的分析 ", res);
      if (res.code === "10000") {
        data.value = res.result.map((item: { 类型: string; 转诊人数: any }) => {
          return {
            name: item.类型 || "其他",
            value: item.转诊人数,
          };
        });
        setOption(data.value);
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
const setOption = async (data: any[]) => {
  option.value = {
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} (占比{d}%)",
      textStyle: {
        fontSize: 14,
      },
    },
    series: [
      {
        type: "pie",
        center: ["50%", "54%"],
        radius: ["46%", "69%"],
        clockwise: true,
        avoidLabelOverlap: true,
        hoverOffset: 30,
        emphasis: {
          itemStyle: {
            borderColor: "#081111",
            borderWidth: 4,
          },
        },
        itemStyle: {
          normal: {
            color: function (params) {
              return colorList.value[params.dataIndex];
            },
          },
        },
        label: {
          textStyle: {
            color: "#BDC2C2",
            fontSize: 10,
          },
          show: true,
          position: "outside",
          formatter: "{a|{b}：{d}%}\n{hr|}",
          rich: {
            hr: {
              backgroundColor: "t",
              borderRadius: 3,
              width: 3,
              height: 3,
              padding: [3, 3, 0, -12],
            },
            a: {
              padding: [-30, 15, -20, 15],
            },
          },
        },
        labelLine: {
          normal: {
            length: 10,
            length2: 22,
            lineStyle: {
              width: 1,
            },
          },
        },
        data: data,
      },
    ],
  };
};
const doTime = async (data: any[]) => {
  const timer = setInterval(() => {
    console.log(index.value);
    chartRef.value.dispatchAction({
      type: "hideTip",
      seriesIndex: 0,
      dataIndex: index.value,
    });
    // 显示提示框
    chartRef.value.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: index.value,
    });
    // 取消高亮指定的数据图形
    chartRef.value.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: index.value == 0 ? 5 : index.value - 1,
    });
    chartRef.value.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: index.value,
    });
    index.value++;
    if (index.value > data.value.length - 1) {
      index.value = 0;
    }
  }, 3000);
}
onMounted(() => {
  // getData();
  watchEffect(() => {
    // 当 dateState.stime 或 dateState.etime 发生变化时，重新获取数据
    if (dateState.stime || dateState.etime || hospitalName.name) {
      getData();
    }
  });
  // doTime();
});
</script>

<template>
  <v-chart
    ref="chartRef"
    class="chart"
    :option="option"
    v-if="JSON.stringify(option) != '{}'"
  />
</template>

<style scoped lang="scss"></style>
