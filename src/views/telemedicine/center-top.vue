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
    left: 50%;
    width: 90%;
    height: auto;
    margin-left: -45%;
  }
}
</style>

<template>
  <div class="content">
    <!-- <div class="leftTop"></div> -->
     <img class="leftTop" src="@/assets/img/telemedicine/centerTop.png" />
  </div>
</template>