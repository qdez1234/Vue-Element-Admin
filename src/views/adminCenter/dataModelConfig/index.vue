<template>
    <div class="ex-page-container">
        <div class="ex-search" v-if="showSearch">
            <div class="ex-search-box">
                <el-form :inline="true" ref="ruleFormRef" class="ex-form-inline" 
                    @submit.native.prevent>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="业务模型名称">
                                <el-input v-model="queryParams.name" clearable @keyup.enter="search" />
                            </el-form-item>
                        </el-col>

                        <el-col :span="4">
                            <el-form-item class="ex-btn">
                                <el-button type="primary" @click="search">搜索</el-button>
                                <el-button @click="resetQuery">重置</el-button>
                            </el-form-item></el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <div class="ex-action">
            <div class="ex-action-box-left"></div>
            <div class="ex-action-box-right">
                <el-button class="filter-item" style="margin-left: 8px" type="primary"
                    @click="handleToModel()">新增</el-button>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="search" @update:toolPanel="handleToolPanel"
                    :gridSetting="false"></right-toolbar>
            </div>
        </div>

        <div class="ex-table-page-body">
            <AgTable ref="gridRef" :gridColDefs="gridColDefs"  rowSelection="multiple" :suppressRowClickSelection="true"
                :grildUrl="grildUrl" @handleCellClick="GridHandleCellClick" :grildParams="queryParams"
                :gridKey="route.path+'/list'" />
        </div>
    </div>
</template>


<script setup>
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const gridRef = ref(null)
const grildUrl = '/api/businessModel/list'
import { delDataBase } from "@/api/system/config";
let showSearch = ref(true);
let queryParams = ref({ name: "" })
const gridColDefs = [
    {
        headerName: "业务模型名称",
        field: "name",
        editable: false,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "备注",
        field: "remark",
        editable: false,
        cellEditor: "agTextCellEditor",
    },
    {
        headerName: "操作",
        pinned: "right",
        filter: false, // 隐藏过滤条件
        suppressMenu: true, // 隐藏菜单
        cellRendererParams: {
            buttonConfig: [
                { fun: 2, label: "删除", type: "danger" },
                { fun: 3, label: "修改", type: "primary" }
            ]
        },
        cellRenderer: 'ActionButtons',
        width: 200
    }

];
/** 开启列显示 */
const handleToolPanel = () => {
    gridRef.value?.toggleColumnToolPanel();
}
/* 重置 */
const resetQuery = () => {
    /** 重置按钮操作 */
    queryParams.value = {};
    search();
};
/* 快捷查询 */
const search = () => {
    gridRef.value?.gridLoadData();
};
const GridHandleCellClick = (fun, params) => {
    let {id} = params.data
    if (fun == 2) {
        handleDelete(id)
    }
    if (fun == 3) {
        handleToModel(id)
    }
}
const handleDelete = (id) => {
    proxy.$modal.confirm(`是否确认删除`).then(() => {
        delDataBase(id).then(res=>{
            proxy.$modal.msgSuccess(`操作成功`);
            search()
        })
    })
}
const handleToModel = (id) => {
    router.push({ path: "/adminCenter/addModelConfig",query:{id:id}})
}
</script>