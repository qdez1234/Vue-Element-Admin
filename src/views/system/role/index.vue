<template>
  <div class="app-container search-table-box aidex-table">
    <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
      <div class="filter-container">
        <div class="search_box">
          <el-form :model="queryParams" ref="queryForm" label-width="80px">
            <el-row :gutter="16">
              <el-col :md="6">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input
                    v-model="queryParams.roleName"
                    placeholder="请输入角色名称"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="角色编码" prop="roleKey">
                  <el-input
                    v-model="queryParams.roleKey"
                    placeholder="请输入角色编码"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6">
                <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="角色状态"
                    clearable
                    @change="handleQuery"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="dict in sys_normal_disable"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                     />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="创建时间" style="width: 100%">
                  <el-date-picker
                    v-model="dateRange"
                    value-format="YYYY-MM-DD"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :md="6" align="right" style="margin-left: auto;">
                <el-form-item class="search_btn_box">
                  <el-button class="filter-item" type="primary" @click="handleQuery">搜索</el-button>
                  <el-button class="filter-item" style="margin-left: 8px;" @click="resetQuery">重置</el-button>
                  <a @click="toggleAdvanced" style="margin:0 4px 0 8px ;vertical-align: middle;">
                    {{ advanced ? '收起' : '展开' }}
                    <el-icon v-if="!advanced"><ArrowDown /></el-icon>
                    <el-icon v-if="advanced"><ArrowUp /></el-icon>
                  </a>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-card>

    <div class="content-data" >
      <div class="content-data-left">
          <div class="left-header">
            <el-row>
              <el-col :span="8">
                <div class="card-header">
                  <span class="erp-header-text">角色信息</span>
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
                      v-hasPermi="['system:role:add']"
                  >新增</el-button>
                  <el-button
                      class="filter-item"
                      style="margin-left: 8px;"
                      type="danger"
                      icon="Delete"
                      v-if="!multiple"
                      :disabled="multiple"
                      @click="handleDelete"
                      v-hasPermi="['system:role:remove']"
                  >删除</el-button>
                  <el-button
                      class="filter-item"
                      style="margin-left: 8px;"
                      icon="Download"
                      @click="handleExport"
                      v-hasPermi="['system:role:export']"
                  >导出</el-button>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 表格数据 -->

          <el-table class="left-table" stripe ref="tableRef" v-loading="loading" :data="roleList" @selection-change="handleSelectionChange"
                    @current-change="handleCurrentChange" highlight-current-row height="100%" >
  <!--          <el-table-column type="selection" width="55" align="center" />-->
            <el-table-column label="序号" align="center" type="index" width="60"/>
            <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="角色编码" prop="roleKey" :show-overflow-tooltip="true" width="80" />
            <!--        <el-table-column label="显示顺序" prop="roleSort" width="100" />-->
            <el-table-column label="状态" align="center" width="80">
              <template #default="scope">
                <el-switch
                    v-model="scope.row.status"
                    active-value="0"
                    inactive-value="1"
                    @change="handleStatusChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
  <!--          <el-table-column label="创建时间" align="center" prop="createTime">-->
  <!--            <template #default="scope">-->
  <!--              <span>{{ parseTime(scope.row.createTime) }}</span>-->
  <!--            </template>-->
  <!--          </el-table-column>-->
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120">
              <template #default="scope">
                <el-button v-if="scope.row.roleId !== 1"
                          link
                          type="primary"
                          @click="handleUpdate(scope.row)"
                          v-hasPermi="['system:role:edit']"
                >修改</el-button>
                <el-divider direction="vertical" v-if="scope.row.roleId !== 1"></el-divider>
                <el-button
                    v-if="scope.row.roleId !== 1"
                    link
                    type="danger"
                    style="color: red;"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:role:remove']"
                >删除</el-button>
                <el-divider direction="vertical" v-if="scope.row.roleId !== 1"></el-divider>

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

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body draggable>
          <div class="dialog_box">
          <el-form ref="roleRef" :model="form" :rules="rules" label-width="100px" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item prop="roleKey">
                  <template #label>
                  <span>
                     <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
                        <el-icon><question-filled /></el-icon>
                     </el-tooltip>
                     角色编码
                  </span>
                  </template>
                  <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="form.roleName" placeholder="请输入角色名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色顺序" prop="roleSort">
                  <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.status">
                    <el-radio-button
                        v-for="dict in sys_normal_disable"
                        :key="dict.value"
                        :label="dict.value"
                    >{{ dict.label }}</el-radio-button>
                  </el-radio-group>


                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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

      </div>
      <div class="content-data-right">
        <div class="right-header">
          <el-row>
            <el-col :span="24">
              <div class="card-header">
                <span class="erp-header-text">权限信息</span>
              </div>
            </el-col>

          </el-row>
        </div>
        <div class="right-body">
          <el-tabs class="content-data-righttabs" v-model="menuPower" v-if=!isSuper>
            <el-tab-pane  label="菜单权限" name="menuPower">
              <div class="tabpane-header">
                <el-card style="padding: 0">
                  <el-row>
                    <el-col :span="16">
                      <div class="card-header">
                        <!--                  <span class="erp-header-text">菜单权限</span>-->
                        <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠
                        </el-checkbox>
                        <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选
                        </el-checkbox>
                        <!--                    <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">-->
                        <!--                      父子联动-->
                        <!--                    </el-checkbox>-->
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="btn_box" align="right" style="float: right;">
                        <el-button
                            class="filter-item"
                            style="margin-left: 8px;"
                            type="primary"
                            icon="check"
                            @click="handleSaveMenuPower"
                            v-hasPermi="['system:role:add']"
                        >保存
                        </el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </div>

              <div class="tabpane-body">
                <el-tree
                    class="tree-border"
                    :data="menuOptions"
                    show-checkbox
                    ref="menuRef"
                    node-key="id"
                    :check-strictly="!form.menuCheckStrictly"
                    empty-text="加载中，请稍候"
                    :props="{ label: 'label', children: 'children' }"
                    default-expand-all
                    highlight-current
                />

              </div>

            </el-tab-pane>
            <el-tab-pane  label="公司权限" name="companyPower">

              <div class="tabpane-header">
                <el-card>
                  <el-row>
                    <el-col :span="16">
                      <div class="card-header">
                        <span class="erp-header-text">已授权的公司</span>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="btn_box" align="right" style="float: right;">
                        <el-button
                          class="filter-item"
                          style="margin-left: 8px;"
                          type="primary"
                          icon="plus"
                          @click="handleAddRoleCompanys"
                          >公司授权
                        </el-button>

                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
              <div class="tabpane-tablebody">
                <el-table stripe ref="tableRef" v-loading="loading" :data="roleCompanyList" highlight-current-row
                          style="width: 100%;" >
                  <el-table-column label="序号" align="center" type="index" width="60"/>
                  <el-table-column label="公司编码" prop="companyCode" :show-overflow-tooltip="true" width="100"/>

                  <el-table-column label="公司名称" prop="companyName" :show-overflow-tooltip="true" min-width="300"/>

                  <el-table-column label="公司类型" align="center" prop="status">
                    <template #default="scope">
                      <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
                    </template>

                  </el-table-column>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120">
                    <template #default="scope">
                      <el-button
                          link
                          type="primary"
                          style="color: red;"
                          @click="cancelAuthCompany(scope.row)"
                          v-hasPermi="['system:role:edit']"
                      >删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination
                    v-show="companytotal > 0"
                    :total="companytotal"
                    v-model:page="companyqueryParams.pageNum"
                    v-model:limit="companyqueryParams.pageSize"
                    @pagination="getRoleCompanyList"
                    style="flex: 0"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane  label="仓库权限" name="warehousePower">
              <div class="tabpane-header">
                <el-card>
                  <el-row>
                    <el-col :span="16">
                      <div class="card-header">
                        <span class="erp-header-text">已授权仓库</span>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="btn_box" align="right" style="float: right;">
                        <el-button
                            class="filter-item"
                            style="margin-left: 8px;"
                            type="primary"
                            icon="plus"
                            @click="handleAddRoleWarehouses"

                        >仓库授权
                        </el-button>

                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
              <div class="tabpane-tablebody">
                <el-table stripe ref="tableRef" v-loading="loading" :data="roleWarehouseList" highlight-current-row
                          style="width: 100%;" >
                  <el-table-column label="序号" align="center" type="index" width="60"/>
                  <el-table-column label="公司" prop="baseCompany.companySname" :show-overflow-tooltip="true" width="100"/>
                  <el-table-column label="仓库编码" prop="warehouseCode" :show-overflow-tooltip="true" min-width="100"/>
                  <el-table-column label="仓库名称" prop="warehouseName" :show-overflow-tooltip="true" min-width="300"/>

                  <el-table-column label="仓库类型" align="center" prop="status">
                    <template #default="scope">
                      <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
                    </template>

                  </el-table-column>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120">
                    <template #default="scope">
                      <el-button
                          link
                          type="primary"
                          style="color: red;"
                          @click="cancelAuthWarehouse(scope.row)"
                          v-hasPermi="['system:role:edit']"
                      >删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination
                    v-show="warehousetotal > 0"
                    :total="warehousetotal"
                    v-model:page="warehousequeryParams.pageNum"
                    v-model:limit="warehousequeryParams.pageSize"
                    @pagination="getRoleWarehouseList"
                    style="flex: 0"
                />
              </div>

            </el-tab-pane>
            <el-tab-pane  label="角色用户" name="roleUsers">

              <div class="tabpane-header-user">
                <el-card>
                  <el-row>
                    <el-col :span="16">
                      <div class="card-header">
                        <span class="erp-header-text">已分配的用户</span>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="btn_box" align="right" style="float: right;">
                        <el-button
                          class="filter-item"
                          style="margin-left: 8px;"
                          type="primary"
                          icon="plus"
                          @click="handleAddRoleUsers"
                          >分配用户
                        </el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
              <div class="tabpane-tablebody-user">
                <el-table stripe ref="tableRef" v-loading="loading" :data="roleUserForm" highlight-current-row
                          style="width: 100%;" >

                  <el-table-column label="序号" align="center" type="index" width="60"/>
<!--                  <el-table-column label="用户编码" prop="userId" :show-overflow-tooltip="true" width="100"/>-->
                  <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" width="80"/>
                  <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"
                                   :show-overflow-tooltip="true"/>
                  <el-table-column label="状态" align="center" prop="status">
                    <template #default="scope">
                      <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
                    </template>

                  </el-table-column>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="80">
                    <template #default="scope">
                      <el-button
                          link
                          type="primary"
                          style="color: red;"
                          @click="cancelAuthUser(scope.row)"
                          v-hasPermi="['system:role:edit']"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                    v-show="usertotal > 0"
                    :total="usertotal"
                    v-model:page="userqueryParams.pageNum"
                    v-model:limit="userqueryParams.pageSize"
                    @pagination="getRoleUserList"
                    style="flex: 0"
                />
              </div>



            </el-tab-pane>
          </el-tabs>
          <el-result
              style="padding: 50px;"
              v-if=isSuper
              icon="success"
              title="超级管理员权限"
              sub-title="超级管理员不受权限控制,其余角色根据需求设置菜单以及数据权限,添加角色用户"
          >
          </el-result>
        </div>
      </div>



      <select-user ref="selectuserRef" @ok="getRoleUserList" :roleId="currentRow.roleId"></select-user>
      <select-company ref="selectcompanyRef" @ok="getRoleCompanyList" :roleId="currentRow.roleId"></select-company>
      <select-warehouse ref="selectwarehouseRef" @ok="getRoleWarehouseList" :roleId="currentRow.roleId"></select-warehouse>
    </div>
  </div>
</template>

<script setup name="Role">
import {
  addRole,
  changeRoleStatus,
  dataScope,
  delRole,
  getRole,
  listRole,
  updateRole,
  deptTreeSelect,
  allocatedUserList,
  allocatedCompanyList,allocatedWarehouseList,
  authUserCancel, authUserCancelAll,
    authCompanyCancel,authWarehouseCancel
} from "@/api/system/role";
import { roleMenuTreeselect, treeselect as menuTreeselect } from "@/api/system/menu";
import SelectUser from "@/views/system/role/selectUser.vue";
import SelectCompany from "@/views/system/role/selectCompany.vue";
import SelectWarehouse from "@/views/system/role/selectWarehouse.vue";

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");
const sidebar = computed(() => store.state.app.sidebar);

const advanced = ref(false);
let tableHeight = proxy.getInitTableHeight();
const roleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const menuOptions = ref([]);
const menuExpand = ref(true);
const menuNodeAll = ref(false);
const deptExpand = ref(true);
const deptNodeAll = ref(false);
const deptOptions = ref([]);
const openDataScope = ref(false);
const menuRef = ref(null);
const deptRef = ref(null);
const isSuper = ref(true);

const currentRow = ref({});
const usertotal = ref(0);
const selectuserRef =ref(null);
const selectcompanyRef =ref(null);
const selectwarehouseRef =ref(null);


const companytotal = ref(0);


const menuPower = ref('menuPower');

const warehousetotal = ref(0);




/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: "1", label: "全部数据权限" },
  { value: "2", label: "自定数据权限" },
  { value: "3", label: "本部门数据权限" },
  { value: "4", label: "本部门及以下数据权限" },
  // { value: "5", label: "仅本人数据权限" },
  // { value: "6", label: "本公司数据权限" },
  // { value: "7", label: "本公司及以下数据权限" }
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roleName: undefined,
    roleKey: undefined,
    status: undefined
  },
  rules: {
    roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }]
  },
});

const { queryParams, form, rules } = toRefs(data);


const roleUserData = reactive({
  roleUserForm: [],
  userqueryParams: {
    pageNum: 1,
    pageSize: 10,
    roleId: undefined,

  }
});

const { userqueryParams, roleUserForm } = toRefs(roleUserData);


const roleCompanyData = reactive({
  roleCompanyList: [],
  companyqueryParams: {
    pageNum: 1,
    pageSize: 10,
    roleId: undefined,

  }
});

const { companyqueryParams, roleCompanyList } = toRefs(roleCompanyData);

const roleWarehouseData = reactive({
  roleWarehouseList: [],
  warehousequeryParams: {
    pageNum: 1,
    pageSize: 10,
    roleId: undefined,

  }
});

const { warehousequeryParams, roleWarehouseList } = toRefs(roleWarehouseData);

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
/** 查询角色列表 */
function getList() {

  loading.value = true;
  listRole(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    roleList.value = response.rows;
    total.value = response.total;
    loading.value = false;


    if (roleList.value.length !=0)
    {

      proxy.$refs.tableRef.setCurrentRow(roleList.value[0]);

    }

  });
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryForm");
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.roleId || ids.value;
  proxy.$modal.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?').then(function () {
    return delRole(roleIds);
  }).then(() => {
     getList();
    proxy.$modal.msgSuccess("删除成功");

  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/role/export", {
    ...queryParams.value,
  }, `role_${new Date().getTime()}.xlsx`);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.roleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;

}

/** 角色状态修改 */
function handleStatusChange(row) {
  let text = row.status === "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?').then(function () {
    return changeRoleStatus(row.roleId, row.status);
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.status = row.status === "0" ? "1" : "0";
  });
}
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleDataScope":
      handleDataScope(row);
      break;
    case "handleAuthUser":
      handleAuthUser(row);
      break;
    default:
      break;
  }
}
/** 分配用户 */
function handleAuthUser(row) {
  router.push("/system/role-auth/user/" + row.roleId);
}
/** 查询菜单树结构 */
function getMenuTreeselect() {
  menuTreeselect().then(response => {
    menuOptions.value = response.data;
  });
}
/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/** 重置新增的表单以及其他数据  */

/** 添加角色 */
function handleAdd() {
  reset();
  getMenuTreeselect();
  open.value = true;
  title.value = "添加角色";
}
/**保存角色菜单权限*/
function handleSaveMenuPower(){
  form.value.menuIds = getMenuAllCheckedKeys();
  updateRole(form.value).then(response => {
    proxy.$modal.msgSuccess("菜单权限保存成功");
    // open.value = false;
     getList();
  });
}
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  menuExpand.value = false;
  menuNodeAll.value = false;
  deptExpand.value = true;
  deptNodeAll.value = false;
  form.value = {
    roleId: undefined,
    roleName: undefined,
    roleKey: undefined,
    roleSort: 0,
    dataScope:undefined,
    status: "1",
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: undefined
  };
  proxy.resetForm("roleRef");
}
/** 修改角色 */
function handleUpdate(row) {
  reset();
  const roleId = row.roleId || ids.value;
   const roleMenu = getRoleMenuTreeselect(roleId);
  getRole(roleId).then(response => {
    form.value = response.data;
    form.value.roleSort = Number(form.value.roleSort);
    open.value = true;

    nextTick(() => {
      roleMenu.then((res) => {
        let checkedKeys = res.checkedKeys;

        checkedKeys.forEach((v) => {
          nextTick(() => {
            menuRef.value.setChecked(v, true, false);
          });
        });
      });
    });
    title.value = "修改角色";
  });

}
function  handleCurrentChange(row){


  if(row == null)
  {
    isSuper.value = true;
  }
  else
  {
    currentRow.value = row;
    isSuper.value = row.admin;


    const roleMenu = getRoleMenuTreeselect(row.roleId);

    const deptTreeSelect = getDeptTree(row.roleId);
    getRole(row.roleId).then(response => {
    form.value = response.data;

    nextTick(() => {
      roleMenu.then((res) => {
        let checkedKeys = res.checkedKeys;

        checkedKeys.forEach((v) => {
          nextTick(() => {
            menuRef.value.setChecked(v, true, false);

          });
        });
      });
        deptTreeSelect.then(res => {
          nextTick(() => {
            if (deptRef.value) {
              deptRef.value.setCheckedKeys(res.checkedKeys);
            }
          });
        });
      });
    });

    getRoleCompanyList();
    getRoleWarehouseList();
    getRoleUserList();

  }



}
/** 根据角色ID查询菜单树结构 */
function getRoleMenuTreeselect(roleId) {
  return roleMenuTreeselect(roleId).then(response => {
    menuOptions.value = response.menus;
    return response;
  });
}
/** 根据角色ID查询部门树结构 */
function getDeptTree(roleId) {
  return deptTreeSelect(roleId).then(response => {
    deptOptions.value = response.depts;

    return response;
  });
}
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value, type) {

  if (type == "menu") {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {

  if (type == "menu") {
    menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
  } else if (type == "dept") {
    deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
  }
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {

  if (type == "menu") {
    form.value.menuCheckStrictly = value ? true : false;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value ? true : false;
  }
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["roleRef"].validate(valid => {
    if (valid) {
      if (form.value.roleId != undefined) {
         form.value.menuIds = getMenuAllCheckedKeys();

        updateRole(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        // form.value.menuIds = getMenuAllCheckedKeys();
        addRole(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  //reset();
}
/** 选择角色权限范围触发 */
function dataScopeSelectChange(value) {
  if (value !== "2") {
    deptRef.value.setCheckedKeys([]);
  }
}
/** 分配数据权限操作 */
function handleDataScope(row) {
  reset();
  const deptTreeSelect = getDeptTree(row.roleId);
  getRole(row.roleId).then(response => {
    form.value = response.data;
    openDataScope.value = true;
    nextTick(() => {
      deptTreeSelect.then(res => {
        nextTick(() => {
          if (deptRef.value) {
            deptRef.value.setCheckedKeys(res.checkedKeys);
          }
        });
      });
    });
    title.value = "分配数据权限";
  });
}
/** 提交按钮（数据权限） */
function submitDataScope() {
  form.value.deptIds = getDeptAllCheckedKeys();

  dataScope(form.value).then(response => {
    proxy.$modal.msgSuccess("数据权限保存成功");

    getList();
  });

}
/** 取消按钮（数据权限）*/
function cancelDataScope() {
  // openDataScope.value = false;
  reset();
}

/**根据角色代码获取所有有效用户*/
function getRoleUserList(){
  userqueryParams.value['roleId'] = currentRow.value.roleId;

  loading.value = true;
  allocatedUserList(userqueryParams.value).then(response => {
    roleUserForm.value = response.rows;

    usertotal.value = response.total;
    loading.value = false;
  });

}

/**根据角色代码获取所有有效公司*/
function getRoleCompanyList(){
  companyqueryParams.value['roleId'] = currentRow.value.roleId;

  loading.value = true;
  allocatedCompanyList(currentRow.value.roleId).then(response => {
    roleCompanyList.value = response.rows;

    companytotal.value = response.total;
    loading.value = false;
  });

}

/**根据角色代码获取所有有效仓库*/
function getRoleWarehouseList(){
  warehousequeryParams.value['roleId'] = currentRow.value.roleId;

  loading.value = true;
  allocatedWarehouseList(currentRow.value.roleId).then(response => {
    roleWarehouseList.value = response.rows;

    warehousetotal.value = response.total;
    loading.value = false;
  });

}

/**添加角色用户*/
function handleAddRoleUsers(){
  selectuserRef.value.show();

}

/** 取消授权按钮操作 */
function cancelAuthUser(row) {

  proxy.$modal.confirm('确认要取消该用户"' + row.userName + '"角色吗？').then(function () {
    return authUserCancel({ userId: row.userId, roleId: currentRow.value.roleId });
  }).then(() => {
    getRoleUserList();
    proxy.$modal.msgSuccess("取消授权成功");
  }).catch(() => {});
}
/** 批量取消授权按钮操作 */
function cancelAuthUserAll(row) {
  const roleId = queryParams.roleId;
  const uIds = userIds.value.join(",");
  proxy.$modal.confirm("是否取消选中用户授权数据项?").then(function () {
    return authUserCancelAll({ roleId: roleId, userIds: uIds });
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("取消授权成功");
  }).catch(() => {});
}

/** 取消授权按钮操作 */
function cancelAuthCompany(row) {

  proxy.$modal.confirm('确认要取消该公司"' + row.companySname + '"授权角色吗？').then(function () {
    return authCompanyCancel({ companyId: row.companyId, roleId: currentRow.value.roleId });
  }).then(() => {
    getRoleCompanyList();
    getRoleWarehouseList();
    proxy.$modal.msgSuccess("取消授权成功");
  }).catch(() => {});
}

/** 取消授权按钮操作 */
function cancelAuthWarehouse(row) {

  proxy.$modal.confirm('确认要取消该仓库"' + row.warehouseName + '"授权角色吗？').then(function () {
    return authWarehouseCancel({ warehouseId: row.warehouseId, roleId: currentRow.value.roleId });
  }).then(() => {
    getRoleWarehouseList();
    proxy.$modal.msgSuccess("取消授权成功");
  }).catch(() => {});
}

/**添加角色公司*/
function handleAddRoleCompanys(){
  selectcompanyRef.value.show();

}
/**添加角色仓库*/
function handleAddRoleWarehouses(){
  selectwarehouseRef.value.show();

}

getList();

</script>
<style lang="scss">
.app-container{
  height: calc(100vh - 84px);
  max-width: 100%;
  display: flex;
  flex-direction: column;
}
.content-data{
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.content-data-left{
  display: flex;
  flex-direction: column;
  margin-right: 2px;

}


.left-header{
  background-color: #fff;
  height: 50px;
  width: 465px;
  margin-bottom: 2px;
  padding: 8px 16px;
}
.left-table{
  flex: 1;
}

.content-data-right{

  flex:1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
/*.el-card__body{*/
/*  flex:1;*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*}*/
}
.right-header{

  height: 52px;

  margin-bottom: 2px;
  padding: 8px 16px;
  border-bottom: 2px solid #eee;
}
.right-body{
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0px 10px
}
.content-data-righttabs{
  flex:1;
  display: flex;
  flex-direction: column;
  .el-tabs__content{
    flex:1;
    display: flex;
    flex-direction: column;
    .el-tab-pane{
      flex:1;
      display:flex;
      flex-direction:column;

    }
  }
}
.tabpane-body{
  flex: 1;

}
.tree-border{
  height: calc(100vh - 335px);
  overflow: auto;
}
.tabpane-tablebody{
  flex:1;

  .el-table{
    height: calc(100vh - 375px);
  }
}

.tabpane-header{
  .el-card__body{
    padding-bottom: 5px;
    padding-top: 5px;
  };
}

.tabpane-header-user {
  .el-card__body {
    padding: 6px 12px 6px 12px;
  }
}
.tabpane-header-warehouse {
  .el-card__body {
    padding: 6px 12px 6px 12px;
  }
}
.tabpane-header-company {
  .el-card__body {
    padding: 6px 12px 6px 12px;
  }
}
</style>
