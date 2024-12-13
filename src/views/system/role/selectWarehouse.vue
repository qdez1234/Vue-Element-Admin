<template>
  <div class="aidex">
    <!-- 授权用户 -->
    <el-dialog title="选择仓库" v-model="visible" width="800px" draggable append-to-body>
      <div class="dialog_box">
        <el-form :model="queryParams" ref="queryForm" label-width="80px">
          <el-row :gutter="16">
            <el-col :md="8">
              <el-form-item label="仓库名称" prop="warehouseName">
                <el-input
                    v-model="queryParams.warehouseName"
                    placeholder="请输入仓库名称"
                    clearable
                    @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>

            <el-col :md="8">
              <el-form-item label="公司别"  prop="companyId">
                <el-select v-model="queryParams.companyId"  placeholder="请选择公司" @change="handleQuery" filterable clearable>
                  <el-option
                      v-for="item in companyLists"
                      :key="item.companyId"
                      :label="item.companySname"
                      :value="item.companyId"

                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :md="8">
              <el-form-item style="float: right;">
                <el-button type="primary" class="filter-item" @click="handleQuery">搜索</el-button>
                <el-button class="filter-item" style="margin-left: 8px" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-divider></el-divider>
        <el-row>
          <el-table @row-click="clickRow" ref="refTable" :data="warehouseList" @selection-change="handleSelectionChange" height="320px">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="仓库编码" prop="warehouseCode" :show-overflow-tooltip="true" />
            <el-table-column label="仓库名称" prop="warehouseName" :show-overflow-tooltip="true" />
            <el-table-column label="公司别" prop="baseCompany.companySname" :show-overflow-tooltip="true" />

            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <template v-slot:empty>
              <svg-icon icon-class="search-none" style="font-size: 64px;" />
              <p>暂无数据</p>
            </template>
          </el-table>
          <pagination
              v-show="total > 0"
              :total="total"
              v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize"
              @pagination="getList"
          />
        </el-row>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSelectUser">确 定</el-button>
          <el-button @click="visible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SelectUser">
import { authWarehouseSelectAll, unallocatedWarehouseList } from "@/api/system/role";
import {listCompany} from "@/api/system/company";

const props = defineProps({
  roleId: {
    type: [Number, String]
  }
});


const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const warehouseList = ref([]);
const visible = ref(false);
const total = ref(0);
const warehouseIds = ref([]);
const companyLists = ref([]);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleId: undefined,
  warehouseName: undefined,
  companyId: undefined
});

// 显示弹框
function show() {
  queryParams.roleId = props.roleId;

  getCompanyList();

  getList();
  visible.value = true;
}
/**选择行 */
function clickRow(row) {
  proxy.$refs["refTable"].toggleRowSelection(row);
}
// 多选框选中数据
function handleSelectionChange(selection) {
  warehouseIds.value = selection.map(item => item.warehouseId);
}
// 查询表数据
function getList() {
  unallocatedWarehouseList(queryParams).then(res => {
    warehouseList.value = res.rows;
    total.value = res.total;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryForm");
  handleQuery();
}
const emit = defineEmits(["ok"]);
/** 选择授权用户操作 */
function handleSelectUser() {
  const roleId = queryParams.roleId;
  const uIds = warehouseIds.value.join(",");
  if (uIds == "") {
    proxy.$modal.msgError("请选择要授权的仓库");
    return;
  }
  authWarehouseSelectAll({ roleId: roleId, warehouseIds: uIds }).then(res => {
    proxy.$modal.msgSuccess(res.msg);
    if (res.code === 200) {
      visible.value = false;
      emit("ok");
    }
  });
}

/**查询公司列表*/
function getCompanyList() {
  listCompany().then(response => {
    companyLists.value = response.rows;

  })

}

defineExpose({
  show,
});
</script>

