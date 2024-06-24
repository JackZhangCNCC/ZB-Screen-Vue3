<script setup lang="ts">
import BorderBox13 from "@/components/datav/border-box-13";
const props = withDefaults(
  defineProps<{
    // 标题
    title: number | string;
  }>(),
  {
    title: "",
  }
);
</script>

<template>
  <BorderBox13>
    <div class="item_title" v-if="title !== ''">
      <span class="title-inner"> &nbsp;&nbsp;{{ title }}&nbsp;&nbsp; </span>
    </div>
    <div
      :class="title !== '' ? 'item_title_content' : 'item_title_content_def'"
    >
      <slot></slot></div
  ></BorderBox13>
</template>

<style scoped lang="scss">
$item-title-height: 38px;
$item_title_content-height: 100%;

.item_title {
  height: $item-title-height;
  line-height: $item-title-height;
  width: 251px;
  text-align: left;
  // background: linear-gradient(to right, transparent, #0f0756, transparent);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: left;
  background: url(/src/assets/img/titles/title-inner.png) no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;

  .title-inner {
    width: 251px;
    height: 38px;
    line-height: 38px;
    color: #ffffff;
    letter-spacing: 1px;
    margin-left: 30px;
  }
}

:deep(.dv-border-box-content) {
  border-radius: 10px;
  background-color: rgba(5, 15, 14, 0.8);
  padding: 12px;
}

.item_title_content {
  height: calc(100% - 38px);
}

.item_title_content_def {
  width: 100%;
  height: 100%;
}
</style>
