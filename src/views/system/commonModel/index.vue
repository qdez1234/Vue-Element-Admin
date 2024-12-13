<template>
  <div class="app-container search-table-box aidex-table">
    <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
      <div class="filter-container">
        <div class="search_box">
          <el-form :model="queryParams" ref="queryForm" label-width="120px">
            <el-row :gutter="16">
              <el-col :md="6">
                <el-form-item label="单据模型名称" prop="name">
                  <el-input
                    v-model="queryParams.name"
                    placeholder="请输入单据模型名称"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="备注" prop="remark">
                  <el-input
                    v-model="queryParams.remark"
                    placeholder="请输入备注"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" align="right" style="margin-left: auto;">
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
          <el-col :span="8">
            <div class="card-header">
              <span class="erp-header-text">单据模型信息</span>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="btn_box" align="right" style="float: right;">
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Plus"
                @click="handleAdd"
                v-hasPermi="['api:businessModel:add']"
              >新增</el-button>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </div>
          </el-col>
        </el-row>
      </template>

      <el-table
        stripe
        ref="tableRef"
        v-loading="loading"
        :data="businessModelList"
        @selection-change="handleSelectionChange"
        highlight-current-row
        style="width: 100%;"
        :height="tableHeight"
      >
        <el-table-column prop="name" label="单据模型名称" :show-overflow-tooltip="true" width="240"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="240" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center" min-width="200" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['api:businessModel:edit']"
            >修改</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              link
              type="danger"
              style="color: red;"
              @click="handleDelete(scope.row)"
              v-hasPermi="['api:businessModel:remove']"
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

      <!-- 添加或修改单据模型对话框 -->
      <el-dialog draggable :title="title" v-model="open" width="75%" :before-close="handleClose" append-to-body>
        <div class="dialog_box" style="height: 720px;">
          <el-form ref="modelRef" :model="form" :rules="rules" label-position="right" label-width="120px">
            <el-row :gutter="24">
              
              <el-col :span="12">
                <el-form-item label="模型名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入单据模型名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单号规则" prop="ruleType">
                  <el-select v-model="form.ruleType"  placeholder="请选择单号规则" filterable  >
                    <el-option
                        v-for="dict in sys_billno_format"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单据抬头" prop="title">
                  <el-input v-model="form.title" placeholder="请输入单据抬头" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="初始流水号" prop="serialNumber">
                  <el-input v-model="form.serialNumber" placeholder="请输入单据抬头" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="流水号是否重复" prop="isRepeat">
                  <el-checkbox true-label="1" false-label="0" v-model="form.isRepeat"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单据日期字段" prop="dateField">
                  <el-input v-model="form.dateField" placeholder="请输入单据日期字段" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司别字段" prop="companyField">
                  <el-input v-model="form.companyField" placeholder="请输入公司别字段" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单据单别字段" prop="billTypeField">
                  <el-input v-model="form.billTypeField" placeholder="请输入单据单别字段" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单据单号字段" prop="billNoField">
                  <el-input v-model="form.billNoField" placeholder="请输入单据单号字段" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模型实体" prop="entityId">
                  <el-select v-model="form.entityId"  placeholder="请选择模型实体" filterable  >
                    <el-option
                        v-for="entity in entityOptions"
                        :key="entity.id"
                        :label="entity.entityName"
                        :value="entity.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="固定条件" prop="fixedSql">
                  <el-input v-model="form.fixedSql" placeholder="请输入固定条件" />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="center">明细表</el-divider>
            <el-tabs v-model="activeName">
              <el-tab-pane label="权限列表" name="permission">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button type="primary" icon="Plus" @click="handleAddPermission">添加</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="danger" icon="Delete" @click="handleDeletePermission">删除</el-button>
                  </el-col>
                </el-row>
                <el-table :data="permissionList" :row-class-name="rowPermissionIndex"
                      @selection-change="handlePermissionSelectionChange" style="width: 100%" height="380px"
                      ref="permissionTable">
                  <el-table-column type="selection" width="50" align="center"/>
                  <el-table-column label="类型" prop="type" min-width="100">
                    <template #default="scope">
                      <el-select v-model="scope.row.type">
                        <el-option label="新增" value="add" />
                        <el-option label="修改" value="edit" />
                        <el-option label="删除" value="remove" />
                        <el-option label="查询详细信息" value="getInfo" />
                        <el-option label="查询列表" value="list" />
                        <el-option label="导出" value="export" />
                        <el-option label="启用" value="activate" />
                        <el-option label="停用" value="deactivate" />
                        <el-option label="审核" value="audit" />
                        <el-option label="反审核" value="unaudit" />
                        <el-option label="结案" value="finish" />
                        <el-option label="反结案" value="unfinish" />
                        <el-option label="打印" value="print" />
                        <el-option label="多次打印" value="prints" />
                        <el-option label="敏感数据" value="secure" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="权限" prop="menuId" min-width="150">
                    <template #default="scope">
                      <el-tree-select style="width: 100%;"
                        v-model="scope.row.menuId"
                        :data="menuOptions"
                        :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
                        value-key="menuId"
                        placeholder="权限"
                        check-strictly
                        :render-after-expand="false"
                        />
                    </template>
                  </el-table-column>
                </el-table>
                
              </el-tab-pane>
              <el-tab-pane label="数据权限列表" name="dataScope">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button type="primary" icon="Plus" @click="handleAddDataScope">添加</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="danger" icon="Delete" @click="handleDeleteDataScope">删除</el-button>
                  </el-col>
                </el-row>
                <el-table  :data="dataScopeList" :row-class-name="rowDataScopeIndex"
                      @selection-change="handleDataScopeSelectionChange" style="width: 100%" height="380px"
                      ref="dataScopeTable">
                  <el-table-column type="selection" width="50" align="center"/>
                  <el-table-column label="类型" prop="type" min-width="80">
                    <template #default="scope">
                      <el-select v-model="scope.row.type">
                        <el-option label="公司权限" value="company" />
                        <el-option label="仓库权限" value="warehouse" />
                        <el-option label="单别权限" value="billtype" />
                        <el-option label="自定义" value="custom" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="表别名" prop="alias" min-width="80">
                    <template #default="scope">
                      <el-input v-model="scope.row.alias" placeholder="请输入表别名"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="筛选字段" prop="field" min-width="80">
                    <template #default="scope">
                      <el-input v-model="scope.row.field" placeholder="请输入筛选字段"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="筛选SQL" prop="filterSql" min-width="150">
                    <template #default="scope">
                      <el-input type="textarea" v-model="scope.row.filterSql" placeholder="请输入筛选SQL"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="单别列表" name="billtype">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button type="primary" icon="Plus" @click="handleAddBilltype">添加</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="danger" icon="Delete" @click="handleDeleteBilltype">删除</el-button>
                  </el-col>
                </el-row>
                <el-table :data="billtypeList" :row-class-name="rowBilltypeIndex"
                      @selection-change="handleBilltypeSelectionChange" style="width: 100%" height="380px"
                      ref="billtypeTable">
                  <el-table-column type="selection" width="50" align="center"/>
                  <el-table-column label="显示名称" prop="label" min-width="100">
                    <template #default="scope">
                      <el-input v-model="scope.row.label" placeholder="请输入显示名称"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="值" prop="value" min-width="100">
                    <template #default="scope">
                      <el-input v-model="scope.row.value" placeholder="请输入值"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="显示顺序" prop="sort" min-width="50">
                    <template #default="scope">
                      <el-input v-model="scope.row.sort" placeholder="请输入显示顺序"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" prop="status" min-width="150">
                    <template #default="scope">
                      <el-switch v-model="scope.row.status" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-value="1" inactive-value="0" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="自定义事件列表" name="event">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button type="primary" icon="Plus" @click="handleAddEvent">添加</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="danger" icon="Delete" @click="handleDeleteEvent">删除</el-button>
                  </el-col>
                </el-row>
                <el-table :data="eventList" :row-class-name="rowEventIndex"
                      @selection-change="handleEventSelectionChange" style="width: 100%" height="380px"
                      ref="eventTable">
                  <el-table-column type="selection" width="50" align="center"/>
                  <el-table-column label="类型" prop="eventType" min-width="80">
                    <template #default="scope">
                      <el-select v-model="scope.row.eventType">
                        <el-option label="新增" value="save" />
                        <el-option label="修改" value="update" />
                        <el-option label="删除" value="remove" />
                        <el-option label="启用" value="activate" />
                        <el-option label="停用" value="deactivate" />
                        <el-option label="审核" value="audit" />
                        <el-option label="反审核" value="unaudit" />
                        <el-option label="结案" value="finish" />
                        <el-option label="反结案" value="unfinish" />
                        <el-option label="打印" value="print" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理前事件SQL" prop="beforeSql" min-width="150">
                    <template #default="scope">
                      <el-input type="textarea" v-model="scope.row.beforeSql" placeholder="请输入处理前事件SQL"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理事件SQL" prop="onSql" min-width="150">
                    <template #default="scope">
                      <el-input type="textarea" v-model="scope.row.onSql" placeholder="请输入处理事件SQL"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理后事件SQL" prop="afterSql" min-width="150">
                    <template #default="scope">
                      <el-input type="textarea" v-model="scope.row.afterSql" placeholder="请输入处理后事件SQL"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
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
  
<script setup name="commonModel">
  import { addModel, delModel, getModel, listModel, updateModel, listEntity } from "@/api/system/commonModel";
  import { listMenu } from "@/api/system/menu";
  import { ElMessageBox } from 'element-plus'

  const { proxy } = getCurrentInstance();

  const { sys_billno_format } = proxy.useDict('sys_billno_format');
  
  const tableHeight = proxy.getInitTableHeight(47);
  const businessModelList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const title = ref("");
  const total = ref(0);
  const activeName = ref("permission");
  const entityOptions = ref([]);

  const menuOptions = ref([]);
  
  const permissionList = ref([]);
  const dataScopeList = ref([]);
  const billtypeList = ref([]);
  const eventList = ref([]);
  const checkedPermissionList = ref([]);
  const checkedDataScopeList = ref([]);
  const checkedBilltypeList = ref([]);
  const checkedEventList = ref([]);
  
  const data = reactive({
    form: {
      modelType: 'curd',
    },
    queryParams: {
      name: undefined,
      modelType: 'curd',
      remark: undefined
    },
    rules: {
      name: [{ required: true, message: "单据模型名称不能为空", trigger: "blur" }],
    },
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

  /** 查询菜单下拉树结构 */
  function getMenuOptions() {
    menuOptions.value = [];
    listMenu().then(response => {
      const menu = { menuId: 0, menuName: "主类目", children: [] };
      menu.children = proxy.handleTree(response.data, "menuId");
      menuOptions.value.push(menu);
    });
  }
  
  /** 查询单据模型列表 */
  function getList() {
    loading.value = true;
    queryParams.value.modelType = 'curd';
    listModel(queryParams.value).then(response => {
      businessModelList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 查询单据模型下拉树结构 */
  function getEntityOptions() {
    listEntity({}).then(response => {
      entityOptions.value = proxy.handleTree(response.data, "id");
    });
  }
  /** 取消按钮 */
  function cancel() {
    open.value = false;
    reset();
  }
  /** 表单重置 */
  function reset() {
    form.value = {
      modelType: 'curd'
    };
    permissionList.value = [];
    dataScopeList.value = [];
    billtypeList.value = [];
    eventList.value = [];
    proxy.resetForm("modelRef");
  }
 
  /** 搜索按钮操作 */
  function handleQuery() {
    getList();
  }
  /** 重置按钮操作 */
  function resetQuery() {
    proxy.resetForm("queryForm");
    handleQuery();
  }
  /** 新增按钮操作 */
  function handleAdd(row) {
    reset();
    getEntityOptions();
    open.value = true;
    title.value = "添加单据模型";
  }
  /** 修改按钮操作 */
  function handleUpdate(row) {
    loading.value = true;
    reset();
    getEntityOptions();
    
    getModel(row.id).then(response => {
      form.value = response.data;
      permissionList.value = response.data.permissions;
      dataScopeList.value = response.data.dataScopes;
      billtypeList.value = response.data.billtypes;
      eventList.value = response.data.events;
      open.value = true;
      title.value = "修改单据模型";
      loading.value = false;
    });
  }
  /** 提交按钮 */
  function submitForm() {
    form.value.permissions = permissionList.value;
    form.value.dataScopes = dataScopeList.value;
    form.value.billtypes = billtypeList.value;
    form.value.events = eventList.value;
    proxy.$refs["modelRef"].validate(valid => {
      if (valid) {
        if (form.value.id != undefined) {
          updateModel(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addModel(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项?').then(function() {
      return delModel(row.id);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  
  function handleClose()  {
    ElMessageBox.confirm('确定关闭弹窗?')
      .then(() => {
        open.value = false;
      })
      .catch(() => {
        // catch error
      })
  }

/** 单据模型字段序号 */
function rowPermissionIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}
/** 单据模型字段添加按钮操作 */
function handleAddPermission() {
  let obj = {};
  permissionList.value.push(obj);
}
/** 单据模型字段删除按钮操作 */
function handleDeletePermission() {
  if (checkedPermissionList.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的字段数据");
  } else {
    const permissions = permissionList.value;
    const checkedPermissions = checkedPermissionList.value;
    permissionList.value = permissions.filter(function(item) {
      return checkedPermissions.indexOf(item.index) == -1
    });
  }
}
/** 复选框选中数据 */
function handlePermissionSelectionChange(selection) {
  checkedPermissionList.value = selection.map(item => item.index)
}

/** 单据模型字段序号 */
function rowDataScopeIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}
/** 单据模型字段添加按钮操作 */
function handleAddDataScope() {
  let obj = {};
  dataScopeList.value.push(obj);
}
/** 单据模型字段删除按钮操作 */
function handleDeleteDataScope() {
  if (checkedDataScopeList.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的字段数据");
  } else {
    const dataScopes = dataScopeList.value;
    const checkedDataScopes = checkedDataScopeList.value;
    dataScopeList.value = dataScopes.filter(function(item) {
      return checkedDataScopes.indexOf(item.index) == -1
    });
  }
}
/** 复选框选中数据 */
function handleDataScopeSelectionChange(selection) {
  checkedDataScopeList.value = selection.map(item => item.index)
}

/** 单据模型字段序号 */
function rowBilltypeIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}
/** 单据模型字段添加按钮操作 */
function handleAddBilltype() {
  let obj = {};
  billtypeList.value.push(obj);
}
/** 单据模型字段删除按钮操作 */
function handleDeleteBilltype() {
  if (checkedBilltypeList.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的字段数据");
  } else {
    const billtypes = billtypeList.value;
    const checkedBilltypes = checkedBilltypeList.value;
    billtypeList.value = billtypes.filter(function(item) {
      return checkedBilltypes.indexOf(item.index) == -1
    });
  }
}
/** 复选框选中数据 */
function handleBilltypeSelectionChange(selection) {
  checkedBilltypeList.value = selection.map(item => item.index)
}

/** 单据模型字段序号 */
function rowEventIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}
/** 单据模型字段添加按钮操作 */
function handleAddEvent() {
  let obj = {};
  eventList.value.push(obj);
}
/** 单据模型字段删除按钮操作 */
function handleDeleteEvent() {
  if (checkedEventList.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的字段数据");
  } else {
    const events = eventList.value;
    const checkedEvents = checkedEventList.value;
    eventList.value = events.filter(function(item) {
      return checkedEvents.indexOf(item.index) == -1
    });
  }
}
/** 复选框选中数据 */
function handleEventSelectionChange(selection) {
  checkedEventList.value = selection.map(item => item.index)
}
getMenuOptions();
getList();
</script>
<style scoped lang="scss">
  .erp-header-text {
    font-size: 12px;
    font-weight: bolder;
  }
</style>