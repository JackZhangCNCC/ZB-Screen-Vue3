<script setup lang="ts">
import { watchEffect, ref, onMounted } from "vue";
import { yljbsjgk, xtndsj } from "@/api";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";

const data = ref({
  qynyljg: "0",
  yjr: "0",
  jkdazsyzcs: "0",
  czrks: "0",
  dzjkda: "0",
  dzbls: "0",
  sjccl: "0",
  sjccts: "0",
  zrzzl: "0",
  zrzzs: "0",
});

const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime,
  };
  yljbsjgk(params)
    .then((res) => {
      console.log("左上--医疗基本数据概况 ", res);
      if (res.code === "10000") {
        let item = res.result;
        data.value = {
          qynyljg: item.区域内医疗机构,
          yjr: item.已接入,
          jkdazsyzcs: item.健康档案主索引注册数,
          czrks: item.常住人口数,
          dzjkda: item.电子健康档案,
          dzbls: item.电子病例数,
          sjccl: item.数据存储量,
          sjccts: item.数据存储条数,
          zrzzl: item.昨日增长量,
          zrzzs: item.昨日增长数,
        };
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
      <div class="imgBox">
        <img src="@/assets/img/nationalHealth/imgBox1.png" />
      </div>
      <div class="textBox">
        <span class="textBoxLine1">区域内医疗机构</span>
        <span class="textBoxLine2"
          >{{ data.qynyljg }}
          <p class="textBoxLine2P">家</p></span
        >
        <span class="textBoxLine1 textBoxLine3">已接入</span>
        <span class="textBoxLine2 textBoxLine4"
          >{{ data.yjr }}
          <p class="textBoxLine2P textBoxLine4P">万</p></span
        >
      </div>
    </div>
    <div class="dataBoxs">
      <div class="imgBox">
        <img src="@/assets/img/nationalHealth/imgBox2.png" />
      </div>
      <div class="textBox">
        <span class="textBoxLine1">健康档案主索引注册数</span>
        <span class="textBoxLine2"
          >{{ data.jkdazsyzcs }}
          <p class="textBoxLine2P">万</p></span
        >
      </div>
    </div>
    <div class="dataBoxs">
      <div class="imgBox">
        <img src="@/assets/img/nationalHealth/imgBox3.png" />
      </div>
      <div class="textBox">
        <span class="textBoxLine1">常住人口数</span>
        <span class="textBoxLine2"
          >{{ data.czrks }}
          <p class="textBoxLine2P">万</p></span
        >
        <span class="textBoxLine1 textBoxLine3">电子健康档案</span>
        <span class="textBoxLine2 textBoxLine4"
          >{{ data.dzjkda }}
          <p class="textBoxLine2P textBoxLine4P">万</p></span
        >
      </div>
    </div>
    <div class="dataBoxs">
      <div class="imgBox">
        <img src="@/assets/img/nationalHealth/imgBox4.png" />
      </div>
      <div class="textBox">
        <span class="textBoxLine1">电子病例数</span>
        <span class="textBoxLine2"
          >{{ data.dzbls }}
          <p class="textBoxLine2P">万</p></span
        >
      </div>
    </div>
    <div class="dataBoxs">
      <div class="imgBox">
        <img src="@/assets/img/nationalHealth/imgBox5.png" />
      </div>
      <div class="textBox">
        <span class="textBoxLine1">数据存储量</span>
        <span class="textBoxLine2"
          >{{ data.sjccl }}
          <p class="textBoxLine2P">GB</p></span
        >
      </div>
    </div>
    <div class="dataBoxs">
      <div class="imgBox">
        <img src="@/assets/img/nationalHealth/imgBox6.png" />
      </div>
      <div class="textBox">
        <span class="textBoxLine1">数据存储条数</span>
        <span class="textBoxLine2"
          >{{ data.sjccts }}
          <p class="textBoxLine2P">亿条</p></span
        >
      </div>
    </div>
    <div class="bottomDataBoxs">
      <span class="bottomDataL">昨日增长量</span>
      <span class="bottomDataR">{{ data.zrzzl }}MB</span>
    </div>
    <div class="bottomDataBoxs">
      <span class="bottomDataL">昨日增长数</span>
      <span class="bottomDataR">{{ data.zrzzs }}条</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-content: space-around;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 16px;
  .dataBoxs {
    width: 32.3%;
    height: 152px;
    border: 1px solid #308f97;
    padding: 25px 14px 25px 14px;
    display: flex;
    .imgBox {
      width: 100px;
      img {
        color: #ffffff;
      }
    }
    .textBox {
      width: 148px;
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: center;
      align-items: baseline;
      span {
        display: inline-flex;
        width: 100%;
        height: 25px;
        line-height: 25px;
        font-size: 13px;
        letter-spacing: 1px;
      }
      .textBoxLine1 {
        color: #bbbbbb;
      }
      .textBoxLine2 {
        color: #1de7f8;
        font-size: 18px;
        font-weight: bold;
      }
      .textBoxLine3 {
      }
      .textBoxLine4 {
        color: #f8db0c;
      }
      .textBoxLine2P {
        color: #1de7f8;
        font-size: 12px;
        font-weight: normal;
        margin-left: 4px;
      }
      .textBoxLine4P {
        color: #f8db0c;
      }
    }
  }
  .bottomDataBoxs {
    width: 49%;
    height: 65px;
    border: 1px solid #308f97;
    background-color: #053535;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    .bottomDataL {
      width: 100px;
      height: 25px;
      font-size: 16px;
      color: #cccccc;
    }
    .bottomDataR {
      width: 158px;
      height: 40px;
      line-height: 42px;
      text-align: center;
      padding-right: 42px;
      font-size: 18px;
      color: #fbd601;
      font-weight: bold;
      background-image: url("@/assets/img/nationalHealth/bottomDataBoxs.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
  }
}
</style>
