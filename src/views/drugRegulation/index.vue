<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { headerTitle } from '@/enums/headerTitle';
import { hospitalName } from '@/enums/hospitalName';

import ItemWrap from "@/components/item-wrap";

import LeftTop from "./left-top.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";

import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";

import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";

onMounted(() => {
  headerTitle.name = "药品监管主题大数据"
  hospitalName.name = "桦南县人民医院";
});
onBeforeUnmount(() => {
  hospitalName.name = "";
});
</script>

<template>
  <div class="index-box">
    <div class="contetn_left">
      <ItemWrap
        class="contetn_left-top contetn_lr-item"
        title="基层临床药品概况"
      >
        <LeftTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="基本药物应用分析"
      >
        <LeftBottom />
      </ItemWrap>
    </div>
    <div class="contetn_center">
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item contetn_lrH970"
        title="三素一汤占比情况"
      >
        <CenterMap class="contetn_center_top" />
      </ItemWrap>
    </div>
    <div class="contetn_right">
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="药品消耗情况排名"
      >
        <RightTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="抗菌药品分析 "
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
  height: 480px;
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
  height: 968px;
  border-radius: 10px;
  background-color: rgba(5, 15, 14, 0.5);
  border: 1px solid #05d3d8;
}

.contetn_lrW100 {
  width: 100%;
}
</style>
<style lang="scss">
.contetn_lrH970  .dv-border-box-content {
  background-color: transparent;
}
</style>
