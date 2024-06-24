<script setup lang="ts">
import { onMounted, ref } from "vue";

onMounted(() => {
});
</script>

<style lang="scss" scoped>
.content {
  position: relative;

  .leftTop {
    position: absolute;
    top: 12px;
    left: 0;
    width: 426px;
    height: 318px;
  }
}
</style>

<template>
  <div class="content">
    <!-- <div class="leftTop"></div> -->
     <img class="leftTop" src="@/assets/img/tieredMedical/leftTop.png" />
  </div>
</template>