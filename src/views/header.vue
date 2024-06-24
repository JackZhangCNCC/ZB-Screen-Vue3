<script setup lang="ts">
import { watch, ref, reactive } from "vue";
import dayjs from "dayjs";
import type { DateDataType } from "./index.d";
import { useSettingStore } from "@/stores/index";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";
import { headerTitle } from "@/enums/headerTitle";

const mode = ref<"周" | "月" | "年" | "自定义">("周");
const startOfWeek = dayjs().startOf("week").toDate();

const dates = ref([startOfWeek]);

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

const dateData = reactive<DateDataType>({
  dateDay: "",
  dateYear: "",
  dateWeek: "",
  timing: null,
});
let isFullScreenViaF11 = false;

const onDateChange = (newDates: Date | [Date, Date]) => {
  let start, end;
  switch (mode.value) {
    case "周":
      start = dayjs(Array.isArray(newDates) ? newDates[0] : newDates)
        .startOf("week")
        .add(1, "day");
      end = dayjs(Array.isArray(newDates) ? newDates[0] : newDates)
        .endOf("week")
        .add(1, "day");
      break;
    case "月":
      start = dayjs(Array.isArray(newDates) ? newDates[0] : newDates).startOf(
        "month"
      );
      end = dayjs(Array.isArray(newDates) ? newDates[0] : newDates).endOf(
        "month"
      );
      break;
    case "年":
      start = dayjs(Array.isArray(newDates) ? newDates[0] : newDates).startOf(
        "year"
      );
      end = dayjs(Array.isArray(newDates) ? newDates[0] : newDates).endOf(
        "year"
      );
      break;
    case "自定义":
      if (Array.isArray(newDates)) {
        start = dayjs(newDates[0]);
        end = dayjs(newDates[1]);
      }
      break;
  }

  // 格式化日期
  dateState.stime = start.format("YYYY-MM-DD 00:00:00");
  dateState.etime = end.format("YYYY-MM-DD 23:59:59");

  console.log("🚀 ~ onDateChange ~ newDate:", dateState.stime, dateState.etime);
};

const { setSettingShow } = useSettingStore();
const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const timeFn = () => {
  dateData.timing = setInterval(() => {
    dateData.dateDay = dayjs().format("YYYY-MM-DD hh : mm : ss");
    dateData.dateWeek = weekday[dayjs().day()];
  }, 1000);
};

document.addEventListener('keydown', function (e) {
  if (e.key === 'F11') {
    isFullScreenViaF11 = !isFullScreenViaF11;
    // 阻止F11默认的全屏行为
    e.preventDefault();
    if (isFullScreenViaF11) {
      goFullScreen();
    } else {
      exitFullScreen();
    }
  }
});

const toggleFullScreen = () => {
  if (!document.fullscreenElement && !isFullScreenViaF11) {
    goFullScreen();
  } else {
    exitFullScreen();
    isFullScreenViaF11 = false; // 重置F11全屏标志
  }
};

const goFullScreen = () => {
  let element = document.documentElement;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    /* Firefox */
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE/Edge */
    element.msRequestFullscreen();
  }
};
const exitFullScreen = () => {
  if (document.fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
  }
};

watch(mode, () => {
  dates.value = "";
});
timeFn();
</script>


<template>
  <div class="d-flex jc-center title_wrap">
    <div class="d-flex jc-center">
      <div class="title">
        <span class="title-text">{{ headerTitle.name || "标题" }}</span>
      </div>
    </div>
    <div class="timers">
      <div
        class="choseDate"
        :style="mode == '自定义' ? 'width: 630px;' : 'width: 500px;'"
      >
        <div class="showTime">
          <span
            >时间区间: {{ dayjs(dateState.stime).format("YYYY-MM-DD") }} - 
            {{ dayjs(dateState.etime).format("YYYY-MM-DD") }}</span
          >
        </div>
        <el-radio-group v-model="mode" aria-label="模式选择">
          <el-radio-button value="周">周</el-radio-button>
          <el-radio-button value="月">月</el-radio-button>
          <el-radio-button value="年">年</el-radio-button>
          <el-radio-button value="自定义">自定义</el-radio-button>
        </el-radio-group>
        <div class="demo-date-picker">
          <div class="block" v-if="mode == '周'">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="dates"
              type="week"
              format="YYYY[年][第]ww[周]"
              placeholder="选择周"
              @change="onDateChange"
            />
          </div>
          <div class="block" v-if="mode == '月'">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="dates"
              type="month"
              format="YYYY[年]MM[月]"
              placeholder="选择月"
              @change="onDateChange"
            />
          </div>
          <div class="block" v-if="mode == '年'">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="dates"
              type="year"
              format="YYYY[年]"
              placeholder="选择年"
              @change="onDateChange"
            />
          </div>
          <div class="block" v-if="mode == '自定义'">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onDateChange"
            />
          </div>
        </div>
      </div>
      <div class="full_screen" @click="toggleFullScreen()">
        <img src="@/assets/img/headers/fullScreen.png" alt="全屏" />
      </div>
      <div class="setting_icon" @click="setSettingShow(true)">
        <img src="@/assets/img/headers/setting.png" alt="设置" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title_wrap {
  height: 60px;
  background-image: url("../assets/img/headers/header.png");
  background-size: cover;
  background-position: center center;
  position: relative;
  margin-bottom: 4px;

  .timers {
    position: absolute;
    right: 0;
    top: 30px;
    font-size: 18px;
    display: flex;
    align-items: center;

    .setting_icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin: 10px 10px 0 14px;
      position: absolute;
      top: -28px;
      right: 0px;
      text-align: right;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .full_screen {
      width: 22px;
      height: 22px;
      cursor: pointer;
      margin: 10px 10px 0 14px;
      position: absolute;
      top: 0px;
      right: -1px;
      text-align: right;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.title {
  position: relative;
  width: 280px;
  text-align: center;
  background-size: cover;
  color: transparent;
  height: 60px;
  line-height: 46px;

  .title-text {
    width: 280px;
    position: relative;
    left: -12px;
    top: 10px;
    font-size: 19px;
    font-weight: 900;
    letter-spacing: 2px;
    background: #f3f9ff;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 33px #6ef2f1;
  }
  .title-text::before,
  .title-text::after {
    content: "";
    display: block;
    width: 5px;
    height: 5px;
    background-color: #6ef2f1;
    position: absolute;
    left: -16px;
    top: 11px;
    margin: 0 5px;
  }
  .title-text::after {
    left: unset;
    right: -16px;
  }
}
.showTime {
  width: 300px;
  height: 30px;
  display: block;
  position: absolute;
  top: -28px;
  right: 40px;
  text-align: right;
  span {
    font-size: 15px;
    color: #cccccc;
  }
}
.choseDate {
  width: 500px;
  height: 32px;
  display: block;
  position: relative;
  bottom: -6px;
  .el-radio-group {
    position: absolute;
    left: -42px;
    top: 0;
    .el-radio-button {
      margin: 0 3px;
    }
  }
  .demo-date-picker {
    position: absolute;
    right: 40px;
    top: 0;
  }
}
</style>
<style lang="scss">
.choseDate {
  .el-radio-button__inner {
    background: #11373e;
    border: 1px solid #064653;
    border-left: 1px solid #064653 !important;
    border-radius: 8px !important;
    color: #cccccc;
    padding: 6px 20px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__wrapper {
    height: 28px;
  }
}
.is-active {
  .el-radio-button__inner {
    background-color: #11373e !important;
    border: 1px solid #05edf8 !important;
    border-left: 1px solid #05edf8 !important;
    border-color: #05edf8 !important;
  }
}
</style>
