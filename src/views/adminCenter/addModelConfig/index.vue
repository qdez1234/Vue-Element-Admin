<template>
    <div class="ex-page-container">
        <div class="ex-action top">
            <div class="ex-action-box-left">{{ title }}</div>
            <div class="ex-action-box-right">
                <el-button class="filter-item" style="margin-left: 8px" type="primary"
                    @click="handleSubmit">保存</el-button>
            </div>
        </div>
        <div class="ex-search">
            <div class="ex-search-box">
                <el-form :inline="true" ref="ruleFormRef" class="ex-form-inline" label-width="80"
                    @submit.native.prevent>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="名称">
                                <el-input v-model="queryParams.name" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="模型类型">
                                <el-select v-model="queryParams.modelType" style="width: 100%;" @change="getBase"
                                    filterable>
                                    <el-option label="主从表" value="0" />
                                    <el-option label="查询分析" value="1" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="备注">
                                <el-input v-model="queryParams.remark" autosize type="textarea" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <div class="ex-action">
            <div class="ex-action-box-left"></div>
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
            <AgTable ref="gridRef" :gridData="queryParams.entities" :gridColDefs="gridColDefs" rowSelection="multiple"
                :paging="false" :grildParams="queryParams" @handleLinkTextClick="handleLinkTextClick"
                :gridKey="route.path + '/list'" />
        </div>
    </div>
    <modelField ref="modelFieldRef" @update:data="handleSetData" />
</template>


<script setup>
import { addDataBaseList, getDataBaseDetail, uploadDataBaseList } from "@/api/system/config";
import modelField from "./modelField.vue";
import { onMounted } from "vue";
const route = useRoute();
const gridRef = ref(null)
const visible = ref(false);
const modelFieldRef=ref(null)
const title = route.meta.title
const { proxy } = getCurrentInstance();
let { id } = route.query
let queryParams = ref({ name: "", modelType: 0, remark: "" })
const gridColDefs = [
    {
        headerName: "类型",
        field: "type",
        minWidth: 180,
        cellRenderer: "CustomSelectEditor",
        cellRendererParams: {
            default: '',
            options: [
                {
                    label: '主表',
                    value: 'main'
                },
                {
                    label: '明细表',
                    value: 'sub'
                },
            ]
        },
    },
    {
        headerName: "表名",
        field: "tableName",
        minWidth: 180,
        editable: true,
    },
    {
        headerName: "实体名",
        field: "entityName",
        editable: true,
    },
    {
        headerName: "属性名",
        field: "propName",
        editable: true,
    },
    {
        headerName: "主键字段名",
        field: "idField",
        editable: true,
    },
    {
        headerName: "外键字段名",
        field: "foreignKeyField",
        editable: true,
    },
    {
        headerName: "字段配置",
        field: "fields",
        minWidth: 180,
        cellRenderer: "CustomLinkText",
        cellRendererParams: (params) => ({
            text: params.data.fields ? truncateString(params.data.fields) : "配置",
            type: params.data.linkType,
        }),
    },
    {
        headerName: "定义查询SQL",
        field: "listSql",
        editable: true,
    },
];
const truncateString = (str) => {
    return str.length > 30 ? str.slice(0, 30) + '...' : str;
}
let rows = {};
/** 数据导入配置 */
const handleLinkTextClick = (field, row, index) => {
    modelFieldRef.value.handleOpen(row.fields)
    rows = { field, row, index };
};
//数据来源设置行数据
const handleSetData = (data) => {
    const gridApi = gridRef.value.getGridAPI();
    const rowNode = gridApi.getDisplayedRowAtIndex(rows.index);
    rows.row[rows.field] = data
    rowNode.setData(rows.row);
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
/*  获取所有数据 */
const getValue = () => {
    queryParams.value.sysBusinessModelDetailList = gridRef.value.gridGetData()
};

/** 提交 */
const handleSubmit = () => {
    getValue()
    if (id) {
        uploadDataBaseList(queryParams.value).then(res => {
            if (res.code == 200) {
                proxy.$modal.msgSuccess(res.msg);
                init()
            }
        })
    } else {
        addDataBaseList(queryParams.value).then(res => {
            if (res.code == 200) {
                proxy.$modal.msgSuccess(res.msg);
                proxy.$tab.closePage()
            }
        })
    }
}
/** 初始化 */
const init = () => {
    if (id) {
        getDataBaseDetail(id).then(res => {
            queryParams.value = res.data
        })
    }
}
onMounted(() => {
    init()
})
</script>
<style lang="scss" scoped>
.ex-action.top {
    border-bottom: 1px dashed var(--el-border-color);
    background-color: white;

    .ex-action-box-left {
        font-size: 14px;
        padding-left: 10px;
    }
}
</style>