<template>
  <el-dialog
    v-model="props.modelValue"
    class="AgTableDialog"
    :title="$t('settings')"
    width="80%"
    :close-on-click-modal='false'
    @close="handleClose"
  >
    <AgTable
      class="AgTable"
      ref="exTableAutoRef"
      :gridData="gridData"
      :gridColDefs="gridColDefs"
      :pagination="false"
      @handleRowSelect="handleRowSelect"
      :grildUrl="grildUrl"
      @handlCellClick="handlCellClick"
    />
    <template #footer>
      <div class="dialog-footer">
        <div class="left">
         <el-button  circle  :icon="Plus" @click="handleAddRow"></el-button>
  <el-popover
    :visible="visible"
    placement="top"
    :width="152"
  >
    <p>
      {{ message && message != "" ? message : "确定要删除该数据？" }}
    </p>
    <div style="marginTop:10px">
      <el-button @click="visible = false" size="small">取消</el-button>
      <el-button size="small" type="danger" @click="handleDeleteRow"
        >确定</el-button
      >
    </div>
    <template #reference>
         <el-button  circle  :icon="Close" @click="visible = true"></el-button>
    </template>
  </el-popover>
        </div>
        <div class="right">
         <el-button @click="handleClose">取消</el-button>
         <el-button type="primary" @click="centerDialogVisible = false">
           提交
         </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script  setup>
import {
  Plus,
  Close
} from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance();

const emits = defineEmits(["update:modelValue"]);
const exTableAutoRef = ref(null)
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const visible =ref(false)

/* 关闭弹窗回调 */
const handleClose = () => {
  emits("update:modelValue", false);
};

const grildUrl = "/base/company/list";

const gridColDefs = [
  {
    headerName: "字段",
    field: "field",
    editable: true,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "默认名称",
    field: "defaultName",
    editable: true,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "自定义名称",
    field: "customName",
    editable: true,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "小数数位",
    editable: true,
    field: "decimals",
    cellEditor: "agNumberCellEditor",
  },
  {
    headerName: "是否显示",
    field: "show",
    minWidth: 90,
    cellRenderer: "agCheckboxCellEditor",
  },
  {
    headerName: "是否只读",
    field: "read",
    minWidth: 90,
    cellRenderer: "agCheckboxCellEditor",
  },
  {
    headerName: "是否不能为空",
    field: "empty",
    cellRenderer: "agCheckboxCellEditor",
  },
  {
    headerName: "是否敏感数据",
    field: "sensitiveness",
    cellRenderer: "agCheckboxCellEditor",
  },
  {
    headerName: "是否复制字段",
    field: "copy",
    cellRenderer: "agCheckboxCellEditor",
  },
  {
    headerName: "当明细有数据需锁定字段",
    field: "lock",
    minWidth: 180,
    cellRenderer: "agCheckboxCellEditor",
  },
  {
    headerName: "是否参与查询",
    field: "search",
    cellRenderer: "agCheckboxCellEditor",
  },
  {
    headerName: "参与查询顺序",
    field: "sequence",
    editable: true,
    cellEditor: "agNumberCellEditor",
  },
  {
    headerName: "查询占位（最大值5）",
    field: "occupy",
    editable: true,
    minWidth: 180,
    cellEditor: "agNumberCellEditor",
  },
  {
    headerName: "默认值",
    field: "default",
    editable: true,
    minWidth: 180,
    editable: true,
    cellEditor: "agTextCellEditor",
  },
  {
    headerName: "数据类型",
    field: "type",
    minWidth: 180,
    cellRenderer: "CustomSelectEditor",
    cellRendererParams: {
      default:1,
      options: [
           {id:1,value:'本文'},
           {id:2,value:'日期'},
      ],
    },
  },
  {
    headerName: "下拉框配置",
    field: "source",
    minWidth: 180,
    cellRenderer: "CustomSelectEditor",
    cellRendererParams: {
      default:1,
      options: [
           {id:1,value:'字典'},
           {id:2,value:'数据导入'}
      ],
    },
  },
];
gridColDefs.map((ele) => {
  ele.filter = false;
  ele.suppressMenu = true;
  ele.minWidth ? "" : (ele.minWidth = 120);
});
const gridData = [
  {
    field: "name",
    defaultName: "姓名",
    customName: "别名",
    decimals: null,
    show: true,
    read: false,
    empty: false,
    sensitiveness: false,
    copy: false,
    search: false,
    sequence: null,
    occupy: null,
    lock: false,
    default:null,
    type:1,
    source: 1,
  },
];
/** aggrid选中行 */
const handleRowSelect = (data) => {};

/** aggrid新增一行 */
const handleAddRow = ()=>{
  exTableAutoRef.value.addRowAndSelect()
}
/** aggrid删除一行 */
const handleDeleteRow = ()=>{
  exTableAutoRef.value.deleteSelectedRows()
  visible.value = false
}
</script>

<style scoped lang="scss">
.AgTable {
  height: 500px;
}
.dialog-footer{
  display: flex;
  justify-content: space-between;
}
</style>

<style lang="scss">
.AgTableDialog {
  .el-dialog__header {
    border-bottom: none;
  }
}
</style>