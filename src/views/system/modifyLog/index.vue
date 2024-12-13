<template>
  <div class="app-container search-table-box aidex-table">
    <div class="search-modifyLog" v-if="formStatus =='0'">
      <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
        <div class="filter-container">
          <div class="search_box">
            <el-form :model="queryParams.params" ref="queryForm" label-width="100px">
              <el-row :gutter="16">
                <el-col :span="20">
                  <el-row :gutter="16">

                    <el-col :md="6" >
                      <el-form-item label="实体类名" prop="className">
                        <el-input
                          v-model="queryParams.params.className"
                          placeholder="请输入实体类名"
                          clearable
                          @keyup.enter="handleQuery"
                         />
                       </el-form-item>
                    </el-col>

                    <el-col :md="6" >
                      <el-form-item label="数据主键" prop="objectId">
                        <el-input
                          v-model="queryParams.params.objectId"
                          placeholder="请输入数据主键"
                          clearable
                          @keyup.enter="handleQuery"
                         />
                       </el-form-item>
                    </el-col>


                    <el-col :md="6" >
                      <el-form-item label="方法名称" prop="method">
                        <el-input
                          v-model="queryParams.params.method"
                          placeholder="请输入方法名称"
                          clearable
                          @keyup.enter="handleQuery"
                         />
                       </el-form-item>
                    </el-col>

                    <el-col :md="6" >
                      <el-form-item label="日志内容" prop="modifyText">
                        <el-input
                          v-model="queryParams.params.modifyText"
                          placeholder="请输入日志内容"
                          clearable
                          @keyup.enter="handleQuery"
                         />
                       </el-form-item>
                    </el-col>

                    <el-col :md="6"  v-if="advanced">
                      <el-form-item label="修改类型" prop="status">
                        <el-select v-model="queryParams.params.modifyType" placeholder="请选择修改类型" @change="handleQuery" clearable
                                   style="width: 100%;">
                          <el-option
                              v-for="dict in sys_modify_type"
                              :key="dict.value"
                              :label="dict.label"
                              :value="dict.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :md="6" v-if="advanced">
                      <el-form-item label="修改用户" prop="userName">
                        <el-input
                          v-model="queryParams.params.userName"
                          placeholder="修改用户"
                          clearable
                          @keyup.enter="handleQuery"
                         />
                       </el-form-item>
                    </el-col>

                    <el-col :md="6" v-if="advanced">
                      <el-form-item label="操作时间">
                        <el-date-picker
                          style="width: 100%;"
                          v-model="daterangeCreateTime"
                          value-format="YYYY-MM-DD"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>

                    <el-col :md="6" v-if="advanced">
                      <el-form-item label="客户端ip" prop="ip">
                        <el-input
                          v-model="queryParams.params.ip"
                          placeholder="请输入客户端ip"
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
          <el-row style="display: flex;">
            <div class="card-header" style="width:120px">
              <!-- <span class="erp-header-text">修改日志信息</span> -->
              <el-text tag="b">修改日志信息</el-text>
            </div>
            <div class="btn_box" align="right" style="display: flex; flex: 1; justify-content: flex-end; flex-wrap: wrap;">
              <el-form :model="queryParams" ref="fullTextQueryForm" label-width="0px" @submit.prevent>
                <el-form-item label="" prop="searchValue">
                    <el-popover
                      placement="top-start"
                      title="查询条件"
                      :width="300"
                      trigger="hover"
                      :content="fullTextSearchTips"
                    >
                      <template #reference>
                        <el-input
                          style="width: 190px;"
                          v-model="queryParams.searchValue"
                          placeholder="请输入要搜索的文本内容"
                          clearable
                          @keyup.enter="handleQuery">
                          <template #append>
                            <el-button icon="Search" @click="handleQuery"/>
                          </template>
                        </el-input>
                      </template>
                    </el-popover>
                </el-form-item>
              </el-form>
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Delete"
                :disabled="single || auditStatus"
                @click="handleDelete"
                v-hasPermi="['sys:modifyLog:remove']"
              >删除
              </el-button>
              <el-button
                class="filter-item"
                style="margin-left: 8px;"
                type="primary"
                icon="Download"
                @click="handleExport"
                v-hasPermi="['sys:modifyLog:export']"
              >导出
              </el-button>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" v-model:columns="sysModifyLogColumns" :options="{ menusetCode: menusetCode, className: 'sysModifyLog' }"></right-toolbar>
            </div>
          </el-row>
        </template>

        <el-table stripe ref="tableRef" v-loading="loading" :data="modifyLogList" @selection-change="handleSelectionChange" highlight-current-row style="width: 100%;" :height="tableHeight" @sort-change="handleSortChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="日志ID" align="center" prop="id" width="85" v-if="sysModifyLogColumns.find(i=>{return i.javaField==='id'})?.isList || false"  />
          <el-table-column label="实体类名" align="center" prop="className" width="150" sortable="custom" v-if="sysModifyLogColumns.find(i=>{return i.javaField==='className'})?.isList || false" />
          <el-table-column label="数据主键" align="center" prop="objectId" width="150" sortable="custom" v-if="sysModifyLogColumns.find(i=>{return i.javaField==='objectId'})?.isList || false" />
          <el-table-column label="操作类型" align="center" prop="modifyType" width="150" sortable="custom" v-if="sysModifyLogColumns.find(i=>{return i.javaField==='modifyType'})?.isList || false">
            <template #default="scope">
              <dict-tag :options="sys_modify_type" :value="scope.row.modifyType"/>
            </template>
          </el-table-column>
          <el-table-column label="方法名称" align="center" prop="method" width="150" sortable="custom" v-if="sysModifyLogColumns.find(i=>{return i.javaField==='method'})?.isList || false" />
          <!-- <el-table-column label="日志内容" align="center" prop="modifyText" width="150" sortable="custom" v-if="sysModifyLogColumns.find(i=>{return i.javaField==='modifyText'})?.isList || false" /> -->
          <el-table-column label="操作用户" align="center" prop="user.userName" width="150" sortable="custom" v-if="sysModifyLogColumns.find(i=>{return i.javaField==='userId'})?.isList || false" />
          <el-table-column label="客户端ip" align="center" prop="ip" width="150" sortable="custom" v-if="sysModifyLogColumns.find(i=>{return i.javaField==='ip'})?.isList || false" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" min-width="200px">
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="handleBrowse(scope.row)"
                v-hasPermi="['sys:modifyLog:list']"
              >查看
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                link
                type="primary"
                @click="handleDelete(scope.row)"
                :disabled="scope.row.audited == '1'"
                v-hasPermi="['sys:modifyLog:remove']"
              >删除
              </el-button>
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
      </el-card>
    </div>

    <!--修改界面-->
    <div class="edit-modifyLog" v-if="formStatus == '1' || formStatus== '2' || formStatus== '3'">
      <el-card class="edit-modifyLogcard" shadow="never">
        <template #header>
          <el-row>
            <el-col :span="8">
              <div class="card-header">
                <span class="erp-header-text">{{ title }}</span>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="btn_box" align="right" style="float: right;align-items: center">
                <el-button
                  class="filter-item"
                  style="margin-left: 8px;"
                  type="primary"
                  icon="Close"
                  @click="cancel()"
                >返回
                </el-button>
                <el-button
                  class="filter-item"
                  style="margin-left: 8px;"
                  type="primary"
                  icon="Delete"
                  v-if="((formStatus == '0') || (formStatus == '3'))"
                  :disabled="form.audited =='1'"
                  @click="handleDelete(form)"
                  v-hasPermi="['sys:modifyLog:remove']"
                >删除
                </el-button>
              </div>
            </el-col>
          </el-row>
        </template>

        <el-form class="edit-modifyLogdata-form"  ref="modifyLogRef" :model="form" :rules="rules" label-width="120px" >
          <div class="form-header">
            <!--单号组件示例-->
            <!-- <BillnoField v-model="form.xxx" :menusetCode="menusetCode" :formStatus="formStatus" /> -->
            <el-tabs v-model="masterTabs">
              <el-tab-pane label="基本信息" name="base_info">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="修改日志ID" prop="id">
                      <el-input v-model="form.id" :placeholder="(formStatus=='1' || formStatus=='2')?'请输入实体类名':undefined" :readonly="formStatus=='0' || formStatus=='3'"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="实体类名" prop="className">
                      <el-input v-model="form.className" :placeholder="(formStatus=='1' || formStatus=='2')?'请输入实体类名':undefined" :readonly="formStatus=='0' || formStatus=='3'"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="数据主键" prop="objectId">
                      <el-input v-model="form.objectId" :placeholder="(formStatus=='1' || formStatus=='2')?'请输入数据主键':undefined" :readonly="formStatus=='0' || formStatus=='3'"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="方法名称" prop="method">
                      <el-input v-model="form.method" :placeholder="(formStatus=='1' || formStatus=='2')?'请输入方法名称':undefined" :readonly="formStatus=='0' || formStatus=='3'"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="操作用户" prop="userId">
                      <el-input v-model="form.user.userName" :placeholder="(formStatus=='1' || formStatus=='2')?'请输入操作用户':undefined" :readonly="formStatus=='0' || formStatus=='3'"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="客户端ip" prop="ip">
                      <el-input v-model="form.ip" :placeholder="(formStatus=='1' || formStatus=='2')?'请输入客户端ip':undefined" :readonly="formStatus=='0' || formStatus=='3'"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-card class="modify-log-card" shadow="never">
                      <template #header>
                        <div class="card-header">
                          <span style="margin-right: 9px;">{{ `${getFullDeptLabel(form.user.deptId)}` }}</span>
                          <span>{{ `${form.user.nickName}(${form.user.userName})` }}</span>
                          <el-divider direction="vertical" />
                          <dict-tag style="display: inline-block;" :options="sys_modify_type" :value="form.modifyType"/>
                          <el-divider direction="vertical" />
                          <span>{{ `${form.createTime}` }}</span>
                          <el-divider direction="vertical" />
                          <span>{{ `IP: ${form.ip}` }}</span>
                        </div>
                      </template>
                      <div v-for="(field, i) in form.modifyJson.main" :key="i">
                        <span>{{ `${i+1}. [${field.fieldName}] 由 "` }}</span>
                        <span style="color: #EE0000;">{{ `${field.oldValue}`}}</span>
                        <span>{{ `" 改为 "` }}</span>
                        <span style="color: #EE0000;">{{ `${field.newValue}` }}</span>
                        <span>{{ `"` }}</span>
                      </div>
                      <div v-for="(detail, j) in form.modifyJson.detail" :key="j" >
                        <el-table v-if="detail.line.length>0"
                          :ref="`detailTable-${j}`"
                          :data="detail.line"
                          width="100%">
                          <el-table-column
                            v-for="(column, k) in Object.keys(detail.line[0])"
                            :key="k"
                            :prop="column"
                            :label="column"
                            :show-overflow-tooltip="true"
                          />
                        </el-table>
                      </div>
                    </el-card>
                  </el-col>
                  
                </el-row>

                
                
              </el-tab-pane>
            </el-tabs>
          </div>
    
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup name="ModifyLog">
import {
  listModifyLog,
  getModifyLog,
  delModifyLog,
  listDeptOptions,
} from "@/api/system/modifyLog"


const { proxy } = getCurrentInstance()

const { sys_modify_type } = proxy.useDict('sys_modify_type');

const advanced = ref(false)
let tableHeight = proxy.getInitTableHeight()
const modifyLogList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const daterangeCreateTime = ref([])

const formStatus = ref('0')  //0：表示查询浏览界面；1：表示新增界面；2：表示修改界面；3：表示单笔资料浏览界面
const auditStatus = ref(false)
const menusetCode = ref('sys.modifyLog')

// 列显隐信息
/**
 * 说明
  key: 字段key
  label: 列名
  javaField: 对应的java字段
  isList: 是否允许列表显示
  */
const sysModifyLogColumns = ref([
  { key: 0, label: "日志ID", javaField: "id", isList: false },
  { key: 1, label: "实体类名", javaField: "className", isList: true },
  { key: 2, label: "数据主键", javaField: "objectId", isList: true },
  { key: 3, label: "操作类型", javaField: "modifyType", isList: true },
  { key: 4, label: "方法名称", javaField: "method", isList: true },
  { key: 5, label: "日志内容", javaField: "modifyText", isList: true },
  { key: 6, label: "操作用户", javaField: "userId", isList: true },
  { key: 7, label: "操作时间", javaField: "createTime", isList: false },
  { key: 8, label: "客户端ip", javaField: "ip", isList: true },
])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    params: {
      className: null,
      objectId: null,
      modifyType: null,
      method: null,
      modifyText: null,
      userId: null,
      createTime: null,
      ip: null
    },
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

const masterTabs = ref("base_info")

const deptOptions = ref([])

// 全文搜索条件提示
const fullTextSearchTips = ref("实体类名,数据主键,操作类型,方法名称,日志内容,操作用户,操作时间,客户端ip")

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
  ))
}

/** 查询修改日志列表 */
function getList() {
  loading.value = true
  // queryParams.value.params = {}
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0]
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1]
  }
  listModifyLog(queryParams.value).then(response => {
    modifyLogList.value = response.rows
    total.value = response.total
    loading.value = false
  }).catch(() => {})
}

// 取消按钮
function cancel() {
  if (formStatus.value=='3'){
    formStatus.value = '0'
    reset()
  }
  else
  {
    if(JSON.stringify(form.value) !== sessionStorage.getItem('initForm')) {
      proxy.$modal.confirm('表单数据有变化，请确认不保存吗？').then(function() {
        formStatus.value = '0'
        reset()
      })
    }
    else{
      formStatus.value = '0'
      reset()
    }
  }
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    className: null,
    objectId: null,
    modifyType: null,
    method: null,
    modifyText: null,
    userId: null,
    createTime: null,
    ip: null,
  }
  proxy.resetForm("modifyLogRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeCreateTime.value = []
  proxy.resetForm("queryForm")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

function getFullDeptLabel(deptId) {
  let dept = deptOptions.value.find(item => item.deptId==deptId)
  let result = ""
  if (dept) {
    result = dept.deptName
    if (dept.parentId != 0 && deptOptions.value.find(item => item.deptId==dept.parentId)) {
      result = getFullDeptLabel(dept.parentId) + ' / ' + result
    }
  }
  return result
}

/** 查看按钮操作 */
function handleBrowse(row) {
  reset()
  ids.value = row.id
  const id = row.id || ids.value
  getModifyLog(id).then(response => {
    form.value = response.data
    formStatus.value ='3'
    title.value = "浏览修改日志"
  }).catch(() => {})
}

/** 删除按钮操作 */
function handleDelete(row) {
  const id = row.id || ids.value[0]
  if (modifyLogList.value.find(item => item.id == id).audited == '1') {
    proxy.$modal.msgError("数据已审核不能删除")
    return
  }
  proxy.$modal.confirm('是否确认删除修改日志编号为"' + id + '"的数据项？').then(function() {
    delModifyLog(id).then(() => {
      getList()
      if(formStatus.value == '3') {
        formStatus.value = '0'
      }
      proxy.$modal.msgSuccess("删除成功")
    }).catch(() => {})
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sys/modifyLog/export', {
    ...queryParams.value
  }, `修改日志_${new Date().getTime()}.xlsx`)
}

/** 排序触发事件 */
function handleSortChange(column) {
  queryParams.value.orderByColumn = column.prop
  queryParams.value.isAsc = column.order
  getList()
}

/** 获取部门信息 */
function getDeptOption() {
  listDeptOptions().then(response => {
    deptOptions.value = response.data;
  });
}

getList()
getDeptOption()
</script>
<style scoped lang="scss">
.erp-header-text {
  font-size: 12px;
  font-weight: bolder;
}
.app-container {
  height: calc(100vh - 84px);
  max-width: 100%;
  display: flex;
  flex-direction: column;
}
.search-modifyLog {
  flex: 1;
}
.edit-modifyLog {
  flex:1;
  display: flex;
  flex-direction: column;
}
.edit-modifyLogcard {
  flex:1;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 0px 12px 0px 12px !important;
  }
}
.edit-modifyLogdata-form {
  flex:1;
  display: flex;
  flex-direction: column;

}

.form-header {
  flex:1;
  margin: 0px;
}

:deep(.el-form-item) {
  margin-bottom: 5px;
}
:deep(.el-form-item__error) {
  display: none;
}

:deep(.el-table__row) {
  height: 2px;
}

.modify-log-card {
  overflow: auto;
  height: 600px;
  font-size: 14px;
  padding: 12px;
  margin: 12px;
  :deep(.el-card__body) {
    margin: 8px;
    
  }
  :deep(.el-table) {
    padding-top: 10px;
  }
}
</style>