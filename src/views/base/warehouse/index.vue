<template>
  <div class="app-container search-table-box aidex-table">
    <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
      <div class="filter-container">
        <div class="search_box">
          <el-form :model="queryParams" ref="queryForm" label-width="80px">
            <el-row :gutter="16">
              <el-col :md="20">
                <el-row>
                  <el-col :md="6">


                    <el-form-item label="公司别" prop="companyId">
                      <el-select v-model="queryParams.companyId" placeholder="请选择公司" @change="handleQuery"
                                 filterable clearable>
                        <el-option
                            v-for="item in companyLists"
                            :key="item.companyId"
                            :label="item.companySname"
                            :value="item.companyId"

                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item label="状态" prop="status">
                      <el-select v-model="queryParams.status" placeholder="请选择状态" @change="handleQuery" clearable
                                 style="width: 100%;">
                        <el-option
                            v-for="dict in sys_normal_disable"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item label="仓库编码" prop="warehouseCode">
                      <el-input
                          v-model="queryParams.warehouseCode"
                          placeholder="请输入仓库编码"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="6">
                    <el-form-item label="仓库名称" prop="warehouseName">
                      <el-input
                          v-model="queryParams.warehouseName"
                          placeholder="请输入仓库名称"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-col>
              <el-col :md="4" align="right" style="margin-left: auto;">
                <el-form-item class="search_btn_box">
                  <el-button class="filter-item" type="primary" @click="handleQuery">搜索</el-button>
                  <el-button class="filter-item" style="margin-left: 8px;" @click="resetQuery">重置</el-button>

                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" >
      <template #header>
        <el-row>
          <el-col :span="4">
            <div class="card-header">
              <span class="erp-header-text">仓库资料信息</span>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="btn_box" align="right" style="float: right;">
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Plus"
                @click="handleAdd"
                v-hasPermi="['base:warehouse:add']"
              >新增</el-button>
              <el-button
                  class="filter-item"
                  style="margin-left: 8px;"
                  type="primary"
                  icon="Edit"
                  :disabled="single || auditStatus"
                  @click="handleUpdate"
                  v-hasPermi="['base:warehouse:edit']"
              >修改</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Delete"
                :disabled="single"
                @click="handleDelete"
                v-hasPermi="['base:warehouse:remove']"
              >删除</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Download"
                @click="handleExport"
                v-hasPermi="['base:warehouse:export']"
              >导出</el-button>
              <el-button
                  class="filter-item"
                  style="margin-left: 8px;"
                  type="primary"
                  icon="open"
                  :disabled="single"
                  @click="handleActivate"
                  v-hasPermi="['base:warehouse:activate']"
              >启用</el-button>
              <el-button
                  class="filter-item"
                  style="margin-left: 8px;"
                  type="primary"
                  icon="TurnOff"
                  :disabled="single"
                  @click="handleDeactivate"
                  v-hasPermi="['base:warehouse:deactivate']"
              >停用</el-button>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </div>
          </el-col>
        </el-row>
      </template>

      <el-table stripe ref="tableRef" v-loading="loading" :data="warehouseList" @selection-change="handleSelectionChange" highlight-current-row style="width: 100%;" :height="tableHeight">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="仓库编码" align="center" prop="warehouseCode" fixed="left"/>
        <el-table-column label="仓库名称" align="center" prop="warehouseName" fixed="left"/>
        <el-table-column label="仓库管理员" align="center" prop="leader" min-width="100px"/>
        <el-table-column label="仓库类型" align="center" prop="warehouseType">
          <template #default="scope">
            <dict-tag :options="base_warehouse_type" :value="scope.row.warehouseType"/>
          </template>
        </el-table-column>
        <el-table-column label="无效库存" align="center" prop="invalidType">
          <template #default="scope">
            <dict-tag :options="base_yes_no" :value="scope.row.invalidType"/>
          </template>
        </el-table-column>
        <el-table-column label="公司别" align="center" prop="baseCompany.companySname" />
        <el-table-column label="部门状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" min-width="180px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新者" align="center" prop="updateBy" />
        <el-table-column label="更新时间" align="center" prop="updateTime" min-width="180px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="150px" fixed="right">
          <template #default="scope">
            <el-button
                link
                type="primary"
                @click="handleBrowseLocation(scope.row)"
                v-hasPermi="['base:houselocation:list']"
            >查看库位</el-button>
            <el-button
              link
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['base:warehouse:edit']"
            >修改</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              link
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['base:warehouse:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <svg-icon icon-class="search-none" style="font-size: 64px;" />
          <p>暂无数据</p>
        </template>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 添加或修改仓库资料对话框 -->
      <el-dialog :title="title" v-model="open" width="720px" append-to-body draggable>
        <div class="dialog_box" style="height: 500px;">
          <el-form ref="warehouseRef" :model="form" :rules="rules" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="仓库编码" prop="warehouseCode">
                  <el-input v-model="form.warehouseCode" placeholder="请输入仓库编码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="仓库名称" prop="warehouseName">
                  <el-input v-model="form.warehouseName" placeholder="请输入仓库名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="仓库管理员" prop="leader">
                  <el-input v-model="form.leader" placeholder="请输入仓库管理员" />
                </el-form-item>
              </el-col>


              <el-col :span="12">
                <el-form-item label="归属公司" prop="companyId">
                  <el-select v-model="form.companyId"  placeholder="请选择公司" filterable clearable >
                    <el-option
                        v-for="item in companyLists"
                        :key="item.companyId"
                        :label="item.companySname"
                        :value="item.companyId"

                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="仓库类型">
                  <el-radio-group v-model="form.warehouseType">
                    <el-radio-button
                        v-for="dict in base_warehouse_type"
                        :key="dict.value"
                        :label="dict.value"
                    >{{dict.label}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="无效库存">
                  <el-radio-group v-model="form.invalidType">
                    <el-radio-button
                        v-for="dict in base_yes_no"
                        :key="dict.value"
                        :label="dict.value"
                    >{{dict.label}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
<!--              <el-col :span="12">-->
<!--                <el-form-item label="部门状态">-->
<!--                  <el-radio-group v-model="form.status">-->
<!--                    <el-radio-button-->
<!--                      v-for="dict in sys_normal_disable"-->
<!--                      :key="dict.value"-->
<!--                      :label="dict.value"-->
<!--                    >{{dict.label}}</el-radio-button>-->
<!--                  </el-radio-group>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
            </el-row>
          </el-form>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>

      <!--查看库位-->
      <el-drawer
          v-model="drawerBrowseInfo"
          title="库存资料"
          direction="rtl"
          size="20%"
      >

        <el-descriptions direction="vertical" :column="4" border>
          <el-descriptions-item  v-for="(item) in warehouseBrowse" :key="item.id" :label="item.label">{{ item.value }}</el-descriptions-item>

        </el-descriptions>

        <el-table :data="houselocationLists" border>
          <el-table-column property="locationCode" label="库位编码"  />
          <el-table-column property="locationName" label="库位名称"  />

        </el-table>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup name="Warehouse">
import { listWarehouse, getWarehouse, delWarehouse, addWarehouse, updateWarehouse, deactivateWarehouse, activateWarehouse } from "@/api/base/warehouse";
import {listCompany} from "@/api/system/company";
import {listHouselocation} from "@/api/base/houselocation";


const { proxy } = getCurrentInstance();
const { base_warehouse_type, sys_normal_disable, base_yes_no } = proxy.useDict('base_warehouse_type', 'sys_normal_disable', 'base_yes_no');

const advanced = ref(false);
let tableHeight = proxy.getInitTableHeight();
const warehouseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const companyLists = ref([]);
const drawerBrowseInfo = ref(false);
const houselocationLists = ref([]);
const warehouseBrowse = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
        warehouseCode: null,
        warehouseName: null,
        companyId: null,
        status: null,
  },
  rules: {
    companyId: [
      { required: true, message: "公司别不能为空", trigger: "blur" }
    ],
    warehouseCode: [
      { required: true, message: "仓库编码不能为空", trigger: "blur" }
    ],
    warehouseName: [
      { required: true, message: "仓库名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 隐藏搜索按钮操作 */
watch(showSearch, (value) => {
  let oldHeight = proxy.$refs.queryRef.$el.offsetHeight
  if (value) {
    oldHeight = oldHeight - 12
  } else {
     oldHeight = oldHeight + 12
  }
  nextTick(() => (
    tableHeight.value = proxy.$refs.tableRef.$el.offsetHeight - (proxy.$refs.queryRef.$el.offsetHeight-oldHeight)
  ))
})

/** 展开按钮操作 */
function toggleAdvanced() {
  const oldHeight = proxy.$refs.queryRef.$el.offsetHeight
  advanced.value = !advanced.value
  nextTick(() => (
    tableHeight.value = proxy.$refs.tableRef.$el.offsetHeight - (proxy.$refs.queryRef.$el.offsetHeight-oldHeight)
  ));
}

/** 查询仓库资料列表 */
function getList() {
  loading.value = true;
  listWarehouse(queryParams.value).then(response => {
    warehouseList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        leader: null,
        warehouseType: "1",
        invalidType: "0",
        companyId: null,
        status: "1",
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
  };
  proxy.resetForm("warehouseRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryForm");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.warehouseId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加仓库资料";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const warehouseId = row.warehouseId || ids.value
  getWarehouse(warehouseId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改仓库资料";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["warehouseRef"].validate(valid => {
    if (valid) {
      if (form.value.warehouseId != null) {
        updateWarehouse(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addWarehouse(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const warehouseIds = row.warehouseId || ids.value;
  proxy.$modal.confirm('是否确认删除仓库资料编号为"' + warehouseIds + '"的数据项？').then(function() {
    return delWarehouse(warehouseIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('base/warehouse/export', {
    ...queryParams.value
  }, `warehouse_${new Date().getTime()}.xlsx`)
}
/**查询公司列表*/
function getCompanyList() {
  listCompany().then(response => {
    companyLists.value = response.rows;

  })

}


/** 启用操作按钮*/
function handleActivate(row){
  const warehouseIds = row.warehouseId || ids.value;

  if (warehouseList.value.find(item => item.warehouseId == warehouseIds).status == '0') {
    proxy.$modal.msgError('数据已启用');
    return;
  }
  proxy.$modal.confirm('是否确认启用当前数据项？').then(function() {
    return activateWarehouse(warehouseIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("启用成功");
  }).catch(() => {});
}
/** 停用操作按钮*/
function handleDeactivate(row){
  const warehouseIds = row.warehouseId || ids.value;
  if (warehouseList.value.find(item => item.warehouseId == warehouseIds).status == '1') {
    proxy.$modal.msgError('数据已停用');
    return;
  }
  proxy.$modal.confirm('是否确认停用当前数据项？').then(function() {
    return deactivateWarehouse(warehouseIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("停用成功");
  }).catch(() => {});
}

function  handleBrowseLocation(row){
  const houseLoaction = {};
  houseLoaction["warehouseId"]=row.warehouseId;
  listHouselocation(houseLoaction).then(response => {

    warehouseBrowse.value = [];
    warehouseBrowse.value.push({id:0,label:'公司别',value:row.baseCompany.companySname,})
    warehouseBrowse.value.push({id:1,label:'仓库编码',value:row["warehouseCode"],})
    warehouseBrowse.value.push({id:2,label:'仓库名称',value:row["warehouseName"],})


    houselocationLists.value = response.rows;
    drawerBrowseInfo.value = true;
  })
}

getCompanyList();
getList();
</script>
<style scoped lang="scss">
  .erp-header-text {
    font-size: 12px;
    font-weight: bolder;
  }
</style>
