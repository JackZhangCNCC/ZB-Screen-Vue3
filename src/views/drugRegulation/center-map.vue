<script setup lang="ts">
import { onMounted, watchEffect, ref, reactive, nextTick } from "vue";
import { ssytzbqk, GETNOBASE } from "@/api";
import { registerMap, getMap } from "echarts/core";
import { optionHandle, regionCodes } from "./center.map";
import BorderBox13 from "@/components/datav/border-box-13";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";
import { huananMapCoordinate } from "@/enums/huananMapCoordinate";
import mapCoordinateImage from "@/assets/img/drugRegulation/mapCoordinate.png";
import mapCoordinateImageClicked from "@/assets/img/drugRegulation/mapCoordinateClicked.png";

import type { MapdataType } from "./center.map";

const option = ref({});
// const year = ref("");
const code = ref("huanan"); //china 代表中国 其他地市是行政编码
const colors = ref(["#6CF441", "#35CAF1", "#FB6164", "#F3C142"]);
// 定义响应式的zoom变量
const zoom = ref(1);

let typeSet = new Set(["抗菌药物", "激素", "维生素", "静脉用药"]);
type DataType = {
  name: string;
  value: number;
  hospital: string;
};
let uniqueDataList = ref<DataType[]>([]);

withDefaults(
  defineProps<{
    // 结束数值
    title: number | string;
  }>(),
  {
    title: "地图",
  }
);

const dataSetHandle = async (regionCode: string, list: object[]) => {
  const geojson: any = await getGeojson(regionCode);
  let cityCenter: any = {};
  let mapData: MapdataType[] = [];
  //获取当前地图每块行政区中心点
  geojson.features.forEach((element: any) => {
    cityCenter[element.properties.name] =
      element.properties.centroid || element.properties.center;
  });
  //当前中心点如果有此条数据中心点则赋值x，y当然这个x,y也可以后端返回进行大点，前端省去多行代码
  list.forEach((item: any) => {
    if (cityCenter[item.name]) {
      mapData.push({
        name: item.name,
        value: cityCenter[item.name].concat(item.value),
      });
    }
  });
  await nextTick();

  option.value = optionHandle(regionCode, list, huananMapCoordinate(), zoom.value);
};

const getData = async (regionCode: string) => {
  const params = {
    orgname: hospitalName.name,
    // orgname: "",
    stime: dateState.stime,
    etime: dateState.etime,
  };
  ssytzbqk(params)
    .then((res) => {
      console.log("中上--三素一汤占比情况", res);
      if (res.code === "10000") {
        let typeMap = new Map();
        for (let item of res.result) {
          if (typeSet.has(item.类型) && item.医院 === hospitalName.name) {
            typeMap.set(item.类型, {
              name: item.类型,
              value: Number(item.占比),
              hospital: item.医院,
            });
          }
        }
        uniqueDataList.value = Array.from(typeMap.values());
        dataSetHandle(regionCode, uniqueDataList.value);
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};
const getGeojson = (regionCode: string) => {
  return new Promise<boolean>(async (resolve) => {
    let mapjson = getMap(regionCode);
    if (mapjson) {
      mapjson = mapjson.geoJSON;
      resolve(mapjson);
    } else {
      mapjson = await GETNOBASE(`./map-geojson/${regionCode}.json`).then(
        (data) => data
      );
      code.value = regionCode;
      registerMap(regionCode, {
        geoJSON: mapjson as any,
        specialAreas: {},
      });
      resolve(mapjson);
    }
  });
};
// getData(code.value);
onMounted(() => {
  // 在组件挂载后立即获取数据
  // getData(code.value);

  // 监听 dateState.stime 和 dateState.etime 的变化
  watchEffect(() => {
    // 当 dateState.stime 或 dateState.etime 发生变化时，重新获取数据
    if (dateState.stime && dateState.etime) {
      getData(code.value);
    }
    if (hospitalName.name) {
      getData(code.value);
    }
  });
});

const mapClick = (params: any) => {
  console.log("🚀 ~ mapClick ~ params:", params);
  // let xzqData = regionCodes[params.name];
  // if (xzqData) {
  //   getData(xzqData.adcode);
  // } else {
  //   window["$message"].warning("暂无下级地市");
  // }
  if (params.data) {
    // 首先重置所有坐标的图片为默认图片
    huananMapCoordinate().forEach((item) => {
      item.symbol = 'image://' + mapCoordinateImage;
    });

    // 找到点击的坐标并更新其图片为点击状态的图片
    const clickedIndex = huananMapCoordinate().findIndex((item) => item.name === params.data.name);
    if (clickedIndex !== -1) {
      huananMapCoordinate()[clickedIndex].symbol = 'image://' + mapCoordinateImageClicked;
    }

    // 更新hospitalName.name的值
    hospitalName.name = params.data.name;

    // 更新ECharts的配置
    option.value = optionHandle(code.value, uniqueDataList.value, huananMapCoordinate(), zoom.value);
  }
};
// 增加zoom值的方法
const zoomIn = () => {
  zoom.value = Math.min(zoom.value * 1.5, 20); // 设置最大值为20
  updateChart();
};

// 减少zoom值的方法
const zoomOut = () => {
  zoom.value = Math.max(zoom.value / 1.5, 1); // 设置最小值为1
  updateChart();
};

// 更新图表
const updateChart = () => {
  option.value = optionHandle(code.value, uniqueDataList.value, huananMapCoordinate(), zoom.value);
  // 确保调用ECharts实例的setOption方法来应用新的配置
  // this.$refs.centerMapRef.setOption(option.value);
};
</script>

<template>
  <div class="centermap">
    <!-- <div class="maptitle">
      <span class="titletext">{{ title }}</span>
    </div> -->
    <div class="mapwrap">
      <!-- 6/21讨论去掉 -->
      <!-- <div class="choseYear">
        <el-date-picker
          class="el-input-class"
          v-model="year"
          type="year"
          size="small"
          placeholder="选择年"
        />
      </div> -->
      <!-- 缩小按钮 -->
      <el-button class="btns" @click="zoomOut">-</el-button>
      <!-- 放大按钮 -->
      <el-button class="btns addBtn" @click="zoomIn">+</el-button>
      <div class="mapBackground" v-if="uniqueDataList.length > 0">
        <p class="hospitalName">{{ uniqueDataList[0].hospital }}</p>
        <div v-for="(item, index) in uniqueDataList" :key="item.name">
          <div class="mapBoxs">
            <el-progress
              type="circle"
              :percentage="item.value"
              :color="colors[index]"
            >
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}</span>
                <!-- <span class="percentage-label">Progressing</span> -->
              </template>
            </el-progress>
            <span class="percentage-text">{{ item.name + " 占比 (%)" }}</span>
          </div>
        </div>
      </div>
      <BorderBox13>
        <!-- <div class="quanguo" @click="getData('china')" v-if="code !== 'china'">
          中国
        </div> -->
        <v-chart
          class="chart"
          :option="option"
          ref="centerMapRef"
          @click="mapClick"
          v-if="JSON.stringify(option) != '{}'"
        />
      </BorderBox13>
    </div>
  </div>
</template>

<style scoped lang="scss">
$item-title-height: 38px;
$item_title_content-height: calc(100% - 38px);
.centermap {
  height: calc(100%);

  position: relative;

  .maptitle {
    height: $item-title-height;
    line-height: $item-title-height;
    width: 251px;
    text-align: left;
    // background: linear-gradient(to right, transparent, #0f0756, transparent);
    position: relative;
    left: 12px;
    top: 12px;
    display: flex;
    align-items: center;
    justify-content: left;
    background: url("@/assets/img/titles/title-inner.png") no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;

    .titletext {
      width: 251px;
      height: 38px;
      line-height: 38px;
      color: #ffffff;
      letter-spacing: 1px;
      margin-left: 30px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url("@/assets/img/xiezuo.png") no-repeat;
    }

    .you {
      background: url("@/assets/img/xieyou.png") no-repeat;
    }
  }

  .mapwrap {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    padding-top: 0%;

    .quanguo {
      position: absolute;
      right: 20px;
      bottom: 20px;
      width: 80px;
      height: 28px;
      border: 1px solid #00eded;
      border-radius: 10px;
      color: #00f7f6;
      text-align: center;
      line-height: 26px;
      letter-spacing: 6px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5),
        0 0 6px rgba(0, 237, 237, 0.4);
      z-index: 10;
    }
  }
}
</style>
<style lang="scss">
.btns {
  position: absolute;
  right: 12px;
  top: -2%;
  height: 24px;
  width: 24px;
  padding: 0;
  z-index: 2;
}
.addBtn {
  position: absolute;
  right: 48px;
  top: -2%;
  z-index: 2;
}
.choseYear {
  position: absolute;
  right: 2%;
  top: 2%;
  height: 28px;
  width: 100px;
  z-index: 2;
  .el-input {
    width: 100px !important;
    .el-input__wrapper {
      position: relative;
      box-shadow: none;
      color: #05d3d8;
      border: 1px solid #05d3d8;
      background-color: #064653;
      padding: 1px 22px 1px 12px;
      cursor: pointer;
      .el-input__inner {
        color: #05d3d8;
      }
      .el-input__prefix {
        position: absolute;
        right: 0;
        color: #05d3d8;
      }
      .el-input__suffix-inner {
        color: #ffffff;
      }
    }
  }
}
.mapBackground {
  background: url("@/assets/img/drugRegulation/mapBackground.png") no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
  position: absolute;
  width: 820px;
  height: 230px;
  bottom: 4%;
  left: 50%;
  margin-left: -410px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-evenly;
  .hospitalName {
    position: absolute;
    top: 2px;
    font-size: 15px;
    color: #08fdfb;
    font-weight: bold;
    letter-spacing: 1.4px;
  }
  .mapBoxs {
    width: 100px;
    height: 100px;
    text-align: center;
    display: flex;
    align-items: baseline;
    position: relative;
    .el-progress {
      width: 100%;
      height: 100%;
      .el-progress-circle {
        width: 100% !important;
        height: 100% !important;
        .el-progress-circle__track {
          stroke: #282a2e; // #write 此处的id就是定义的svg标签id 做替换即可
          stroke-width: 8px;
        }
        .el-progress-circle__path {
          stroke-width: 6px;
        }
      }
      .percentage-value {
        color: #ffffff;
        font-size: 23px;
        font-weight: normal;
      }
    }
    .percentage-text {
      position: absolute;
      bottom: -32px;
      width: 140px;
      left: 50%;
      margin-left: -70px;
      font-size: 11px;
    }
  }
}
</style>