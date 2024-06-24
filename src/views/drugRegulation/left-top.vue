<script setup lang="ts">
import { onMounted, watchEffect, ref } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import { jclcypgk } from "@/api";
import { ElMessage } from "element-plus";
import { dateState } from '@/enums/dateState';
import { hospitalName } from '@/enums/hospitalName';

const eCharts = ref(null);
let myChart = null;

let boxHeight: number;
let optionData = ref([]);
const colorMap: { [key: string]: string } = {
  "成药": "#FFB220",
  "西药": "#00B1E7",
  "草药": "#1EBD36",
  // 添加更多类型和颜色
};

const getColor = (type: string) => {
  return colorMap[type] || "#ffffff"; // 如果类型未在 colorMap 中定义，返回默认颜色（这里是白色）
};


const getParametricEquation = (
  startRatio: number,
  endRatio: number,
  isSelected: boolean,
  isHovered: boolean,
  k: number,
  h: number
) => {
  // 计算
  let midRatio = (startRatio + endRatio) / 2;
  let startRadian = startRatio * Math.PI * 2;
  let endRadian = endRatio * Math.PI * 2;
  let midRadian = midRatio * Math.PI * 2;
  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false;
  }
  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== "undefined" ? k : 1 / 3;
  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
  let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  let hoverRate = isHovered ? 1.05 : 1;
  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32,
    },
    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20,
    },
    x: function (u: number, v: number) {
      if (u < startRadian) {
        return (
          offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      if (u > endRadian) {
        return (
          offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
    },
    y: function (u: number, v: number) {
      if (u < startRadian) {
        return (
          offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      if (u > endRadian) {
        return (
          offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
    },
    z: function (u: number, v: number) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u);
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u) * h * 0.1;
      }
      return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
    },
  };
};

const getPie3D = (pieData: any[], internalDiameterRatio: number) => {
  // internalDiameterRatio:透明的空心占比
  let series = [];
  let sumValue = 0;
  let startValue = 0;
  let endValue = 0;

  let k = 1 - internalDiameterRatio;
  pieData.sort((a: { value: number }, b: { value: number }) => {
    return b.value - a.value;
  });
  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value;
    let seriesItem = {
      name:
        typeof pieData[i].name === "undefined" ? `series${i}` : pieData[i].name,
      type: "surface",
      parametric: true,
      wireframe: {
        show: false,
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: k,
      },
      center: ["10%", "50%"],
    };

    if (typeof pieData[i].itemStyle != "undefined") {
      let itemStyle = {};
      typeof pieData[i].itemStyle.color != "undefined"
        ? (itemStyle.color = pieData[i].itemStyle.color)
        : null;
      typeof pieData[i].itemStyle.opacity != "undefined"
        ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
        : null;
      seriesItem.itemStyle = itemStyle;
    }
    series.push(seriesItem);
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value;
    series[i].pieData.startRatio = startValue / sumValue;
    series[i].pieData.endRatio = endValue / sumValue;
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      false,
      false,
      k,
      series[i].pieData.value // 控制各模块高度一致100   控制各模块高度根据value改变
    );
    startValue = endValue;
  }
  boxHeight = getHeight3D(series, 26); //通过传参设定3d饼/环的高度，26代表26PX
  return series;
};

const getHeight3D = (series: any[], height: number) => {
  series.sort(
    (a: { pieData: { value: number } }, b: { pieData: { value: number } }) => {
      return b.pieData.value - a.pieData.value;
    }
  );
  return (height * 25) / (series[0].pieData.value || 1);
};

const initCharts = async () => {
  myChart = echarts.init(eCharts.value);
  const series = getPie3D(optionData.value, 0);
  series.push({
    name: "pie2d",
    type: "pie",
    label: {
      opacity: 1,
      fontSize: 11,
      lineHeight: 0,
    },
    labelLine: {
      length: 10,
      length2: 35,
    },
    startAngle: 0, //起始角度，支持范围[0, 360]。
    clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
    radius: ["50%", "55%"],
    center: ["50%", "57%"],
    data: optionData.value,
    itemStyle: {
      opacity: 0,
    },
  });
  optionData.value.forEach((item) => {
    item.label = {
      //   color: item.itemStyle.color,
      show: true,
      formatter: "{b}/{d}",
      fontSize: 10,
      color: "#ffffff",
      rich: {
        b: {
          fontSize: 11,
          lineHeight: 0,
        },
      },
    };
  });
  let option = {
    legend: {
      data: [
        {
          name: "西药",
          icon: "circle",
        },
        {
          name: "成药",
          icon: "circle",
        },
        {
          name: "草药",
          icon: "circle",
        },
      ],
      orient: "vertical",
      left: "5%",
      top: "7%",
      itemWidth: 8,
      itemHeight: 8,
      borderRadius: "50%",
      itemGap: 10,
      textStyle: {
        color: "#",
        fontSize: 10,
      },
    },
    xAxis3D: {
      min: -1,
      max: 1,
    },
    yAxis3D: {
      min: -1,
      max: 1,
    },
    zAxis3D: {
      min: -1,
      max: 1,
    },
    grid3D: {
      show: false,
      top: 0, // 距离上边的间距
      boxHeight, // 圆环的高度
      viewControl: {
        // 3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 25, // 角度
        distance: 340, // 调整视角到主体的距离，类似调整zoom
        rotateSensitivity: 0, // 设置为0无法旋转
        zoomSensitivity: 0, // 设置为0无法缩放
        panSensitivity: 0, // 设置为0无法平移
        autoRotate: false, // 自动旋转
      },
      light: {
        //光照相关的设置
        main: {
          color: "#fff", //光照颜色会与所设置颜色发生混合
          intensity: 1.2, //主光源的强度(光的强度)
          shadow: true, //主光源是否投射阴影。默认关闭。
          //   alpha:0,//主光源绕 x 轴，即上下旋转的角度。配合 beta 控制光源的方向(跟beta结合可确定太阳位置)
          beta: 10, //主光源绕 y 轴，即左右旋转的角度。
        },
        ambient: {
          //全局的环境光设置。
          intensity: 0.3,
          color: "#fff", //影响柱条颜色
        },
        // ambientCubemap: {//会使用纹理作为光源的环境光
        //  texture: 'pisa.hdr',
        // // 解析 hdr 时使用的曝光值
        // exposure: 1.0
        // }
      },
      postEffect: {
        //后处理特效的相关配置，后处理特效可以为画面添加高光，景深，环境光遮蔽（SSAO），调色等效果。可以让整个画面更富有质感。
        show: true,
        bloom: {
          enable: true, //高光特效,适合地球仪
        },
      },
    },
    series,
  };
  myChart?.setOption(option);
};


const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime
  };
  jclcypgk(params)
    .then((res) => {
      console.log("左上--基层临床药品概况 ", res);
      if (res.code === "10000") {
        optionData.value = res.result.map((item: { 类型: string; 数量: any; }) => {
          return {
            name: item.类型,
            value: item.数量,
            itemStyle: {
              color: getColor(item.类型)
            },
          };
        });
        initCharts();
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

<style lang="scss" scoped>
.content {
  position: relative;

  .chart {
    position: absolute;
    top: -10px;
    left: -0;
    width: 426px;
    height: 418px;
  }
}
</style>

<template>
  <div class="content">
    <div ref="eCharts" class="chart"></div>
  </div>
</template>