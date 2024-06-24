<script setup lang="ts">
import { onMounted, watchEffect, ref, reactive } from "vue";
import { graphic } from "echarts/core";
import { byzz } from "@/api";
import { ElMessage } from "element-plus";
import { dateState } from "@/enums/dateState";
import { hospitalName } from "@/enums/hospitalName";

const tableData = ref([]);
const getData = () => {
  const params = {
    orgname: hospitalName.name,
    stime: dateState.stime,
    etime: dateState.etime,
  };
  byzz(params)
    .then((res) => {
      console.log("中左--本月转诊", res);
      if (res.code === "10000") {
      tableData.value = res.result.map(
        (item: { 类型: string; 转诊人数: any }) => {
          return {
            name: item.类型,
            value: item.转诊人数,
          };
        }
      );
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
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
  <div class="centerLeftTable" v-if="tableData.length > 0">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column width="80" type="index" label="序号" header-align="center" align="center" />
      <el-table-column prop="name" label="类型" header-align="center" align="center" />
      <el-table-column prop="value" label="转诊人数" header-align="center" align="center" />
    </el-table>
  </div>
</template>

<style lang="scss">
.centerLeftTable {
  margin-top: 10px;
  .el-table {
    color: #f7fbff;
    font-size: 12px;
    thead {
      color: #f7fbff;
    }
    .el-table__header-wrapper {
      th.el-table__cell {
        background-color: #074451;
        border-color: #060a0d;
        padding: 3px 0;
      }
    }
    .el-table__body-wrapper {
      tr.el-table__row {
        background-color: #2f3338;
        border-color: #060a0d;
        td.el-table__cell {
          border-color: #060a0d;
          border-top: 3px solid #060a0d;
          padding: 2px 0;
        }
      }
      tr:hover {
        td.el-table__cell {
          color: #060a0d;
        }
      }
    }
    .el-table--border .el-table__inner-wrapper:after,
    .el-table--border:after,
    .el-table--border:before,
    .el-table__inner-wrapper:before {
      background-color: #060a0d;
    }
  }
}
</style>
