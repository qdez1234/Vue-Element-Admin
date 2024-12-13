<template>
  <AgTable
    class="AgTable"
    ref="gridRef"
    :gridColDefs="gridColDefs"
    :pageSize="100000"
    :paging="false"
    :gridKey="route.path + 'dictionary'"
    :suppressRowClickSelection="true"
    :grildUrl="grildUrl"
  />
</template>

<script  setup>
import { nextTick, onMounted } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({});

const route = useRoute();

const gridRef = ref(null);

let grildUrl = ref(null);

/* ---------------------------------- 字典 ---------------------------------- */
grildUrl.value = "/system/dict/type/list";
// 字典表头数据
const gridColDefs = [
  {
    headerName: "",
    field: "",
    minWidth: 30,
    width: 30,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    filter: false, //隐藏过滤条件
    suppressMenu: true, // 隐藏菜单
  },
  {
    headerName: "字典名称",
    field: "dictName",
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "字典类型",
    field: "dictType",
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "状态",
    field: "status",
    cellRenderer: "CustomDict",
    cellRendererParams: {
      dict_key: "sys_normal_disable",
    },
  },
  {
    headerName: "备注",
    field: "remark",
    cellEditor: "agTextCellEditor",
  },
];
gridColDefs.map((ele) => {
  ele.filter = false;
  ele.suppressMenu = true;
});
/*  获取选中行数据 */
const getValue = () => {
  return gridRef.value.HandleGridApi().getSelectedRows();
};
/*  设置选中行数据 */
const setValue = (val) => {
  setTimeout(()=>{
    gridRef.value.HandleGridApi().deselectAll();
    gridRef.value.HandleGridApi().forEachNode((node) => {
      if (val == node.data.dictType) node.setSelected(true);
    });
  },200)

};
defineExpose({
  getValue,
  setValue,
});
</script>

<style scoped lang="scss">
</style>

