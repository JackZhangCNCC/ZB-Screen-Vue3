<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { zzjbpm } from "@/api";
import { graphic, use } from "echarts/core";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";

const option = ref({});
const topThree = ref([
  {
    name: "其他",
    value: 0,
  },
  {
    name: "其他",
    value: 0,
  },
  {
    name: "其他",
    value: 0,
  }
]);

const getArrByKey = (data: any[], k: string) => {
  let key = k || "value";
  let res: any[] = [];
  if (data) {
    data.forEach(function (t: { [x: string]: any }) {
      res.push(t[key]);
    });
  }
  return res;
};
const opt = {
  index: 0,
};

const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime,
  };
  zzjbpm(params)
    .then((res) => {
      console.log("右上--转诊疾病排名Top5", res);
      if (res.code === "10000") {
        let yData = [];
        let sum = res.result.reduce(
          (total: any, item: { [x: string]: any }) => total + item["转诊人数"],
          0
        );
        yData = res.result.map((item: { 疾病: string; 转诊人数: any }) => {
          return {
            name: item.疾病 || "其他疾病",
            value: item.转诊人数 || 0,
            sum,
          };
        });

        // 如果 yData 的长度小于3，就添加缺失的元素
        while (yData.length < 3) {
          yData.push({
            name: "其他",
            value: 0,
            sum: 0,
          });
        }

        yData = yData.sort((a: { value: number }, b: { value: number }) => {
          return b.value - a.value;
        });

        // 获取前三名的数据
        topThree.value = yData.slice(0, 3);

        // 获取第四名及以后的数据
        let restData = yData.slice(3);

        setOption(restData);
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
      left: "10%",
      right: "2%",
      top: "12%",
      bottom: "2%",
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
          color: "#dddddd",
          height: 24,
          lineHeight: 0,
          margin: 37,
          fontSize: 12,
          align: "left",
          formatter: function (value: string, index: string | number) {
            if (opt.index === 0 && index < 3) {
              return (
                "{idx" + index + "|" + (4 + index) + "} {title|" + value + "}"
              );
            } else if (opt.index !== 0 && index + opt.index < 9) {
              return (
                "{idx|0" + (4 + index + opt.index) + "} {title|" + value + "}"
              );
            } else {
              return (
                "{idx|" + (4 + index + opt.index) + "} {title|" + value + "}"
              );
            }
          },
          rich: {
            idx0: {
              color: "#ffffff",
              backgroundColor: new graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: "rgba(7, 131, 147, 1.0)",
                  },
                  {
                    offset: 1,
                    color: "rgba(6, 70, 71, 0.9)",
                  },
                ],
                false
              ),
              borderRadius: 50,
              borderColor: "#55D9E6",
              borderWidth: 1,
              padding: [5, 8],
            },
            idx1: {
              color: "#ffffff",
              backgroundColor: new graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: "rgba(7, 131, 147, 1.0)",
                  },
                  {
                    offset: 1,
                    color: "rgba(6, 70, 71, 0.9)",
                  },
                ],
                false
              ),
              borderColor: "#55D9E6",
              borderWidth: 1,
              borderRadius: 50,
              padding: [5, 8],
            },
            idx2: {
              color: "#ffffff",
              backgroundColor: new graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: "rgba(7, 131, 147, 1.0)",
                  },
                  {
                    offset: 1,
                    color: "rgba(6, 70, 71, 0.9)",
                  },
                ],
                false
              ),
              borderColor: "#55D9E6",
              borderWidth: 1,
              borderRadius: 50,
              padding: [5, 8],
            },
            idx: {
              color: "#ffffff",
              backgroundColor: new graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: "rgba(7, 131, 147, 1.0)",
                  },
                  {
                    offset: 1,
                    color: "rgba(6, 70, 71, 0.9)",
                  },
                ],
                false
              ),
              borderColor: "#55D9E6",
              borderWidth: 1,
              borderRadius: 50,
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
          color: "#dddddd",
          align: "center",
          lineHeight: 26,
          margin: -4,
          verticalAlign: "bottom",
          fontSize: 12,
          formatter: function (value, index) {
            return data[index].value + " ";
          },
          // formatter: "本院无法治疗需转至上级医疗机构",
        },
      },
    ],
    series: [
      {
        // 这是背景条
        name: "背景",
        type: "bar",
        barGap: 4,
        yAxisIndex: 1,
        barWidth: 10,
        data: data.map(() => topThree.value[2] ? topThree.value[2].value : 0), // 使用第三名的值作为后面图表展示的背景条的最高值
        itemStyle: {
          normal: {
            barBorderRadius: [0, 20, 20, 0],
            color: "rgba(32, 35, 45, 0.5)", // 这是背景条的颜色
          },
        },
      },
      {
        name: "条",
        type: "bar",
        barGap: 4,
        yAxisIndex: 0,
        data: data,
        barWidth: 10,
        itemStyle: {
          normal: {
            barBorderRadius: [0, 20, 20, 0],
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
                },
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
  <div class="content">
    <div class="tops">
      <span class="top2">Top2</span>
      <span class="top1">Top1</span>
      <span class="top3">Top3</span>  
    </div>
    <div class="topNameNums">
      <h5 class="top2NameNum">{{ topThree[1].value || 0 }}人</h5>
      <h5 class="top1NameNum">{{ topThree[0].value || 0 }}人</h5>
      <h5 class="top3NameNum">{{ topThree[2].value || 0 }}人</h5>
    </div>
    <div class="topNames">
      <span class="top2Name" :title="topThree[1].name || '其他'">{{ topThree[1].name || "其他" }}</span>
      <span class="top1Name" :title="topThree[0].name || '其他'">{{ topThree[0].name || "其他" }}</span>
      <span class="top3Name" :title="topThree[2].name || '其他'">{{ topThree[2].name || "其他" }}</span>
    </div>
    <img class="rightTop" src="@/assets/img/tieredMedical/top3.png" />
    <v-chart
      class="chart"
      :option="option"
      v-if="JSON.stringify(option) != '{}'"
    />
  </div>
</template>

<style scoped lang="scss">
.content {
  position: relative;
  .tops {
    position: absolute;
    top: 50px;
    left: 50%;
    width: 367px;
    margin-left: -183.5px;
    z-index: 2;
    span {
      position: absolute;
      width: 50px;
      color: #bdc2c2;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }
    .top1 {
      left: 50%;
      margin-left: -25px;
      top: -26px;
      color: #ffffff;
    }
    .top2 {
      left: 68px;
      margin-left: -25px;
      top: -5px;
    }
    .top3 {
      right: 40px;
      top: 8px;
    }
  }
  .topNameNums {
    position: absolute;
    top: 115px;
    left: 50%;
    width: 367px;
    margin-left: -183.5px;
    z-index: 2;
    h5 {
      position: absolute;
      width: 100px;
      color: #ffffff;
      text-align: center;
      font-size: 17px;
      font-weight: bold;
    }
    .top1NameNum {
      left: 50%;
      margin-left: -50px;
      top: -34px;
    }
    .top2NameNum {
      left: 68px;
      margin-left: -50px;
      top: -13px;
    }
    .top3NameNum {
      right: 10px;
      top: 0px;
    }
  }

  .topNames {
    position: absolute;
    top: 145px;
    left: 50%;
    width: 367px;
    margin-left: -183.5px;
    z-index: 2;
    span {
      position: absolute;
      width: 100px;
      color: #ffffff;
      text-align: center;
      font-size: 13px;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .top1Name {
      left: 50%;
      margin-left: -50px;
      top: -34px;
    }
    .top2Name {
      left: 68px;
      margin-left: -50px;
      top: -13px;
    }
    .top3Name {
      right: 10px;
      top: 0px;
    }
  }

  .rightTop {
    position: absolute;
    top: 50px;
    left: 50%;
    width: 367px;
    height: 158px;
    margin-left: -183.5px;
  }

  .chart {
    position: absolute;
    top: 180px;
    left: -0;
    width: 426px;
    height: 448px;
  }
}
</style>
