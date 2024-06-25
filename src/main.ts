import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "echarts-gl";

import "@/assets/css/main.scss";
import "@/assets/css/tailwind.css";

import { registerEcharts } from "@/plugins/echarts";
//不使用mock 请注释掉
import { mockXHR } from "@/mock/index";
import UtilVar from "./config/UtilVar";
mockXHR();

const app = createApp(App);
registerEcharts(app);
app.use(createPinia());
app.use(router);

// 检查 hostname 是否是 IP 地址
const isIP = (hostname: string) => {
  const ipPattern = /^(\d{1,3}\.){3,3}\d{1,3}$/;
  return ipPattern.test(hostname);
};

// 根据 hostname 设置 baseUrl
const setBaseUrl = () => {
  const hostname = window.location.hostname;
  if (isIP(hostname)) {
    // 如果 hostname 是 IP 地址，设置为内网环境的 URL
    UtilVar.baseUrl = "http://100.100.8.204/esb/listener";
  } else {
    // 如果 hostname 是域名，设置为外网环境的 URL
    UtilVar.baseUrl = "https://jcpt.hnxygt.cn/esb/listener";
  }
};

// 在运行时设置 baseUrl
setBaseUrl();

app.mount("#app");
