<template>
  <div class="search">
    <el-form :inline="true" ref="ruleFormRef">

      <el-form-item label="列表API">
        <el-input v-model="source.listAPI" style="width: 380px" placeholder="请输入表头API" />
      </el-form-item>

      <el-form-item label="表单API">
        <el-input v-model="source.formAPI" style="width: 380px" placeholder="请输入表头API" />
      </el-form-item>
      <el-form-item label="详情跳转菜单">
        <menu-tree v-model="source.menuId" v-model:menuUrl="source.menuUrl" style="width: 380px" />
      </el-form-item>

    </el-form>
  </div>
  <AgTable class="AgTable" ref="gridRef" :gridKey="route.path+ '/' + 'sourceAPI'" :paging="false" :gridColDefs="gridColDefs"
    :suppressRowClickSelection="true"  />
</template>

<script setup>

import request from "@/utils/request";

import { getMenuListByName } from "@/api/system/menu";
import { onMounted } from "vue";
const { proxy } = getCurrentInstance();

import {BtnConfig} from "@/utils/config.js"

const route = useRoute();

const props = defineProps({});

// 数据源配置
const source = ref({
  listAPI:"",
  formAPI:"",
  menuId:null,
  menuUrl:"",
  listData:[]
})


const gridRef = ref(null);


let menuName = ref(null)
/* ---------------------------------- 字典 ---------------------------------- */
// 字典表头数据
const gridColDefs = [
  {
    headerName: "按钮名称",
    field: "menuName",
    editable: false,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "code",
    field: "perms",
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
    headerName: "显示顺序",
    field: "sequence",
    editable: true,
    cellEditor: "agNumberCellEditor",
  },
  {
    headerName: "API地址",
    field: "url",
    editable: true,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "交互字段(,隔开)",
    field: "field",
    editable: true,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "列表显示",
    field: "isShow",
    editable: true,
    cellEditor: "agCheckboxCellEditor",
  },
  {
    headerName: "表单显示",
    field: "isShowForm",
    editable: true,
    cellEditor: "agCheckboxCellEditor",
  },
  {
    headerName: "调用方法",
    field: "fun",
    minWidth: 180,
    cellRenderer: "CustomSelectEditor",
    cellRendererParams: {
      options:BtnConfig,
    }
  },
];

gridColDefs.map((ele) => {
  ele.filter = false;
  ele.suppressMenu = true;
});


/*  获取所有数据 */
const getValue = () => {
  source.value.listData =  gridRef.value.gridGetData()
  return source.value
};
/*  设置选中行数据 */
const setValue = (val) => {
  if(val) source.value = val
};
// 默认数据
//数据导入,配置
const handleReport = () => {
  getMenuListByName(menuName.value).then((res) => {
    let data = (res.data || []).filter(ele => ele.menuType == 'F');
    
    let list = data.map((ele) => {
      let dd = source.value.listData.find((els) => els.perms == ele.perms);
      let obj = {}
      if (dd) {
        obj.menuName = dd.menuName;
        obj.customName = dd.customName
        obj.perms = dd.perms
        obj.sequence = dd.sequence
        obj.isShow = dd.isShow || false;
        obj.isShowForm = dd.isShowForm || false;
        obj.url = dd.url;
        obj.field = dd.field || ""
        obj.fun = dd.fun
      } else {
        obj.menuName = ele.menuName
        obj.perms = ele.perms
        obj.customName = null
        obj.sequence = null
        obj.isShow = false
        obj.isShowForm= false
        obj.url = null;
        obj.field = "";
        obj.fun = null;
      }
      return obj
    });
    gridRef.value.setData(list);
  });
};

onMounted(() => {
  menuName.value = route.query?.name
  handleReport()
})
defineExpose({
  getValue,
  setValue,
});
</script>

<style scoped lang="scss">
.search {
  display: flex;
  padding: 15px;
}

.el-form-item--default {
  margin-bottom: 0;
}
</style>
