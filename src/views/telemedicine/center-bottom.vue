<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { zxndsj, xtndsj } from "@/api";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";

const zxsl = ref([
  {
    name: "会诊数量",
    value: 0,
  },
  {
    name: "心电数量",
    value: 0,
  },
  {
    name: "影像数量",
    value: 0,
  }
]);
const xtsl = ref([
  {
    name: "会诊数量",
    value: 0,
  },
  {
    name: "心电数量",
    value: 0,
  },
  {
    name: "影像数量",
    value: 0,
  }
]);

const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime,
  };
  zxndsj(params)
    .then((res) => {
      console.log("中下左--年度数据统计--中心数量 ", res);
      if (res.code === "10000") {
        zxsl.value = res.result.map((item: { 项目: string; 数量: any }) => {
          return {
            name: item.项目 + "数量" || "其他",
            value: item.数量 || 0
          };
        });
        if (zxsl.value.length<3) {
          zxsl.value.push(
            {
              name: "其他",
              value: 0,
            }
          )
        }
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
  xtndsj(params)
    .then((res) => {
      console.log("中下右--年度数据统计--协同数量 ", res);
      if (res.code === "10000") {
        xtsl.value = res.result.map((item: { 类型: string; 数量: any }) => {
          return {
            name: item.类型 + "数量" || "其他",
            value: item.数量 || 0
          };
        });
        if (xtsl.value.length<3) {
          xtsl.value.push(
            {
              name: "其他",
              value: 0,
            }
          )
        }
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
    <div class="dataBoxs">
      <h5 class="dataBoxTitle">中心数量</h5>
      <div class="dataBox" v-for="(item) in zxsl" :key="item.value">
        <span class="dataBoxTop">{{ item.name || "其他" }}</span>
        <span class="dataBoxBottom">{{ item.value || 0 }}</span>
      </div>
    </div>

    <div class="dataBoxs dataBoxs2">
      <h5 class="dataBoxTitle">协同数量</h5>
      <div class="dataBox" v-for="(item) in xtsl" :key="item.value">
        <span class="dataBoxTop">{{ item.name || "其他" }}</span>
        <span class="dataBoxBottom">{{ item.value || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  padding: 20px 0 0 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  .dataBoxs {
    display: flex;
    width: calc(50% - 5px);
    height: 100%;
    border: 1px solid #3183AF;
    padding: 32px 10px 0px 10px;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .dataBoxTitle {
      width: 300px;
      height: 32px;
      line-height: 30px;
      text-align: center;
      position: absolute;
      top: 0px;
      left: 50%;
      margin-left: -150px;
      font-size: 13px;
      font-weight: bold;
      background-image: url("@/assets/img/telemedicine/centerBottomTitle.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
    .dataBox {
      width: 33.3%;
      height: 118px;
      background-image: url("@/assets/img/telemedicine/centerBottom.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
      .dataBoxTop {
        width: 100%;
        height: 26%;
        color: #22B1E7;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        align-items: center;
      }
      .dataBoxBottom {
        width: 100%;
        height: 74%;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        align-items: center;
      }
    }
  }
  .dataBoxs2 {
    border: 1px solid #00B98D;
    .dataBoxTitle {
      background-image: url("@/assets/img/telemedicine/centerBottomTitle2.png");
    }
    .dataBox {
      background-image: url("@/assets/img/telemedicine/centerBottom2.png");
      .dataBoxTop {
        color: #38EBBA;
      }
    }
  }
}
</style>
