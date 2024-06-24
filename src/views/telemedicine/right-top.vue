<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { sqhzsl } from "@/api";
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
  sqhzsl(params)
    .then((res) => {
      console.log("左上--远程会诊数量 ", res);
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
      top: "12%",
      left: "8%",
      right: "4%",
      bottom: "10%",
      // containLabel: true
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#399CA4",
          },
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 10,
            color: "#5DEBE6",
          },
        },
        data: xData,
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
            fontSize: 10,
            color: "#5DEBE6",
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
      },
    ],
    series: [
      {
        name: "数量",
        type: "line",
        // smooth: true, //是否平滑曲线显示
        // symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
        showAllSymbol: true,
        // symbol: 'image://./static/images/guang-circle.png',
        symbolSize: 4,
        lineStyle: {
          normal: {
            width: 1,
            color: "#53fdfe", // 线条颜色
          },
          borderColor: "#f0f",
        },
        label: {
          show: true,
          position: "top",
          textStyle: {
            fontSize: 10,
            color: "#dddddd",
          },
        },
        itemStyle: {
          normal: {
            color: "rgba(93,235,230,1)",
          },
        },
        tooltip: {
          show: false,
        },
        areaStyle: {
          //区域填充样式
          normal: {
            //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
            color: new graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(65,186,198,0.9)",
                },
                {
                  offset: 0.5,
                  color: "rgba(65,186,198,0.6)",
                },
                {
                  offset: 1,
                  color: "rgba(15,20,19,0.1)",
                },
              ],
              false
            ),
            shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
            shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
          },
        },
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
