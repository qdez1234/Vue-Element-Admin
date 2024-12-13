<template>
  <div class="search">
    <el-form :inline="true" ref="ruleFormRef" label-width="80">

      <el-form-item label="数据API">
        <el-input v-model="dataApi" style="width: 250px" placeholder="请输入表头API" />
      </el-form-item>

      <el-form-item label="查询参数">
        <el-input v-model="searchParams" style="width: 250px" placeholder="请输入表头API" />
      </el-form-item>

      <el-form-item label="表单参数">
        <el-input v-model="formParams" style="width: 250px" placeholder="请输入表头API" />
      </el-form-item>

      <el-form-item label="表头API">
        <el-input v-model="headerApi" style="width: 250px" placeholder="请输入表头API" />
      </el-form-item>

      <el-form-item label="展示类型">
        <el-select v-model="showType" placeholder="请选择展示类型" style="width: 250px">
          <el-option label="下拉框" :value="0" />
          <el-option label="弹窗" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item class="ex-btn">
        <el-button type="primary" @click="handleReport">导入配置</el-button>
      </el-form-item>

    </el-form>
  </div>
  <AgTable class="AgTable" ref="gridRef" :gridKey="route.path + '/' + 'reportAPI'" :paging="false"
    :gridColDefs="gridColDefs" :suppressRowClickSelection="true" :grildUrl="grildUrl" />
</template>

<script setup>
import { getAgConfig } from "@/api/system/config";

import request from "@/utils/request";

import { v4 as uuidv4 } from "uuid";

const route = useRoute();

const props = defineProps({});

let headerApi = ref(null);

let searchParams =ref(null)

let formParams =ref(null)

let dataApi = ref(null);

let showType = ref(0);

const gridRef = ref(null);

let grildUrl = ref(null);

/* ---------------------------------- 字典 ---------------------------------- */
// 字典表头数据
const gridColDefs = [
  {
    headerName: "字段",
    field: "field",
    editable: false,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "默认名称",
    field: "defaultName",
    editable: false,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "自定义名称",
    field: "customName",
    editable: true,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "字典值",
    field: "dictionary",
    editable: true,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "显示顺序",
    field: "sequence",
    editable: true,
    cellEditor: "agNumberCellEditor",
  },
  {
    headerName: "导出字段",
    field: "report",
    editable: true,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "表头显示",
    field: "isShow",
    minWidth: 90,
    editable: true,
    cellEditor: "agCheckboxCellEditor",
  },
  {
    headerName: "参与查询",
    field: "isSearch",
    minWidth: 90,
    editable: true,
    cellEditor: "agCheckboxCellEditor",
  },
  {
    headerName: "回显字段",
    field: "echo",
    minWidth: 90,
    editable: true,
    cellEditor: "agCheckboxCellEditor",
  },
  {
    headerName: "主键",
    field: "sql",
    minWidth: 90,
    editable: true,
    cellEditor: "agCheckboxCellEditor",
  },

];

gridColDefs.map((ele) => {
  ele.filter = false;
  ele.suppressMenu = true;
});

//请求的api数据
let urlData = [];

//数据导入,配置
const handleReport = () => {
  request({
    url: headerApi.value,
    method: "get",
  }).then((res) => {
    let data = res.data.data || [];

    let list = data.map((ele) => {
      let dd = urlData.find((els) => els.field == ele.field);
      let obj = {}
      if (dd) {
        obj.field = dd.field
        obj.defaultName = dd.defaultName
        obj.customName = dd.customName
        obj.isShow = dd.isShow;
        obj.sequence = dd.sequence;
        obj.dictionary = dd.dictionary;
        obj.echo = dd.echo;
        obj.sql = dd.sql;
        obj.report = dd.report;
        obj.isSearch = dd.isSearch || false
      } else {
        obj.field = ele.field
        obj.defaultName = ele.defaultName
        obj.customName = ele.customName
        obj.isShow = false;
        obj.sequence = null;
        obj.dictionary = null;
        obj.echo = false;
        obj.sql = false;
        obj.report = null;
        obj.isSearch = false
      }
      return obj
    });
    gridRef.value.setData(list);
  });
};

/*  获取所有数据 */
const getValue = () => {
  return {
    headerApi: headerApi.value,
    searchParams:searchParams.value,
    formParams:formParams.value,
    showType:showType.value,
    dataApi: dataApi.value,
    data: gridRef.value.gridGetData(),
  };
};
/*  设置选中行数据 */
const setValue = (val) => {
  if (val && val.headerApi) {
    headerApi.value = val.headerApi;
    searchParams.value=val.searchParams,
    formParams.value=val.formParams,
    showType.value = val.showType;
    dataApi.value = val.dataApi;
    urlData = val.data;
    handleReport();
  }
};
defineExpose({
  getValue,
  setValue,
});
</script>

<style scoped lang="scss">
.search {
  display: flex;
}
</style>
