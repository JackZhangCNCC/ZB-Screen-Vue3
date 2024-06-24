<script setup lang="ts">
import { watchEffect, ref, onMounted, Ref } from "vue";
import { dzblk, jkdak, qyrkk, wszyk } from "@/api";
import { graphic } from "echarts/core";
import { ElMessage, MessageParamsWithType } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";
import { randomColor } from "@/utils/colorUtils";

const params = {
  orgname: hospitalName.name,
  stime: dateState.stime,
  etime: dateState.etime,
};
const options = [ref({}), ref({}), ref({}), ref({})];
const apis = [dzblk, jkdak, qyrkk, wszyk];
const title = ["电子病历库", "健康档案库", "全员人口库", "卫生资源库"];

const getData = async (apiIndex: number) => {
  try {
    const res = await goData(apis[apiIndex]);
    if (res) {
      console.log("右上是--四大库构成展示", res);
      if (apiIndex == 0) {
        const legend = res.result.map((item: { 类型: string; 份数: any }) => {
          return {
            name: item.类型 || "其他",
            icon: "circle",
          };
        });
        const data = res.result.map((item: { 类型: string; 份数: any }) => {
          return {
            name: item.类型 || "其他",
            value: item.份数,
          };
        });
        setOption(apiIndex, legend, data);
      } else if (apiIndex == 1) {
        const xData: string[] = [];
        const yData: Number[] = [];

        res.result.forEach((item: { 类别: string; 数量: any }) => {
          xData.push(item.类别);
          yData.push(item.数量);
        });

        setOption(apiIndex, xData, yData);
      } else if (apiIndex == 2) {
        const xData: string[] = [];
        const yData: Number[] = [];

        res.result.forEach((item: { 类别: string; 数量: any }) => {
          xData.push(item.类别);
          yData.push(item.数量);
        });

        setOption(apiIndex, xData, yData);
      } else if (apiIndex == 3) {
        const data = res.result.map(
          (item: { 类别: string; 数量: any }, index: number) => {
            const color = randomColor();
            return {
              name: item.类别,
              value: item.数量,
              itemStyle: {
                color: `${color},0.7)`,
                // borderColor: `${color},1)`,
                // borderWidth: 3,
              },
            };
          }
        );
        setOption(apiIndex, data, data);
      }
    }
  } catch (err) {
    console.log("🚀 ~ getData ~ err:", err);
    ElMessage.error(err);
  }
};

const goData = (api: {
  (param?: any): Promise<any>;
  (arg0: { orgname: string; stime: string; etime: string }): Promise<any>;
}) => {
  return api(params)
    .then((res: any) => {
      return res;
    })
    .catch((err: MessageParamsWithType) => {
      ElMessage.error(err);
    });
};

const setOption = async (apiIndex: any, xData: any[], yData: any[]) => {
  if (apiIndex == 0) {
    options[apiIndex].value = {
      color: ["#4BD19D", "#F5C039", "#489AED"],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} (占比{d}%)",
        textStyle: {
          fontSize: 14,
        },
      },
      legend: {
        data: xData,
        orient: "vertical",
        left: "0%",
        top: "12%",
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
          radius: "75%",
          center: ["50%", "55%"],
          hoverAnimation: false,
          roseType: "radius", //area
          data: yData,
          itemStyle: {
            normal: {
              borderColor: "#081111",
              borderWidth: "6",
            },
          },
          label: {
            show: true,
            position: "outside",
            fontSize: 10,
            color: "#BDC2C2",
            formatter: "{b} {c}万",
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
  } else if (apiIndex == 1) {
    options[apiIndex].value = {
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
        top: "16%",
        left: "10%",
        right: "4%",
        bottom: "12%",
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
          nameTextStyle: {
            color: "#BDC2C2",
            padding: [0, 42, -5, 0],
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
          barWidth: "10px",
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
                    color: "rgba(238,189,98,1)", // 0% 处的颜色
                  },
                  {
                    offset: 0.4,
                    color: "rgba(169,124,50,1)", // 100% 处的颜色
                  },
                  {
                    offset: 0.75,
                    color: "rgba(169,124,50,0.25)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(169,124,50,0.1)", // 100% 处的颜色
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
  } else if (apiIndex == 2) {
    options[apiIndex].value = {
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
        top: "16%",
        left: "10%",
        right: "4%",
        bottom: "12%",
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
          nameTextStyle: {
            color: "#BDC2C2",
            padding: [0, 42, -5, 0],
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
          barWidth: "10px",
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
  } else if (apiIndex == 3) {
    options[apiIndex].value = {
      legend: {
        data: xData,
        orient: "vertical",
        left: "0%",
        top: "12%",
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: "50%",
        itemGap: 10,
        textStyle: {
          color: "#dddddd",
          fontSize: 10,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      series: [
        {
          name: "半径模式",
          type: "pie",
          radius: ["30%", "80%"],
          center: ["50%", "50%"],
          roseType: "radius",
          label: {
            show: false,
            normal: {
              color: "#dddddd",
              position: "outside",
              fontSize: 11,
              formatter: "{b}人员 {c}人",
            },
          },
          labelLine: {
            length: 1,
            length2: 20,
            smooth: true,
          },
          data: xData, // 使用接口返回的数据
        },
        {
          name: "内部模式",
          type: "pie",
          radius: ["30%", "80%"],
          center: ["50%", "50%"],
          roseType: "radius",
          label: {
            show: true,
            position: "inside",
            color: "#ffffff",
            fontSize: 9,
            formatter: "{d}%",
          },
          data: xData, 
        },
      ],
    };
  }
};
onMounted(() => {
  // getData();
  watchEffect(() => {
    // 当 dateState.stime 或 dateState.etime 发生变化时，重新获取数据
    if (dateState.stime || dateState.etime || hospitalName.name) {
      options.forEach((option, index) => {
        getData(index);
      });
    }
  });
});
</script>

<template>
  <div class="content">
    <div
      class="options"
      :class="'options' + (index + 1)"
      v-for="(option, index) in options"
      :key="index"
    >
      <span class="title" v-if="JSON.stringify(option.value) != '{}'">{{
        title[index]
      }}</span>
      <v-chart
        class="chart"
        :option="option.value"
        v-if="JSON.stringify(option.value) != '{}'"
      />
    </div>
  </div>
</template>


<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-end;
  justify-content: space-between;
  align-items: center;
  .options {
    position: relative;
    span.title {
      position: absolute;
      left: 21px;
      top: 7px;
      font-size: 13px;
      color: #cccccc;
    }
    span.title::before {
      content: "";
      display: block;
      width: 2px;
      height: 12px;
      background-color: #6ef2f1;
      position: absolute;
      left: -13px;
      top: 3px;
      margin: 0 5px;
    }
    .chart {
      width: 444.5px;
      height: 195px;
      border: 1px solid #308f97;
      padding: 8px;
    }
  }
  .options {
  }
  .options {
  }
  .options {
    margin-top: 10px;
  }
  .options {
    margin-top: 10px;
  }
}
</style>
