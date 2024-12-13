<template>
    <div class="ex-page-container">
        <div class="ex-action">
            <div class="ex-action-box-left">
                <el-button type="primary" size="small" bg @click="handleSetting">
                    配置API
                </el-button>
                <el-checkbox label="是否多选" size="large" v-model="configParams.isBatchDel" />
            </div>
            <div class="ex-action-box-right">
                <el-button circle :icon="Plus" @click="handleAddRow"></el-button>
                <el-popover :visible="visible" placement="top" :width="152">
                    <p>确定要删除选中数据</p>
                    <div style="margin-top: 10px">
                        <el-button @click="visible = false" size="small">取消</el-button>
                        <el-button size="small" type="danger" @click="handleDeleteRow">确定</el-button>
                    </div>
                    <template #reference>
                        <el-button circle :icon="Minus" @click="visible = true"></el-button>
                    </template>
                </el-popover>
                <el-button circle :icon="Check" @click="handleSubmit"></el-button>
            </div>
        </div>
        <div class="ex-table-page-body">
            <AgTable class="AgTable" ref="gridRef" :gridColDefs="gridColDefs" :paging="false" :gridKey="route.path"
                :gridData="GridTableData.data" @handleCellSelect="handleCellSelect"
                @HandleLinkTextClick="HandleLinkTextClick" />
        </div>

        <agDialog ref="agDialogRef" @handleConfirm="handleSetData" />

        <settingDialog ref="settingDialogRef" @handleConfirm="handleSettingSetData" />
    </div>
</template>


<script setup>

import { ElMessage } from "element-plus";

import { Plus, Minus, Check, Grid } from "@element-plus/icons-vue";

import agDialog from "./dialog";

import settingDialog from "./settingDialog"

import { onMounted } from "vue";

const route = useRoute();

const gridRef = ref(null);

const agDialogRef = ref(null);

const settingDialogRef = ref(null)

const emit = defineEmits([
    "handleSubmit",
]);

const { GridTableData } = defineProps({
    GridTableData: {
        type: Object,
        default: {}
    },
});
const visible = ref(false);

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
        headerName: "表单默认名称",
        field: "formCustomName",
        editable: true,
        editable: true,
        cellEditor: "agNumberCellEditor",
    },
    {
        headerName: "小数数位",
        editable: true,
        field: "decimals",
        cellEditor: "agNumberCellEditor",
    },
    {
        headerName: "表单排序顺序",
        field: "formSequence",
        editable: true,
        cellEditor: "agNumberCellEditor",
    },
    {
        headerName: "参与查询顺序",
        field: "sequence",
        editable: true,
        cellEditor: "agNumberCellEditor",
    },
    {
        headerName: "查询占位(最大值4)",
        field: "occupy",
        editable: true,
        cellEditor: "agNumberCellEditor",
    },
    {
        headerName: "表单占位(最大值4)",
        field: "formOccupy",
        editable: true,
        cellEditor: "agNumberCellEditor",
    },
    {
        headerName: "默认值",
        field: "defaultValue",
        editable: true,
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "后缀",
        field: "suffix",
        editable: true,
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "提示语",
        field: "placeholder",
        editable: true,
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "label宽度",
        field: "labelWidth",
        editable: true,
        editable: true,
        cellEditor: "agNumberCellEditor",
    },
    {
        headerName: "是否主键",
        field: "isPk",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "表头显示",
        field: "isShow",
        minWidth: 90,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "表单显示",
        field: "isForm",
        minWidth: 90,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "参与查询",
        field: "isSearch",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "快捷查询",
        field: "isQuickSearch",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否只读",
        field: "isReadonly",
        minWidth: 90,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否不能为空",
        field: "isEmpty",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否敏感数据",
        field: "isSensitiveness",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否复制字段",
        field: "isCopy",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "当明细有数据需锁定字段",
        field: "isLock",
        minWidth: 180,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否开启导入",
        field: "isImportable",
        minWidth: 180,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "数据来源",
        field: "source",
        minWidth: 180, 
        cellRenderer: "CustomLinkText",
        cellRendererParams: (params) => ({
            text: params.data.source ? truncateString(params.data.source) : "配置",
            type: params.data.linkType,
        }),
    },
];

gridColDefs.map((ele) => {
    ele.filter = false;
    ele.suppressMenu = true;
    ele.minWidth ? "" : (ele.minWidth = 100);
});

const truncateString = (str) => {
    return str.length > 30 ? str.slice(0, 30) + '...' : str;
}


/** aggrid新增一行 */
const handleAddRow = () => {
    gridRef.value.addRowAndSelect();
};
/** aggrid删除一行 */
const handleDeleteRow = () => {
    gridRef.value.deleteSelectedRows();
    visible.value = false;
};
/** aggrid下拉框选中事件 */
const handleCellSelect = (field, row) => { };

let rows = {};

/** 数据导入配置 */
const HandleLinkTextClick = (field, row, index) => {
    let data = null;
    if (row[field] && row[field] != "") data = JSON.parse(row[field]);
    agDialogRef.value.handleOpen(data);
    rows = { field, row, index };
};

//数据来源设置行数据
const handleSetData = (data) => {
    const gridApi = gridRef.value.HandleGridApi();
    const rowNode = gridApi.getDisplayedRowAtIndex(rows.index);
    rows.row[rows.field] = JSON.stringify(data);
    rowNode.setData(rows.row);
};
// 表格提交
const handleSubmit = () => {
    emit('handleSubmit')
};
// 获取全部数据
const getData = () => {
    const data = gridRef.value.gridGetData();
    const params = {
        data,
        isBatchDel: configParams.value.isBatchDel,
        source: JSON.stringify(configParams.value.source)
    };
    return params
}
//开启配置API
const handleSetting = () => {
    settingDialogRef.value.handleOpen(configParams.value.source);
}
// 保存配置API
const handleSettingSetData = (val) => {
    configParams.value.source = val
}
let configParams = ref({
    source: null,    //配置api数据
    isBatchDel: false,
})
const handleInit = () => {
    configParams.value.isBatchDel = GridTableData.isBatchDel;
    configParams.value.source = JSON.parse(GridTableData.source)
};
onMounted(() => {
    handleInit()
})
defineExpose({
    getData
})
</script>

<style scoped lang="scss">
.AgTable {
    height: 100%;
}

.ex-action-box-left {
    padding-left: 10px;
    display: flex;
    align-items: center
}

.dialog-footer {
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