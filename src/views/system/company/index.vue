<template>
  <div class="app-container search-table-box aidex-table">
    <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
      <div class="filter-container">
        <div class="search_box">
          <el-form :model="queryParams" ref="queryForm" label-width="80px">
            <el-row :gutter="16">
              <el-col :md="6" >
                <el-form-item label="父级id" prop="parentId">
                  <el-input
                    v-model="queryParams.parentId"
                    placeholder="请输入父级id"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" >
                <el-form-item label="祖级列表" prop="ancestors">
                  <el-input
                    v-model="queryParams.ancestors"
                    placeholder="请输入祖级列表"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" >
                <el-form-item label="显示顺序" prop="orderNum">
                  <el-input
                    v-model="queryParams.orderNum"
                    placeholder="请输入显示顺序"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="公司别" prop="companyCode">
                  <el-input
                    v-model="queryParams.companyCode"
                    placeholder="请输入公司别"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="公司简称" prop="companySname">
                  <el-input
                    v-model="queryParams.companySname"
                    placeholder="请输入公司简称"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="公司名称" prop="companyName">
                  <el-input
                    v-model="queryParams.companyName"
                    placeholder="请输入公司名称"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="公司英文名" prop="companyEname">
                  <el-input
                    v-model="queryParams.companyEname"
                    placeholder="请输入公司英文名"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="公司地址" prop="address">
                  <el-input
                    v-model="queryParams.address"
                    placeholder="请输入公司地址"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="法人" prop="corporate">
                  <el-input
                    v-model="queryParams.corporate"
                    placeholder="请输入法人"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="电话" prop="tel">
                  <el-input
                    v-model="queryParams.tel"
                    placeholder="请输入电话"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="传真" prop="fax">
                  <el-input
                    v-model="queryParams.fax"
                    placeholder="请输入传真"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="电邮" prop="eMail">
                  <el-input
                    v-model="queryParams.eMail"
                    placeholder="请输入电邮"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="本位币" prop="moneyId">
                  <el-input
                    v-model="queryParams.moneyId"
                    placeholder="请输入本位币"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="6" v-if="advanced">
                <el-form-item label="Logo" prop="logo">
                  <el-input
                    v-model="queryParams.logo"
                    placeholder="请输入Logo"
                    clearable
                    @keyup.enter="handleQuery"
                  />
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

    <el-card shadow="never" >
      <template #header>
        <el-row>
          <el-col :span="8">
            <div class="card-header">
              <el-link>公司资料信息</el-link>
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
                v-hasPermi="['system:company:add']"
              >新增</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                icon="Sort"
                @click="toggleExpandAll"
              >展开/折叠</el-button>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </div>
          </el-col>
        </el-row>
      </template>

      <el-table
        v-if="refreshTable"
        ref="tableRef"
        v-loading="loading"
        :data="companyList"
        row-key="companyId"
        :default-expand-all="isExpandAll"
        highlight-current-row
        style="width: 100%;"
        :height="tableHeight"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
      <el-table-column label="公司别" align="center" prop="companyCode" />
        <el-table-column label="公司简称" align="center" prop="companySname" :show-overflow-tooltip="true" min-width="150px"/>
        <el-table-column label="公司名称" align="center" prop="companyName" :show-overflow-tooltip="true" min-width="250px"/>
        <el-table-column label="公司英文名" align="center" prop="companyEname" :show-overflow-tooltip="true" min-width="150px"/>
        <el-table-column label="公司地址" align="center" prop="address" :show-overflow-tooltip="true"  min-width="250px"/>
        <el-table-column label="法人" align="center" prop="corporate" />
        <el-table-column label="电话" align="center" prop="tel" />
        <el-table-column label="传真" align="center" prop="fax" />
        <el-table-column label="电邮" align="center" prop="eMail" />
        <el-table-column label="Logo" align="center" prop="logo">
          <template #default="scope">
            <image-preview :src="scope.row.logo" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="本位币" align="center" prop="baseMoney.moneyName" />
        <el-table-column label="关联组织" align="center" prop="sysDept.deptName" :show-overflow-tooltip="true"  min-width="250px"/>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" min-width="160px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新者" align="center" prop="updateBy" />
        <el-table-column label="更新时间" align="center" prop="updateTime" min-width="160px">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:company:edit']"
          >修改</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            link
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:company:add']"
          >新增</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            link
            style="color: red;"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:company:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
        <template v-slot:empty>
          <svg-icon icon-class="search-none" style="font-size: 64px;" />
          <p>暂无数据</p>
        </template>
      </el-table>

      <!-- 添加或修改公司资料对话框 -->
      <!-- <el-dialog :title="title" v-model="open" width="720px" append-to-body draggable :close-on-click-modal="false">
        <div class="dialog_box" style="height: 500px;">
          <el-form ref="companyRef" :model="form" :rules="rules" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="父级id" prop="parentId">
                  <el-tree-select
                    v-model="form.parentId"
                    :data="companyOptions"
                    :props="{ value: 'companyId', label: 'companyName', children: 'children' }"
                    value-key="companyId"
                    placeholder="请选择父级id"
                    check-strictly
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="显示顺序" prop="orderNum">
                  <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司别" prop="companyCode">
                  <el-input v-model="form.companyCode" placeholder="请输入公司别" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司简称" prop="companySname">
                  <el-input v-model="form.companySname" placeholder="请输入公司简称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司名称" prop="companyName">
                  <el-input v-model="form.companyName" placeholder="请输入公司名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司英文名" prop="companyEname">
                  <el-input v-model="form.companyEname" placeholder="请输入公司英文名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司地址" prop="address">
                  <el-input v-model="form.address" placeholder="请输入公司地址" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法人" prop="corporate">
                  <el-input v-model="form.corporate" placeholder="请输入法人" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电话" prop="tel">
                  <el-input v-model="form.tel" placeholder="请输入电话" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="传真" prop="fax">
                  <el-input v-model="form.fax" placeholder="请输入传真" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电邮" prop="eMail">
                  <el-input v-model="form.eMail" placeholder="请输入电邮" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="本位币" prop="moneyId">
                  <el-input v-model="form.moneyId" placeholder="请输入本位币" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Logo" prop="logo">
                  <el-input v-model="form.logo" placeholder="请输入Logo" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="删除标志" prop="delFlag">
                  <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
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
      </el-dialog> -->
      <el-dialog :title="title" v-model="open" width="720px"  append-to-body draggable>
        <div class="dialog_box" style="height: 600px;">
          <el-form ref="companyRef" :model="form" :rules="rules"  label-position="right" label-width="90px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="父级id" prop="parentId">
                  <el-tree-select
                    v-model="form.parentId"
                    :data="companyOptions"
                    :props="{ value: 'companyId', label: 'companyName', children: 'children' }"
                    value-key="companyId"
                    placeholder="请选择父级id"
                    check-strictly
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司别" prop="companyCode" >
                  <el-input v-model="form.companyCode" placeholder="请输入公司别" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司简称" prop="companySname" >
                  <el-input v-model="form.companySname" placeholder="请输入公司简称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="公司名称" prop="companyName" >
                  <el-input v-model="form.companyName" type="textarea" :rows="1" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="公司英文名" prop="companyEname">
                  <el-input v-model="form.companyEname" type="textarea" :rows="1" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="公司地址" prop="address">
                  <el-input v-model="form.address" type="textarea" :rows="1" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="法人" prop="corporate">
                  <el-input v-model="form.corporate" placeholder="请输入法人" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电话" prop="tel">
                  <el-input v-model="form.tel" placeholder="请输入电话" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="传真" prop="fax">
                  <el-input v-model="form.fax" placeholder="请输入传真" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="电邮" prop="eMail">
                  <el-input v-model="form.eMail" placeholder="请输入电邮" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="本位币"  prop="moneyId">
                  <el-select v-model="form.moneyId"  placeholder="请选择本位币" filterable>
                    <el-option
                        v-for="item in moneyOptions"
                        :key="item.moneyId"
                        :label="item.moneyName"
                        :value="item.moneyId"

                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.status">
                    <el-radio-button
                        v-for="dict in sys_normal_disable"
                        :key="dict.value"
                        :label="dict.value"
                    >{{dict.label}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" type="textarea" :rows="1" placeholder="请输入内容" />
                </el-form-item>
              </el-col>


            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="Logo">
                  <image-upload v-model="form.logo" :limit="1"/>
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


<script setup name="Company">
import { listCompany, getCompany, delCompany, addCompany, updateCompany, activateCompany, deactivateCompany } from "@/api/system/company";
import {listMoney} from "@/api/base/money";

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const advanced = ref(false);
let tableHeight = proxy.getInitTableHeight(47);
const companyList = ref([]);
const companyOptions = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const isExpandAll = ref(true);
const refreshTable = ref(true);
const moneyOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
        parentId: null,
        ancestors: null,
        orderNum: null,
        companyCode: null,
        companySname: null,
        companyName: null,
        companyEname: null,
        address: null,
        corporate: null,
        tel: null,
        fax: null,
        eMail: null,
        moneyId: null,
        logo: null,
        status: null,
  },
  rules: {
        companyId: [
      { required: true, message: "公司代码不能为空", trigger: "blur" }
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

/**查询币别列表*/
function getMoneyList() {
  listMoney().then(response => {
    moneyOptions.value = response.rows.filter(item => item.status == 0)
  })
}

/** 查询公司资料列表 */
function getList() {
  loading.value = true;
  listCompany(queryParams.value).then(response => {
    companyList.value = proxy.handleTree(response.data, "companyId", "parentId");
    loading.value = false;
  });
}

/** 查询公司资料下拉树结构 */
function getTreeselect() {
  listCompany().then(response => {
    companyOptions.value = [];
    const data = { companyId: 0, companyName: '顶级节点', children: [] };
    data.children = proxy.handleTree(response.data, "companyId", "parentId");
    companyOptions.value.push(data);
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
        companyId: null,
        parentId: null,
        ancestors: null,
        orderNum: null,
        companyCode: null,
        companySname: null,
        companyName: null,
        companyEname: null,
        address: null,
        corporate: null,
        tel: null,
        fax: null,
        eMail: null,
        moneyId: null,
        logo: null,
        remark: null,
        status: "1",

        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
  };
  proxy.resetForm("companyRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  getTreeselect();
  if (row != null && row.companyId) {
    form.value.parentId = row.companyId;
  } else {
    form.value.parentId = 0;
  }
  open.value = true;
  title.value = "添加公司资料";
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  await getTreeselect();
  if (row != null) {
    form.value.parentId = row.companyId;
  }
  getCompany(row.companyId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改公司资料";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["companyRef"].validate(valid => {
    if (valid) {
      if (form.value.companyId != null) {
        updateCompany(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCompany(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除公司资料编号为"' + row.companyId + '"的数据项？').then(function() {
    return delCompany(row.companyId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
getMoneyList();
</script>
