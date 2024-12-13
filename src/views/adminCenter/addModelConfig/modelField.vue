<template>
    <el-dialog v-model="dialogTableVisible" :before-close="handleClose" title="导入配置" width="80%" draggable>
        <div class="ex-action">
            <div class="ex-action-box-left">
                <el-form label-width="auto" style="max-width: 600px">
                    <el-form-item label="导入数据">
                        <el-select placeholder="please select your zone">
                            <el-option label="Zone one" value="shanghai" />
                            <el-option label="Zone two" value="beijing" />
                        </el-select>
                    </el-form-item>
                </el-form>
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
            </div>
        </div>
        <div class="ex-table-page-body">
            <AgTable class="AgTable" ref="gridRef" :gridColDefs="gridColDefs" :paging="false" :gridKey="route.path+'modelField'"
                :gridData="GridTableData"/>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <div class="left"></div>
                <div class="right">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>


<script setup>
import { Plus, Minus, Check, Grid } from "@element-plus/icons-vue";
import { onMounted } from "vue";
const route = useRoute();

const gridRef = ref(null);
let dialogTableVisible = ref(false);
const GridTableData = ref([])
const emit = defineEmits([
    "update:data",
]);

const visible = ref(false);

const gridColDefs = [
    {
        headerName: "表别名",
        field: "tableAlias",
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "数据库字段",
        field: "dbField",
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "Select字段",
        editable: true,
        field: "selectField",
        cellEditor: "agNumberCellEditor",
    },
    {
        headerName: "Java字段",
        field: "javaField",
        editable: true,
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "默认名称",
        field: "defaultName",
        minWidth: 90,
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "是否主键",
        field: "isPk",
        minWidth: 90,
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
    {
        headerName: "是否物理字段",
        field: "isPhysical",
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
        headerName: "是否单号",
        field: "isNo",
        editable: true,
        cellEditor: "agCheckboxCellEditor",
    },
];

gridColDefs.map((ele) => {
    ele.filter = false;
    ele.suppressMenu = true;
    ele.minWidth ? "" : (ele.minWidth = 100);
});

// 关闭弹窗,初始化内容
const handleClose = () => {
    dialogTableVisible.value = false;
};

// 开启弹窗,初始化内容
const handleOpen = (config) => {
    dialogTableVisible.value = true;
    GridTableData.value = config
};
/** aggrid新增一行 */
const handleAddRow = () => {
    gridRef.value.addRowAndSelect();
};
/** aggrid删除一行 */
const handleDeleteRow = () => {
    gridRef.value.deleteSelectedRows();
    visible.value = false;
};

let rows = {};


// 表格提交
const handleSubmit = () => {
    emit('update:data', getData())
    handleClose()
};

// 获取全部数据
const getData = () => {
    return gridRef.value.gridGetData();
}

onMounted(() => {

})
defineExpose({
    getData,
    handleOpen
})
</script>

<style scoped lang="scss">
.ex-table-page-body {
    height: 60vh;
}

.el-form-item {
    margin-bottom: 0;
}

.ex-action {
    padding-left: 10px;
    padding-right: 10px;
}
</style>
