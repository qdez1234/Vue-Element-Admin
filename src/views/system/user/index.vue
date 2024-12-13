<template>
  <div class="app-container search-table-box aidex-table">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <el-card shadow="never" class="aidex-tree-box" style="height: 100%;border: 0;">
          <div style="padding:12px 12px 20px;">
            <el-input
                v-model="deptName"
                placeholder="请输入部门名称"
                clearable
                prefix-icon="Search"
            />
          </div>
          <div style="padding:0px 0 0px 12px;">
            <el-tree
                :data="deptOptions"
                :props="{ label: 'label', children: 'children' }"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="deptTreeRef"
                highlight-current
                default-expand-all
                @node-click="handleNodeClick"
                :style="{height:treeHeight}"
                style="width: 100%;overflow-y: auto;"
            />
          </div>
        </el-card>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" style="padding:0 12px 0 0">
        <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
          <div class="filter-container">
            <div class="search_box">
              <el-form :model="queryParams" ref="queryForm" label-width="80px">
                <el-row :gutter="16">
                  <el-col :md="8">
                    <el-form-item label="用户名称" prop="userName">
                      <el-input
                          v-model="queryParams.userName"
                          placeholder="请输入用户名称"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="8">
                    <el-form-item label="手机号码" prop="phonenumber">
                      <el-input
                          v-model="queryParams.phonenumber"
                          placeholder="请输入手机号码"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :md="8" v-if="advanced" >
                    <el-form-item label="状态" prop="status">
                      <el-select
                          v-model="queryParams.status"
                          placeholder="用户状态"
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
                  <el-col :md="8" v-if="advanced" >
                    <el-form-item label="创建时间">
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
                      <el-button class="filter-item" type="primary"  @click="handleQuery">搜索</el-button>
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
        <el-card shadow="never" class="aidex-tool-box">
          <template #header>
            <el-row>
              <el-col :span="8">
                <div class="card-header">
                  <span class="erp-header-text">用户信息</span>
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
                      v-hasPermi="['system:user:add']"
                  >新增</el-button>
                  <el-button
                      class="filter-item"
                      style="margin-left: 8px;"
                      type="danger"
                      icon="Delete"
                      v-if="!multiple"
                      :disabled="multiple"
                      @click="handleDelete"
                      v-hasPermi="['system:user:remove']"
                  >删除</el-button>
                  <el-button
                      class="filter-item"
                      style="margin-left: 8px;"
                      icon="Upload"
                      @click="handleImport"
                      v-hasPermi="['system:user:import']"
                  >导入</el-button>
                  <el-button
                      class="filter-item"
                      style="margin-left: 8px;"
                      icon="Download"
                      @click="handleExport"
                      v-hasPermi="['system:user:export']"
                  >导出</el-button>
                  <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
                </div>
              </el-col>
            </el-row>
          </template>

          <el-table stripe v-loading="loading" :data="userList" @selection-change="handleSelectionChange" ref="tableRef" :height="tableHeight" highlight-current-row style="width: 100%;">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
            <el-table-column label="用户名称" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
            <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
            <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
            <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />
            <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
              <template #default="scope">
                <el-switch
                    v-model="scope.row.status"
                    active-value="1"
                    inactive-value="0"
                    @change="handleStatusChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button
                    v-if="scope.row.userId !== 1"
                    link
                    type="primary"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:user:edit']"
                >修改</el-button>
                <el-divider direction="vertical" v-if="scope.row.userId !== 1"></el-divider>
                <el-button
                    v-if="scope.row.userId !== 1"
                    link
                    type="danger"
                    style="color: red;"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:user:remove']"
                >删除</el-button>
                <el-divider direction="vertical" v-if="scope.row.userId !== 1"></el-divider>
                <el-dropdown v-if="scope.row.userId !== 1" @command="(command) => handleCommand(command, scope.row) "
                             v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
                    <span class="el-dropdown-link">
                      <el-button link type="primary">更多</el-button><el-icon class="el-icon--right"><ArrowDown /></el-icon>
                    </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="handleResetPwd">重置密码
                      </el-dropdown-item>
                      <el-dropdown-item command="handleAuthRole">分配角色
                      </el-dropdown-item>
                      <el-dropdown-item command="handleBrowsePower">权限浏览
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
        </el-card>
      </el-col>
    </el-row>
    <!--修改密码-->
    <el-dialog :title="resetPassWord.title" v-model="resetPassWord.open" width="500px" draggable append-to-body style="overflow: hidden;">
      <div class="dialog_box">
        <el-form ref="resetPassWordRef" :model="resetPassWord" :rules="resetPassWord.rules" label-position="top">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="resetPassWord.resetUserName" :disabled="true"/>
          </el-form-item>
          <el-form-item has-feedback label="新密码" prop="newPassword">
            <el-input type="password" show-password v-model="resetPassWord.newPassword" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item has-feedback label="确认密码" prop="confirmPassword">
            <el-input type="password" show-password v-model="resetPassWord.confirmPassword" placeholder="请确认密码" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitResetPwdForm">确 定</el-button>
          <el-button @click="resetPassWord.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="720px" append-to-body style="overflow: hidden;">
      <div class="dialog_box">
        <el-form ref="userRef" :model="form" :rules="rules" label-position="top">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickName">
                <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归属部门" prop="deptId">
                <el-tree-select
                    style="width: 100%"
                    v-model="form.deptId"
                    :data="deptOptions"
                    :props="{ value: 'id', label: 'label', children: 'children' }"
                    value-key="id"
                    placeholder="请选择归属部门"
                    check-strictly
                    :render-after-expand="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户性别">
                <el-select v-model="form.sex" placeholder="请选择">
                  <el-option
                      v-for="dict in sys_user_sex"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                  ></el-option>
                </el-select>
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
            <el-col :span="12">
              <el-form-item label="岗位">
                <el-select v-model="form.postIds" multiple placeholder="请选择">
                  <el-option
                      v-for="item in postOptions"
                      :key="item.postId"
                      :label="item.postName"
                      :value="item.postId"
                      :disabled="item.status == 0"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色">
                <el-select v-model="form.roleIds" multiple placeholder="请选择">
                  <el-option
                      v-for="item in roleOptions"
                      :key="item.roleId"
                      :label="item.roleName"
                      :value="item.roleId"
                      :disabled="item.status == 0"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入内容"></el-input>
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

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload class="upload-model"
                 ref="uploadRef"
                 :limit="1"

                 accept=".xlsx, .xls"
                 :headers="upload.headers"
                 :action="upload.url + '?updateSupport=' + upload.updateSupport"
                 :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress"
                 :on-success="handleFileSuccess"
                 :auto-upload="false"
                 drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 分配角色-->
    <select-role  ref="selectRoleRef" v-if="selectRoleVisible" :modelvalue="selectRoleVisible" :userId="selectUserId" @set-show="setShow"></select-role>
    <!-- 用户权限浏览-->
    <el-dialog :title="browsePowerTitle" v-model="browsePowerVisible" width="1000px"  draggable append-to-body style="overflow: hidden;">
      <el-form ref="browsePowerRef" :model="menuPowerLists"    label-position="top">
        <div class="browsePower-data">
          <div class="browsePower-menudata">

            <div class="data-header">
              <el-row>
                <el-col :span="12">
                  <span class="erp-header-text">菜单权限</span>
                </el-col>
                <el-col :span="12">
                  <el-checkbox style="float: right; padding: 3px 0" v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
                </el-col>
              </el-row>


            </div>
            <div class="data-body" >
              <el-tree
                  class="tree-border"
                  :data="menuPowerLists"
                  ref="menuRef"
                  node-key="id"
                  empty-text="加载中，请稍候"
                  default-expand-all
                  :props="{ label: 'label', children: 'children' }"

              />
            </div>


          </div>
          <div class="browsePower-deptdata">
              <div class="data-header">
                <el-row>
                  <el-col :span="12">

                    <span class="erp-header-text">授权角色、公司、仓库</span>
                  </el-col>
                </el-row>
              </div>
              <div class="data-body">
                <el-tabs class="data-body-tabs" v-model="userPower" >
                  <el-tab-pane  label="授权角色" name="userRolesPower">
                    <el-table v-loading="loading" :data="userRoles">
                      <el-table-column label="序号" width="55" type="index" align="center"/>
                      <el-table-column label="角色编码" align="center" prop="roleKey" />
                      <el-table-column label="角色名称" align="center" prop="roleName" min-width="120px"/>
                      <el-table-column label="状态" align="center" prop="status">
                        <template #default="scope">
                          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
                        </template>

                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane  label="授权公司" name="userCompanysPower">
                    <el-table v-loading="loading" :data="userCompanys">
                      <el-table-column label="序号" width="55" type="index" align="center"/>
                      <el-table-column label="公司编码" align="center" prop="companyCode" />
                      <el-table-column label="公司名称" align="center" prop="companyName" min-width="120px"/>
                      <el-table-column label="状态" align="center" prop="status">
                        <template #default="scope">
                          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
                        </template>

                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane  label="授权仓库" name="userWarehousesPower">
                    <el-table v-loading="loading" :data="userWarehouses" >
                      <el-table-column label="序号" width="55" type="index" align="center"/>
                      <el-table-column label="公司别" align="center" prop="baseCompany.companySname" />
                      <el-table-column label="仓库编码" align="center" prop="warehouseCode" />
                      <el-table-column label="仓库名称" align="center" prop="warehouseName" min-width="120px"/>
                      <el-table-column label="状态" align="center" prop="status">
                        <template #default="scope">
                          <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
                        </template>

                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
              </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup name="User">
import { getToken } from "@/utils/auth";
import {
  changeUserStatus,
  listUser,
  delUser,
  getUser,
  updateUser,
  addUser,
  deptTreeSelect,
  getAuthRole,
    resetUserPwd,
    authCompanyList,authWarehouseList
} from "@/api/system/user";
import SelectRole from "@/views/system/user/selectRole.vue";
import {allocatedCompanyList, getRole, userDeptTreeSelect} from "@/api/system/role";
import {userMenuTreeselect} from "@/api/system/menu";


const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex");

const advanced = ref(false);
let tableHeight = proxy.getInitTableHeight();
let treeHeight = proxy.getInitTableHeight(90);
const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
const selectRoleRef =ref(null);
const selectRoleVisible = ref(false);
const selectUserId = ref(null);
const browsePowerVisible= ref(false);
const menuPowerLists= ref([]);
const deptPowerLists= ref([]);
const menuRef = ref(null);
const deptRef = ref(null);
const browsePowerTitle = ref("")
const menuExpand = ref(true);
const deptExpand = ref(true);
const userRoles = ref([]);
const userCompanys = ref([]);
const userWarehouses = ref([]);
const userPower = ref("userRolesPower");



/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: "1", label: "全部数据权限" },
  { value: "2", label: "自定数据权限" },
  { value: "3", label: "本部门数据权限" },
  { value: "4", label: "本部门及以下数据权限" },
  { value: "5", label: "仅本人数据权限" }
]);

/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
});
const equalToPassword = (rule, value, callback) => {
  if (resetPassWord.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

//重置密码参数
const resetPassWord =reactive({
  open:false,
  title:"",
  resetUserId:undefined,
  resetUserName:undefined,
  newPassword: undefined,
  confirmPassword:undefined,

  rules:{
    newPassword: [{ required: true, message: "新密码不能为空", trigger: "blur" }, { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }],
    confirmPassword: [{ required: true, message: "确认密码不能为空", trigger: "blur" }, { required: true, validator: equalToPassword, trigger: "blur" }]
  },
})
// 列显隐信息
const columns = ref([
  { key: 0, label: `用户编号`, visible: true },
  { key: 1, label: `用户名称`, visible: true },
  { key: 2, label: `用户昵称`, visible: true },
  { key: 3, label: `部门`, visible: true },
  { key: 4, label: `手机号码`, visible: true },
  { key: 5, label: `状态`, visible: true },
  { key: 6, label: `创建时间`, visible: true }
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phonenumber: undefined,
    status: undefined,
    deptId: undefined
  },
  rules: {
    userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
    nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
    password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 隐藏搜索按钮操作 */
watch(showSearch, (value) => {
  let oldHeight = proxy.$refs.queryForm.$el.offsetHeight
  if (value) {
    oldHeight = oldHeight - 12
  } else {
    oldHeight = oldHeight + 12
  }
  nextTick(() => (
      tableHeight.value = proxy.$refs.tableRef.$el.offsetHeight - (proxy.$refs.queryForm.$el.offsetHeight-oldHeight)
  ))
})
/** 展开按钮操作 */
function toggleAdvanced() {
  const oldHeight = proxy.$refs.queryForm.$el.offsetHeight
  advanced.value = !advanced.value
  nextTick(() => (
      tableHeight.value = proxy.$refs.tableRef.$el.offsetHeight - (proxy.$refs.queryForm.$el.offsetHeight-oldHeight)
  ));
}

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});
/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data;
  });
};
/** 查询用户列表 */
function getList() {
  loading.value = true;
  listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    loading.value = false;
    userList.value = res.rows;
    total.value = res.total;
  });
};
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
};
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryForm");
  queryParams.value.deptId = undefined;
  handleQuery();
};
/** 删除按钮操作 */
function handleDelete(row) {
  const userIds = row.userId || ids.value;
  proxy.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function () {
    return delUser(userIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
};
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/user/export", {
    ...queryParams.value,
  },`user_${new Date().getTime()}.xlsx`);
};
/** 用户状态修改  */
function handleStatusChange(row) {
  let text = row.status === "1" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
    return changeUserStatus(row.userId, row.status);
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.status = row.status === "1" ? "0" : "1";
  });
};
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleResetPwd":
      handleResetPwd(row);
      break;
    case "handleAuthRole":
      handleAuthRole(row);
      break;
    case "handleBrowsePower":
      handleBrowsePower(row);
      break;
    default:
      break;
  }
};

/** 根据用户ID查询菜单树结构 */
function getUserMenuTreeselect(userId) {
  return userMenuTreeselect(userId).then(response => {
    menuPowerLists.value = response.menus;
    return response;
  });
}

/** 根据用户ID查询部门树结构 */
function getUserDeptTreeselect(userId) {
  return userDeptTreeSelect(userId).then(response => {
    deptPowerLists.value = response.depts;
    return response;
  });
}

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value, type) {

  if (type == "menu") {
    let treeList = menuPowerLists.value;
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

/** 跳转用户权限浏览 */
function handleBrowsePower(row) {
   const userMenu = getUserMenuTreeselect(row.userId);

  getAuthRole(row.userId).then(response => {
    userRoles.value =response.user.roles;
  })

   getAuthCompany(row);
   getAuthWarehouse(row);


  browsePowerVisible.value = true;
  browsePowerTitle.value = '浏览权限'
};
/** 跳转角色分配 */
function handleAuthRole(row) {
  selectUserId.value = row.userId;
  selectRoleVisible.value = true;
};
/** 重置密码按钮操作 */
function handleResetPwd(row) {
  proxy.resetForm("resetPassWordRef");
  resetPassWord.open = true;
  resetPassWord.title = '重置密码';
  resetPassWord.resetUserId = row.userId;
  resetPassWord.resetUserName = row.userName;
};
/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入";
  upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
  proxy.download("system/user/importTemplate", {
  }, `user_template_${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};
/** 重置操作表单 */
function reset() {
  form.value = {
    userId: undefined,
    deptId: undefined,
    userName: undefined,
    nickName: undefined,
    password: undefined,
    phonenumber: undefined,
    email: undefined,
    sex: undefined,
    status: "1",
    remark: undefined,
    postIds: [],
    roleIds: []
  };
  proxy.resetForm("userRef");
};
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
};
/** 新增按钮操作 */
function handleAdd() {
  reset();
  getUser().then(response => {
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    open.value = true;
    title.value = "添加用户";
    form.value.password = initPassword.value;
  });
};
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const userId = row.userId || ids.value;
  getUser(userId).then(response => {
    form.value = response.data;
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    form.value.postIds = response.postIds;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = "修改用户";
    form.password = "";
  });
};
/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      if (form.value.userId != undefined) {
        updateUser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};
function setShow(val){
  selectRoleVisible.value = val;
}

/**根据数据Id获取名称*/
function getDataScopeName(row){

  if(row.dataScope !=''){
    return dataScopeOptions.value.filter(item=>item.value==row.dataScope)[0].label;
  }
}

/**重置密码提交*/
function submitResetPwdForm(){
  if ( (resetPassWord.resetUserId !='')&&(resetPassWord.resetUserId !=undefined)&&
  (resetPassWord.newPassword == resetPassWord.confirmPassword)){
    resetUserPwd(resetPassWord.resetUserId, resetPassWord.confirmPassword).then(response => {
      proxy.$modal.msgSuccess("重置成功，新密码是：" + resetPassWord.confirmPassword);
      resetPassWord.open = false;
    });
  }

}

/** 获取用户公司授权*/
function getAuthCompany(row){

  authCompanyList(row.userId).then(response => {
    userCompanys.value = response.data;
  });
}
/** 获取用户仓库授权*/
function getAuthWarehouse(row){

  authWarehouseList(row.userId).then(response => {
    userWarehouses.value = response.data;
  });
}

getDeptTree();
getList();
</script>
<style lang="scss">
.aidex-tree-box{
  height: 100%;
  border: 0;
}
.aidex-tool-box{
  border: 0!important;
}
.upload-model{
  text-align: center;
  padding-top: 10px;
}
.search-table-box .aidex-tree-box .el-card__body{
  padding:12px 0;
}
.browsePower-data{
  height: 500px;
  display: flex;
  flex-direction: row;
  padding: 5px;
  background-color: #f0f2f5;
}
.browsePower-menudata{
  float: left;
  width:40%;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
}
.browsePower-deptdata{
  float: right;
  width: 60%;

  display: flex;
  flex-direction: column;
}
.data-header{
  background-color: #fff;
  margin-bottom: 5px;

  height: 40px;
  padding: 5px;
}
.data-body{
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;

  background-color: #fff;
  .el-tree{
    flex: 1;
    margin: 0;
  }
  .el-table{
    height: 389px;
  }
}

</style>
