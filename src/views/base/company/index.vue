<template>
  <div class="app-container search-table-box aidex-table">
    <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
      <div class="filter-container">
        <div class="search_box">
          <el-form :model="queryParams" ref="queryForm" label-width="80px">
            <el-row :gutter="16">
              <el-col :md="6" >
                <el-form-item label="公司名称" prop="companyName">
                  <el-input
                    v-model="queryParams.companyName"
                    placeholder="请输入公司名称"
                    clearable
                    @keyup.enter="handleQuery"
                   />
                 </el-form-item>
              </el-col>
              <el-col :md="6" >
                <el-form-item label="状态" prop="status">
                  <el-select v-model="queryParams.status" placeholder="请选择状态" @change="handleQuery" clearable style="width: 100%;">
                    <el-option
                      v-for="dict in sys_normal_disable"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
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
              <span class="erp-header-text">公司资料信息</span>
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
                v-hasPermi="['base:company:add']"
              >新增</el-button>
              <el-button
                  class="filter-item"
                  style="margin-left: 8px;"
                  type="primary"
                  icon="Edit"
                  :disabled="single"
                  @click="handleUpdate"
                  v-hasPermi="['base:company:edit']"
              >修改</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Delete"
                :disabled="single"
                @click="handleDelete"
                v-hasPermi="['base:company:remove']"
              >删除</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Download"
                @click="handleExport"
                v-hasPermi="['base:company:export']"
              >导出</el-button>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </div>
          </el-col>
        </el-row>
      </template>

      <el-table stripe ref="tableRef" v-loading="loading" :data="companyList" @selection-change="handleSelectionChange" highlight-current-row style="width: 100%;" :height="tableHeight">
        <el-table-column type="selection" width="55" align="center" />
<!--        <el-table-column label="公司代码" align="center" prop="companyId" />-->
        <el-table-column label="公司别" align="center" prop="companyCode" />
        <el-table-column label="公司简称" align="center" prop="companySname" :show-overflow-tooltip="true" min-width="150px"/>
        <el-table-column label="公司名称" align="center" prop="companyName" :show-overflow-tooltip="true" min-width="250px"/>
        <el-table-column label="公司英文名" align="center" prop="companyEname" :show-overflow-tooltip="true" min-width="150px"/>
        <el-table-column label="公司地址" align="center" prop="address" :show-overflow-tooltip="true"  min-width="250px"/>
        <el-table-column label="法人" align="center" prop="corporate" />
        <el-table-column label="电话" align="center" prop="tel" />
        <el-table-column label="传真" align="center" prop="fax" />
        <el-table-column label="电邮" align="center" prop="eMail" />
<!--        <el-table-column label="Logo" align="center" prop="logo">-->
<!--          <template #default="scope">-->
<!--            <image-preview :src="scope.row.logo" :width="50" :height="50"/>-->
<!--          </template>-->
<!--        </el-table-column>-->
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
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120px" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['base:company:edit']"
            >修改</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              link
              type="danger"
              style="color: red;"
              @click="handleDelete(scope.row)"
              v-hasPermi="['base:company:remove']"
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

      <!-- 添加或修改公司资料对话框 -->
      <el-dialog :title="title" v-model="open" width="720px"  append-to-body draggable>
        <div class="dialog_box" style="height: 600px;">
          <el-form ref="companyRef" :model="form" :rules="rules"  label-position="right" label-width="90px">
            <el-row :gutter="24">
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

<!--              <el-col :span="8">-->
<!--                <el-form-item label="关联组织" prop="deptId">-->
<!--                  <el-tree-select-->
<!--                      style="width: 100%"-->
<!--                      v-model="form.deptId"-->
<!--                      :data="deptOptions"-->
<!--                      :props="{ value: 'id', label: 'label', children: 'children' }"-->
<!--                      value-key="id"-->
<!--                      placeholder="请选择关联组织代码"-->
<!--                      check-strictly-->
<!--                      :render-after-expand="false"-->
<!--                  />-->
<!--                </el-form-item>-->
<!--              </el-col>-->

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
import { listCompany, getCompany, delCompany, addCompany, updateCompany } from "@/api/base/company";

import {listMoney} from "@/api/base/money";
import {deptTreeSelect} from "@/api/system/user";

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

let tableHeight = proxy.getInitTableHeight();
const companyList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const moneyOptions = ref([]);
const deptOptions = ref(undefined);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
        companyCode: null,
        companyName: null,
        status: null,
  },
  rules: {
        companyCode: [
      { required: true, message: "公司别不能为空", trigger: "blur" }
    ],
        companySname: [
      { required: true, message: "公司简称不能为空", trigger: "blur" }
    ],
        companyName: [
      { required: true, message: "公司名称不能为空", trigger: "blur" }
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


/** 查询公司资料列表 */
function getList() {
  loading.value = true;
  listCompany(queryParams.value).then(response => {
    companyList.value = response.rows;
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
        companyId: null,
        companyCode: null,
        companySname: null,
        companyName: null,
        companyEname: null,
        address: null,
        corporate: null,
        tel: null,
        fax: null,
        eMail: null,
        moneyId:null,
        deptId:null,
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
  ids.value = selection.map(item => item.companyId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加公司资料";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const companyId = row.companyId || ids.value
  getCompany(companyId).then(response => {
    if (response.data == undefined) {
      proxy.$modal.msgError('当前数据已不存在，请刷新数据');
      return;
    }
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
  const companyIds = row.companyId || ids.value;
  proxy.$modal.confirm('是否确认删除公司资料编号为"' + companyIds + '"的数据项？').then(function() {
    return delCompany(companyIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('base/company/export', {
    ...queryParams.value
  }, `company_${new Date().getTime()}.xlsx`)
}

/**查询币别列表*/
function getMoneyList() {
  listMoney().then(response => {
    moneyOptions.value = response.rows.filter(item => item.status == 0)

  })

}

/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data;
  });
};

getDeptTree();
getMoneyList();
getList();
</script>
