<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { qywzwjg } from "@/api";
import { graphic, use } from "echarts/core";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";

const option = ref({});

const getArrByKey = (data: any[], k: string) => {
  let key = k || "value";
  let res: any[] = [];
  if (data) {
    data.forEach(function (t: { [x: string]: any; }) {
      res.push(t[key]);
    });
  }
  return res;
};
const opt = {
  index: 0,
};
const color = ["#FC619D", "#FF904D", "#48BFE3"];

const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime,
  };
  qywzwjg(params)
    .then((res) => {
      console.log("左下--医域外转往机构Top5", res);
      if (res.code === "10000") {
        let yData = [];
        let sum = res.result.reduce((total: any, item: { [x: string]: any; }) => total + item["转诊人数"], 0);
        yData = res.result.map((item: { 机构: string; 转诊人数: any }) => {
          return {
            name: item.机构 || '其他医院',
            value: item.转诊人数 || 0,
            sum
          };
        });
        yData = yData.sort((a: { value: number; }, b: { value: number; }) => {
          return b.value - a.value;
        });
        setOption(yData);
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

const setOption = async (data: any[]) => {
  option.value = {
    grid: {
      left: "-26%",
      right: "0%",
      top: "12%",
      bottom: "-12%",
      containLabel: true,
    },
    xAxis: {
      show: false,
    },
    yAxis: [
      {
        triggerEvent: true,
        show: true,
        inverse: true,
        data: getArrByKey(data, "name"),
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          color: "#BDC2C2",
          height: 24,
          lineHeight: 0,
          margin: 37,
          fontSize: 12,
          align: "left",
          formatter: function (value: string, index: string | number) {
            if (opt.index === 0 && index < 3) {
              return (
                "{idx" + index + "|" + (1 + index) + "} {title|" + value + "}"
              );
            } else if (opt.index !== 0 && index + opt.index < 9) {
              return (
                "{idx|0" + (1 + index + opt.index) + "} {title|" + value + "}"
              );
            } else {
              return (
                "{idx|" + (1 + index + opt.index) + "} {title|" + value + "}"
              );
            }
          },
          rich: {
            idx0: {
              color: "#ffffff",
              backgroundColor: "#5D1B1C",
              borderRadius: 0,
              padding: [5, 8],
            },
            idx1: {
              color: "#ffffff",
              backgroundColor: "#01B599",
              borderRadius: 0,
              padding: [5, 8],
            },
            idx2: {
              color: "#ffffff",
              backgroundColor: "#19CCF1",
              borderRadius: 0,
              padding: [5, 8],
            },
            idx: {
              color: "#ffffff",
              backgroundColor: "#654E26",
              borderRadius: 0,
              padding: [5, 8],
            },
            title: {
              width: 165,
              padding: [0, 8],
            },
          },
        },
      },
      {
        triggerEvent: true,
        show: true,
        inverse: true,
        data: getArrByKey(data, "name"),
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          color: "#BDC2C2",
          align: "left",
          margin: 20,
          fontSize: 12,
          formatter: function (value, index) {
                return data[index].value + ' '
            },
          // formatter: "本院无法治疗需转至上级医疗机构",
        },
      },
    ],
    series: [
      {
        name: "条",
        type: "bar",
        yAxisIndex: 0,
        data: data,
        barWidth: 7,
        itemStyle: {
          normal: {
            barBorderRadius: [0, 0, 0, 0],
            color: new graphic.LinearGradient(
              1,
              0,
              0,
              0,
              [
                {
                  offset: 0,
                  color: "rgba(93, 238, 253, 1.0)",
                },
                {
                  offset: 0.25,
                  color: "rgba(93, 238, 253, 0.75)",
                },
                {
                  offset: 0.5,
                  color: "rgba(93, 238, 253, 0.5)",
                },
                {
                  offset: 0.75,
                  color: "rgba(93, 238, 253, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(93, 238, 253, 0.02)",
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
