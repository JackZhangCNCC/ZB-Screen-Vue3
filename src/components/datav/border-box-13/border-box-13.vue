<script setup lang="ts">
import { computed, ref ,onBeforeUpdate, nextTick} from "vue";
import merge from "lodash/merge";
import { useElementSize  } from "@vueuse/core";
import type { PropType } from "vue";

const props = defineProps({
  color: {
    type: Array as unknown as PropType<[string, string]>,
    default: () => [],
  },
  backgroundColor: {
    type: String,
    default: "transparent",
  },
});
const defaultColor = ["#6586ec", "#2cf7fe"];
const domRef = ref(null);
const { width, height } = useElementSize(domRef,{width:0,height:0}, { box: 'border-box' });
const mergedColor = computed<[string, string]>(() => {
  return merge(defaultColor, props.color);
});


</script>

<template>
  <div class="dv-border-box-13 dv-border-box" ref="domRef">
    <div class="dv-border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dv-border-box {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.dv-border-svg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  display: block;
}
.dv-border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
