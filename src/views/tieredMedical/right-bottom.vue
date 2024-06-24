<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { sxzzywsj } from "@/api";
import { graphic } from "echarts/core";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";

const option = ref({});
const itemStyles = [
  {
    color: "rgba(50,123,250,0.7)",
    borderColor: "rgba(50,123,250,1)",
    borderWidth: 3,
  },
  {
    color: "rgba(244,201,7,0.7)",
    borderColor: "rgba(244,201,7,1)",
    borderWidth: 3,
  },
  {
    color: "rgba(23,216,161,0.7)",
    borderColor: "rgba(23,216,161,1)",
    borderWidth: 3,
  },
  {
    color: "rgba(122,60,235,0.7)",
    borderColor: "rgba(122,60,235,1)",
    borderWidth: 3,
  },
  {
    color: "rgba(15,197,243,0.7)",
    borderColor: "rgba(15,197,243,1)",
    borderWidth: 3,
  },
  {
    color: "rgba(255,99,132,0.7)",
    borderColor: "rgba(255,99,132,1)",
    borderWidth: 3,
  },
  {
    color: "rgba(255,206,86,0.7)",
    borderColor: "rgba(255,206,86,1)",
    borderWidth: 3,
  },
  {
    color: "rgba(75,192,192,0.7)",
    borderColor: "rgba(75,192,192,1)",
    borderWidth: 3,
  },
  {
    color: "rgba(153,102,255,0.7)",
    borderColor: "rgba(153,102,255,1)",
    borderWidth: 3,
  },
  {
    color: "rgba(255,159,64,0.7)",
    borderColor: "rgba(255,159,64,1)",
    borderWidth: 3,
  }
];

const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime,
  };
  sxzzywsj(params)
    .then((res) => {
      console.log("右下--双向转诊业务数据 ", res);
      if (res.code === "10000") {
        const data = res.result.map((item: { 转出机构名称: string; count: any }, index: number) => {
          return {
            name: item.转出机构名称,
            value: item.count,
            itemStyle: itemStyles[index % itemStyles.length], // 使用itemStyles数组来分配itemStyle
          };
        });
        setOption(data);
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
          show: true,
          normal: {
            color: "#dddddd",
            position: "outside",
            fontSize: 11,
          },
        },
        labelLine: {
          length: 1,
          length2: 20,
          smooth: true,
        },
        data: data, // 使用接口返回的数据
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
