<script setup lang="ts">
import { onMounted } from "vue";
import { headerTitle } from '@/enums/headerTitle';
import { hospitalName } from '@/enums/hospitalName';

import ItemWrap from "@/components/item-wrap";

import LeftTop from "./left-top.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";

import CenterTop from "./center-top.vue";
import CenterBottom from "./center-bottom.vue";

import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";

onMounted(() => {
  headerTitle.name = "远程医疗主题大数据"
  hospitalName.name = "";
});
</script>

<template>
  <div class="index-box">
    <div class="contetn_left">
      <ItemWrap
        class="contetn_left-top contetn_lr-item contetn_lrH316"
        title="远程会诊数量"
      >
        <LeftTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-center contetn_lr-item contetn_lrH316"
        title="影像中心报告量"
      >
        <LeftCenter />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item contetn_lrH316"
        title="心电中心报告量"
      >
        <LeftBottom />
      </ItemWrap>
    </div>

    <div class="contetn_center">
      <ItemWrap
        class="contetn_left-top contetn_lr-item contetn_lrW100 contetn_lrH643"
        title="中心年度数据"
      >
        <CenterTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item contetn_lrH316"
        title="年度数据统计"
      >
        <CenterBottom />
      </ItemWrap>
    </div>

    <div class="contetn_right">
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item contetn_lrH316"
        title="申请会诊数量"
      >
        <RightTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item contetn_lrH316"
        title="影像协同诊断报告量"
      >
        <RightCenter />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item contetn_lrH316"
        title="心电协同诊断报告量"
      >
        <RightBottom />
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
  padding: 16px 16px 16px 16px;
}
//左边 右边 结构一样
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  width: 450px;
  box-sizing: border-box;
  flex-shrink: 0;
  .contetn_lr-item {
    margin-bottom: 10px;
  }
  .contetn_lr-item:last-child {
    margin-bottom: 0;
  }
}
.contetn_center {
  flex: 1;
  margin: 0 12px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: flex-start;
  align-items: flex-end;
  justify-content: flex-start;
  .contetn_lr-item {
    margin-bottom: 10px;
  }
  .contetn_lr-item:last-child {
    margin-bottom: 0;
  }
}

.contetn_lr-item {
  height: 270px;
}
.contetn_lrH410 {
  height: 410px;
}
.contetn_lrH643 {
  height: calc(950px / 3 * 2 + 10px);
}
.contetn_lrH690 {
  height: 690px;
}
.contetn_lrH316 {
  height: calc(950px / 3);
}
.contetn_lrH970 {
  height: 970px;
}

.contetn_lrW100 {
  width: 100%;
}
.centerCenter {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: baseline;
  .contetn_lr-item {
    width: calc(50% - 5px);
  }
  .contetn_lr-item:first-child {
    margin-right: 10px;
  }
}
</style>
