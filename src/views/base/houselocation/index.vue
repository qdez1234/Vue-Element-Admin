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
                      <el-select v-model="queryParams.searchValue" placeholder="请选择公司" @change="handleQuery"
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
                    <el-form-item label="归属仓库" prop="warehouseId">


                      <el-select v-model="queryParams.warehouseId" placeholder="归属仓库" @change="handleQuery"
                                 filterable clearable>
                        <el-option
                            v-for="item in warehouseLists"
                            :key="item.warehouseId"
                            :label="`${item.warehouseName} - ${item.baseCompany.companySname}`"
                            :value="item.warehouseId"

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
                    <el-form-item label="库位名称" prop="locationName">
                      <el-input
                          v-model="queryParams.locationName"
                          placeholder="请输入库位名称"
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
              <span class="erp-header-text">仓库库位信息</span>
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
                v-hasPermi="['base:houselocation:add']"
              >新增</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Delete"
                :disabled="single"
                @click="handleDelete"
                v-hasPermi="['base:houselocation:remove']"
              >删除</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Download"
                @click="handleExport"
                v-hasPermi="['base:houselocation:export']"
              >导出</el-button>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </div>
          </el-col>
        </el-row>
      </template>

      <el-table stripe ref="tableRef" v-loading="loading" :data="houselocationList" @selection-change="handleSelectionChange" highlight-current-row style="width: 100%;" :height="tableHeight">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="库位编码" align="center" prop="locationCode">

        </el-table-column>
        <el-table-column label="库位名称" align="center" prop="locationName">

        </el-table-column>
        <el-table-column label="归属公司" align="center" prop="baseWarehouse.baseCompany.companySname">

        </el-table-column>
        <el-table-column label="归属仓库" align="center" prop="baseWarehouse.warehouseName">

        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark">

        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center" prop="createBy">

        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" min-width="180px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新者" align="center" prop="updateBy">

        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" min-width="180px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['base:houselocation:edit']"
            >修改</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              link
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPermi="['base:houselocation:remove']"
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

      <!-- 添加或修改仓库库位对话框 -->
      <el-dialog :title="title" v-model="open" width="720px" append-to-body draggable>
        <div class="dialog_box" style="height: 500px;">
          <el-form ref="houselocationRef" :model="form" :rules="rules" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="库位编码" prop="locationCode">
                  <el-input v-model="form.locationCode" placeholder="请输入库位编码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="库位名称" prop="locationName">
                  <el-input v-model="form.locationName" placeholder="请输入库位名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">


                <el-form-item label="归属仓库" prop="warehouseId">
                  <el-select v-model="form.warehouseId"  placeholder="请输入归属仓库" filterable clearable >
                    <el-option
                        v-for="item in warehouseLists"
                        :key="item.warehouseId"
                        :label="`${item.warehouseName} - ${item.baseCompany.companySname}`"
                        :value="item.warehouseId"
                        :disabled="item.status==1"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" placeholder="请输入备注" />
                </el-form-item>
              </el-col>

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


    </el-card>
  </div>
</template>

<script setup name="Houselocation">
import { listHouselocation, getHouselocation, delHouselocation, addHouselocation, updateHouselocation } from "@/api/base/houselocation";
import {listCompany} from "@/api/system/company";
import {listWarehouse} from "@/api/base/warehouse";

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const advanced = ref(false);
let tableHeight = proxy.getInitTableHeight();
const houselocationList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const companyLists = ref([]);
const warehouseLists = ref([]);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
        locationCode: null,
        locationName: null,
        warehouseId: null,
        status: null,
        searchValue:null
  },
  rules: {
        locationId: [
      { required: true, message: "库位代码不能为空", trigger: "blur" }
    ],
        locationCode: [
      { required: true, message: "库位编码不能为空", trigger: "blur" }
    ],
        locationName: [
      { required: true, message: "库位名称不能为空", trigger: "blur" }
    ],
        warehouseId: [
      { required: true, message: "归属仓库不能为空", trigger: "blur" }
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

/** 查询仓库库位列表 */
function getList() {
  loading.value = true;
  listHouselocation(queryParams.value).then(response => {
    houselocationList.value = response.rows;
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
        locationId: null,
        locationCode: null,
        locationName: null,
        warehouseId: null,
        remark: null,
        status: "1",
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
  };
  proxy.resetForm("houselocationRef");
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
  ids.value = selection.map(item => item.locationId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加仓库库位";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const locationId = row.locationId || ids.value
  getHouselocation(locationId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改仓库库位";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["houselocationRef"].validate(valid => {
    if (valid) {
      if (form.value.locationId != null) {
        updateHouselocation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addHouselocation(form.value).then(response => {
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
  const locationIds = row.locationId || ids.value;
  proxy.$modal.confirm('是否确认删除仓库库位编号为"' + locationIds + '"的数据项？').then(function() {
    return delHouselocation(locationIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('base/houselocation/export', {
    ...queryParams.value
  }, `houselocation_${new Date().getTime()}.xlsx`)
}
/**查询公司列表*/
function getCompanyList() {
  listCompany().then(response => {
    companyLists.value = response.rows;

  })

}

/**查询仓库列表*/
function getWarehouseList() {
  listWarehouse().then(response => {
    warehouseLists.value = response.rows;

  })

}

getCompanyList();
getWarehouseList();

getList();
</script>
<style scoped lang="scss">
  .erp-header-text {
    font-size: 12px;
    font-weight: bolder;
  }
</style>
