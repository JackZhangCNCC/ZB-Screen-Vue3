import { reactive } from 'vue';
import dayjs from 'dayjs';

const startOfWeek = dayjs().startOf('week').format('YYYY-MM-DD 00:00:00');
const endOfWeek = dayjs().endOf('week').format('YYYY-MM-DD 23:59:59');
// 开发时先写死展示，不然默认周展示数据非常少甚至没有
// const startOfWeek = "2023-02-01 00:00:00"
// const endOfWeek = "2024-01-01 00:00:00"

export const dateState = reactive({
  stime: startOfWeek,
  etime: endOfWeek,
});
