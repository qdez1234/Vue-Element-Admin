<template>
    <div class="app-container search-table-box aidex-table">
      <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
        <div class="filter-container">
          <div class="search_box">
            <el-form :model="queryParams" ref="queryForm" label-width="80px">
              <el-row :gutter="16">
                <el-col :md="6">
                  <el-form-item label="实体名称" prop="entityName">
                    <el-input
                      v-model="queryParams.entityName"
                      placeholder="请输入实体名称"
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
                <span class="erp-header-text">实体信息</span>
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
                  v-hasPermi="['api:businessModel:edit']"
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
          v-loading="loading"
          :data="entityList"
          stripe 
          ref="tableRef"
          row-key="id"
          :default-expand-all="isExpandAll"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          highlight-current-row 
          style="width: 100%;" 
          :height="tableHeight"
        >
          <el-table-column prop="entityName" label="实体名称" :show-overflow-tooltip="true" width="240"></el-table-column>
          <el-table-column prop="tableName" label="数据库表名" min-width="240"></el-table-column>
          <el-table-column prop="propName" label="属性名" min-width="240" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="idField" label="主键字段" min-width="240" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="foreignKeyField" width="240" label="主表外键字段" :show-overflow-tooltip="true"></el-table-column>
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
                type="success"
                @click="handleAdd(scope.row)"
                v-hasPermi="['api:businessModel:edit']"
              >新增</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                link
                type="danger"
                style="color: red;"
                @click="handleDelete(scope.row)"
                v-hasPermi="['api:businessModel:edit']"
              >删除</el-button>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <svg-icon icon-class="search-none" style="font-size: 64px;" />
            <p>暂无数据</p>
          </template>
        </el-table>
  
        <!-- 添加或修改实体对话框 -->
        <el-dialog draggable :title="title" v-model="open" width="80%" :before-close="handleClose" append-to-body>
          <div class="dialog_box" style="height: 720px;">
            <el-form ref="entityRef" :model="form" :rules="rules" label-position="right" label-width="100px">
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="上级实体">
                    <el-tree-select style="width: 100%;"
                      v-model="form.parentId"
                      :data="entityOptions"
                      :props="{ value: 'id', label: 'entityName', children: 'children' }"
                      value-key="id"
                      placeholder="选择上级实体"
                      check-strictly
                      :render-after-expand="false"
                      />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="实体名称" prop="entityName">
                    <el-input v-model="form.entityName" placeholder="请输入实体名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="数据库表名" prop="tableName">
                    <el-input v-model="form.tableName" placeholder="请输入数据库表名" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="属性名" prop="tableName">
                    <el-input v-model="form.propName" placeholder="请输入属性名" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="主键字段" prop="idField">
                  <el-input v-model="form.idField" placeholder="请输入主键字段" />
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="主表外键字段" prop="foreignKeyField">
                    <el-input v-model="form.foreignKeyField" placeholder="请输入主表外键字段" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="查询SQL" prop="listSql">
                    <el-input
                      v-model="form.listSql"
                      type="textarea"
                      :rows="4"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-divider content-position="center">实体字段</el-divider>
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button type="primary" icon="Plus" @click="handleAddField">添加</el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button type="danger" icon="Delete" @click="handleDeleteField">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button type="Success" icon="Download" @click="handleImportField">导入表字段</el-button>
                </el-col>
              </el-row>
              <el-table :data="fieldList" :row-class-name="rowFieldIndex"
                        @selection-change="handleFieldSelectionChange" style="width: 100%" height="380px"
                        ref="fieldTable">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column label="表别名" prop="tableAlias">
                  <template #default="scope">
                    <el-input v-model="scope.row.tableAlias" placeholder="请输入表别名"/>
                  </template>
                </el-table-column>
                <el-table-column label="数据库字段" prop="dbField" width="150">
                  <template #default="scope">
                    <el-input v-model="scope.row.dbField" placeholder="请输入数据库字段"/>
                  </template>
                </el-table-column>
                <el-table-column label="查询SQL Select结果字段" prop="selectField" width="150">
                  <template #default="scope">
                    <el-input v-model="scope.row.selectField" placeholder="请输入查询SQL Select结果字段"/>
                  </template>
                </el-table-column>
                <el-table-column label="Java字段" prop="javaField" width="150">
                  <template #default="scope">
                    <el-input v-model="scope.row.javaField" placeholder="请输入Java字段"/>
                  </template>
                </el-table-column>
                <el-table-column label="快捷查询字段" prop="quickQueryField" width="150">
                  <template #default="scope">
                    <el-input v-model="scope.row.quickQueryField" placeholder="请输入快捷查询字段"/>
                  </template>
                </el-table-column>
                <el-table-column label="Java类型" prop="javaType" width="150">
                  <template #default="scope">
                    <el-select v-model="scope.row.javaType">
                      <el-option label="Long" value="Long" />
                      <el-option label="String" value="String" />
                      <el-option label="Integer" value="Integer" />
                      <el-option label="Double" value="Double" />
                      <el-option label="BigDecimal" value="BigDecimal" />
                      <el-option label="Date" value="Date" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="默认名称" prop="defaultName" width="150">
                  <template #default="scope">
                    <el-input v-model="scope.row.defaultName" placeholder="请输入默认名称"/>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="是否主键" prop="isPk" width="150">
                  <template #default="scope">
                    <el-checkbox true-label="true" false-label="false" v-model="scope.row.isPk"></el-checkbox>
                  </template>
                </el-table-column> -->
                <el-table-column label="是否物理字段" prop="isPhysical" width="150">
                  <template #default="scope">
                    <el-checkbox true-label="true" false-label="false" v-model="scope.row.isPhysical"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="是否敏感数据" prop="isSensitiveness" width="150">
                  <template #default="scope">
                    <el-checkbox true-label="true" false-label="false" v-model="scope.row.isSensitiveness"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="是否全文搜索" prop="isFullTextQuery" width="150">
                  <template #default="scope">
                    <el-checkbox true-label="true" false-label="false" v-model="scope.row.isFullTextQuery"></el-checkbox>
                  </template>
                </el-table-column>
                
              </el-table>
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
  
  <script setup name="BusinessModelEntity">
  import { addEntity, delEntity, getEntity, listEntity, updateEntity, getTableColumns } from "@/api/system/entity";
  import { ElMessageBox } from 'element-plus'
  
  const { proxy } = getCurrentInstance();
  
  const tableHeight = proxy.getInitTableHeight(47);
  const entityList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const title = ref("");
  const entityOptions = ref([]);
  const isExpandAll = ref(false);
  const refreshTable = ref(true);
  const fieldList = ref([]);
  const checkedFieldList = ref([]);
  
  const data = reactive({
    form: {},
    queryParams: {
      entityName: undefined
    },
    rules: {
      entityName: [{ required: true, message: "实体名称不能为空", trigger: "blur" }],
      idField: [{ required: true, message: "主键字段不能为空", trigger: "blur" }],
      listSql: [{ required: true, message: "查询SQL不能为空", trigger: "blur" }]
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
  
  /** 查询实体列表 */
  function getList() {
    loading.value = true;
    listEntity(queryParams.value).then(response => {
      entityList.value = proxy.handleTree(response.data, "id");
      loading.value = false;
    });
  }
  /** 查询实体下拉树结构 */
  function getTreeselect() {
    entityOptions.value = [];
    listEntity({}).then(response => {
      const entity = { id: 0, entityName: "无", children: [] };
      entity.children = proxy.handleTree(response.data, "id");
      entityOptions.value.push(entity);
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
      id: undefined,
      parentId: 0,
      entityName: undefined,
    };
    fieldList.value = [];
    proxy.resetForm("entityRef");
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
    getTreeselect();
    if (row != null && row.id) {
      form.value.parentId = row.id;
    } else {
      form.value.parentId = 0;
    }
    open.value = true;
    title.value = "添加实体";
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
  function handleUpdate(row) {
    reset();
    getTreeselect();
    getEntity(row.id).then(response => {
      form.value = response.data;
      fieldList.value = response.data.fields
      open.value = true;
      title.value = "修改实体";
    });
  }
  /** 提交按钮 */
  function submitForm() {
    form.value.fields = fieldList.value;
    proxy.$refs["entityRef"].validate(valid => {
      if (valid) {
        if (form.value.id != undefined) {
          updateEntity(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addEntity(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除名称为"' + row.entityName + '"的数据项?').then(function() {
      return delEntity(row.id);
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

  /** 实体字段序号 */
function rowFieldIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 实体字段添加按钮操作 */
function handleAddField() {
  let obj = {};
  fieldList.value.push(obj);
}

/** 实体字段删除按钮操作 */
function handleDeleteField() {
  if (checkedFieldList.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的字段数据");
  } else {
    const fields = fieldList.value;
    const checkedFields = checkedFieldList.value;
    fieldList.value = fields.filter(function(item) {
      return checkedFields.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleFieldSelectionChange(selection) {
  checkedFieldList.value = selection.map(item => item.index)
}
function handleImportField() {
  const tableName = form.value.tableName;

  if (!tableName) {
    proxy.$modal.msgError("请先填写数据库名");
    return;
  }

  getTableColumns(tableName)
    .then(response => {
      if (response && response.data) {
        const newFields = response.data.map(item => ({
          dbField: item.columnName,
          selectField: item.columnName,
          javaField: toCamelCase(item.columnName),
          defaultName: item.remarks || "",
          isPhysical: true
        }));
        fieldList.value.push(...newFields); // 批量添加新字段
      } else {
        proxy.$modal.msgError("未获取到表字段数据");
      }
    })
    .catch(error => {
      console.error("获取表字段失败:", error);
      proxy.$modal.msgError("获取表字段失败，请检查数据库连接或表名");
    });
}

function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

  
  getList();
  </script>
  <style scoped lang="scss">
    .erp-header-text {
      font-size: 12px;
      font-weight: bolder;
    }
  </style>