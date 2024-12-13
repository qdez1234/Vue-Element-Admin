<template>
  <div class="app-container  search-table-box aidex-table">
    <div class="search-emp" v-if="formStatus =='0'">
      <el-card shadow="never" ref="queryRef" style="margin-bottom: 12px;" class="search_card" v-show="showSearch">
        <div class="filter-container">
          <div class="search_box">
            <el-form :model="queryParams" ref="queryForm" label-width="80px">
              <el-row :gutter="16">
                <el-col :md="20">
                  <el-row>
                    <el-col :md="6">
                      <el-form-item label="部门" prop="deptId">
                        <el-tree-select
                            style="width: 100%"
                            v-model="queryParams.deptId"
                            :data="deptLists"
                            :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
                            value-key="deptId"
                            placeholder="请选择归属部门"
                            check-strictly
                            filterable
                            clearable
                            :render-after-expand="false"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :md="6">

                      <el-form-item label="岗位" prop="postId">
                        <el-select v-model="queryParams.postId" placeholder="请选择岗位" filterable clearable>
                          <el-option
                              v-for="item in postOptions"
                              :key="item.postId"
                              :label="item.postName"
                              :value="item.postId"

                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :md="6">
                      <el-form-item label="姓名" prop="empName">
                        <el-input
                            v-model="queryParams.empName"
                            placeholder="请输入姓名"
                            clearable
                            @keyup.enter="handleQuery"
                        />
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




                    <el-col :md="6" v-if="advanced">
                      <el-form-item label="工号" prop="empCode">
                        <el-input
                            v-model="queryParams.empCode"
                            placeholder="请输入工号"
                            clearable
                            @keyup.enter="handleQuery"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :md="6" v-if="advanced">
                      <el-form-item label="公司别" prop="companyId">
                        <el-select v-model="queryParams.companyId" placeholder="请选择公司" filterable clearable>
                          <el-option
                              v-for="item in companyLists"
                              :key="item.companyId"
                              :label="item.companySname"
                              :value="item.companyId"

                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :md="6" v-if="advanced">
                      <el-form-item label="入职日期">
                        <el-date-picker
                            style="width: 100%;"
                            v-model="daterangeJoinDate"
                            value-format="YYYY-MM-DD"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        ></el-date-picker>
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
                      <el-icon v-if="!advanced">
                        <ArrowDown/>
                      </el-icon>
                      <el-icon v-if="advanced">
                        <ArrowUp/>
                      </el-icon>
                    </a>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <el-row>
            <el-col :span="8">
              <div class="card-header">
                <span class="erp-header-text">员工资料信息</span>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="btn_box" align="right" style="float: right; display: flex;">
                <el-form :model="queryParams" ref="fullTextQueryForm" label-width="0px" @submit.prevent>
                  <el-form-item label="" prop="searchValue">
                      <el-popover
                        placement="top-start"
                        title="查询条件"
                        :width="300"
                        trigger="hover"
                        content="工号、姓名、部门、助记码"
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
                    icon="document-copy"
                    :disabled="single"
                    @click="handleCopy"
                    v-hasPermi="['base:emp:add']"
                >复制
                </el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="Plus"
                    @click="handleAdd"
                    v-hasPermi="['base:emp:add']"
                >新增
                </el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="Edit"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['base:emp:edit']"
                >修改</el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="Delete"
                    :disabled="single"
                    @click="handleDelete"
                    v-hasPermi="['base:emp:remove']"
                >删除
                </el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="Download"
                    @click="handleExport"
                    v-hasPermi="['base:emp:export']"
                >导出
                </el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="open"
                    :disabled="single"
                    @click="handleActivate"
                    v-hasPermi="['base:emp:activate']"
                >启用</el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="TurnOff"
                    :disabled="single"
                    @click="handleDeactivate"
                    v-hasPermi="['base:emp:deactivate']"
                >停用</el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="circleClose"
                    @click="handleDepart"
                    v-hasPermi="['base:emp:depart']"
                >离职处理</el-button>
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" v-model:columns="masterColumns" :options="{ menusetCode: menusetCode, className: 'BaseEmp', isForm: false }"></right-toolbar>
              </div>
            </el-col>
          </el-row>
        </template>

        <el-table stripe ref="tableRef" v-loading="loading" :data="empList" @selection-change="handleSelectionChange" @sort-change="handleSortChange"
                  draggable="" highlight-current-row style="width: 100%;" :height="tableHeight" :cell-style="setCellStyle">
          <el-table-column type="selection" width="55" align="center" fixed="left"/>
          <el-table-column label="序号" align="center" type="index" min-width="80px" fixed="left"/>
          <el-table-column label="工号" align="center" prop="empCode" fixed="left" sortable="custom"/>
          <el-table-column label="姓名" align="center" prop="empName" fixed="left" sortable="custom"/>
          <el-table-column label="英文名" align="center" prop="empEname"  min-width="120px"/>
          <el-table-column label="助记码" align="center" prop="fastCode"  min-width="120px" sortable="custom"/>
          <el-table-column label="身份证号" align="center" prop="cardCode" min-width="200px" sortable="custom"/>
          <el-table-column label="性别" align="center" prop="sex" sortable="custom">
            <template #default="scope">
              <dict-tag :options="sys_user_sex" :value="scope.row.sex"/>
            </template>
          </el-table-column>
          <el-table-column label="出生日期" align="center" prop="bornDate" min-width="150px" sortable="custom">
            <template #default="scope">
              <span>{{ parseTime(scope.row.bornDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入职日期" align="center" prop="joinDate" min-width="150px" sortable="custom">
            <template #default="scope">
              <span>{{ parseTime(scope.row.joinDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="现住址" align="center" prop="address" min-width="250px"/>
          <el-table-column label="籍贯地址" align="center" prop="npAddress" min-width="250px"/>
          <el-table-column label="联系电话" align="center" prop="tel" min-width="150px"/>
          <el-table-column label="联系人" align="center" prop="contacter"/>
          <el-table-column label="联系人电话" align="center" prop="contactTel" min-width="150px"/>
          <el-table-column label="籍贯" align="center" prop="nativeplace">
            <template #default="scope">
              <dict-tag :options="sys_emp_nativeplace" :value="scope.row.nativeplace"/>
            </template>
          </el-table-column>
          <el-table-column label="民族" align="center" prop="nation">
            <template #default="scope">
              <dict-tag :options="sys_emp_nation" :value="scope.row.nation"/>
            </template>
          </el-table-column>
          <el-table-column label="学历" align="center" prop="education">
            <template #default="scope">
              <dict-tag :options="sys_emp_education" :value="scope.row.education"/>
            </template>
          </el-table-column>
          <el-table-column label="婚姻状况" align="center" prop="marriage" min-width="100px">
            <template #default="scope">
              <dict-tag :options="sys_emp_marriage" :value="scope.row.marriage"/>
            </template>
          </el-table-column>
          <!--        <el-table-column label="照片" align="center" prop="photo">-->
          <!--          <template #default="scope">-->
          <!--            <image-preview :src="scope.row.photo" :width="50" :height="50"/>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
          <el-table-column label="岗位" align="center" prop="sysPost.postName" min-width="100px"/>

          <el-table-column label="部门" align="center" prop="sysDept.deptName" style="color:red" show-tooltip-when-overflow min-width="100px"/>
          <el-table-column label="直接上司" align="center" prop="superiorEmp.empName" min-width="100px"/>
          <el-table-column label="办公室电话" align="center" prop="deptTel" min-width="120px"/>
          <el-table-column label="电邮" align="center" prop="eMail" min-width="200px"/>
          <el-table-column label="离职日期" align="center" prop="departDate" min-width="120px">
            <template #default="scope">
              <span>{{ parseTime(scope.row.departDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="离职类型" align="center" prop="departType" min-width="100px">
            <template #default="scope">
              <dict-tag :options="sys_emp_departtype" :value="scope.row.departType"/>
            </template>
          </el-table-column>
          <el-table-column label="安全等级" align="center" prop="safeGrade" min-width="100px"/>
          <el-table-column label="公司别" align="center" prop="baseCompany.companySname" show-tooltip-when-overflow min-width="100px"/>
          <el-table-column label="状态" align="center" prop="status" sortable="custom">
            <template #default="scope">
              <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="创建者" align="center" prop="createBy"/>
          <el-table-column label="创建时间" align="center" prop="createTime" min-width="180px">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新者" align="center" prop="updateBy"/>
          <el-table-column label="更新时间" align="center" prop="updateTime" min-width="180px">
            <template #default="scope">
              <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right"
                           min-width="200px">
            <template #default="scope">
              <el-button
                  link
                  type="primary"
                  @click="handleBrowse(scope.row)"
                  v-hasPermi="['base:emp:list']"
              >查看
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                  link
                  type="primary"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['base:emp:edit']"
              >修改
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                  link
                  type="danger"
                  style="color: red;"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['base:emp:remove']"
              >删除
              </el-button>
            </template>
          </el-table-column>
          <template v-slot:empty>
            <svg-icon icon-class="search-none" style="font-size: 64px;"/>
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
    <div class="edit-emp" v-if="formStatus == '1' || formStatus== '2' || formStatus== '3'">

      <el-card class="edit-empcard" shadow="never">
        <template #header>
          <el-row>
            <el-col :span="8">
              <div class="card-header">
                <span class="erp-header-text">{{ title }}</span>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="btn_box" align="right" style="float: right;">
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
                    icon="document-copy"
                    v-if="((formStatus == '0') || (formStatus == '3')) "
                    @click="handleCopy"
                    v-hasPermi="['base:emp:add']"
                >复制
                </el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="Plus"
                    v-if="(formStatus == '1') || (formStatus == '2')"
                    @click="submitSaveAddForm"
                    v-hasPermi="['base:emp:add']"
                >保存并新增
                </el-button>

                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="Plus"
                    @click="submitSaveForm"
                    v-if="(formStatus == '1') || (formStatus == '2')"
                >保存
                </el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="Plus"
                    v-if="((formStatus == '0') || (formStatus == '3')) "
                    @click="handleAdd"
                    v-hasPermi="['base:supplier:add']"
                >新增
                </el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="Edit"
                    v-if="((formStatus == '0') || (formStatus == '3')) "

                    @click="handleUpdate"
                    v-hasPermi="['base:emp:edit']"
                >修改</el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="Delete"
                    v-if="((formStatus == '0') || (formStatus == '3'))"

                    @click="handleDelete"
                    v-hasPermi="['base:emp:remove']"
                >删除
                </el-button>

                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="open"
                    v-if="((formStatus == '0') || (formStatus == '3'))"
                    :disabled="form.status =='0'"
                    @click="handleActivate"
                    v-hasPermi="['base:emp:activate']"
                >启用</el-button>
                <el-button
                    class="filter-item"
                    style="margin-left: 8px;"
                    type="primary"
                    icon="TurnOff"
                    v-if="((formStatus == '0') || (formStatus == '3'))"
                    :disabled="form.status =='1'"
                    @click="handleDeactivate"
                    v-hasPermi="['base:emp:deactivate']"
                >停用</el-button>
              </div>
            </el-col>
          </el-row>
        </template>


        <el-form class="edit-empdata-form" ref="empRef" :model="form" :rules="rules" label-width="120px">
          <div class="form-header">
            <el-tabs v-model="masterTabs">
              <el-tab-pane label="基本信息" name="base_info">
                <el-row>
                  <el-col :span="20">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="工号" prop="empCode">
                          <el-input v-model="form.empCode" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入工号':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="姓名" prop="empName">
                          <el-input v-model="form.empName" @change="handleEmpNameChange" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入姓名':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="英文名" prop="empEname">
                          <el-input v-model="form.empEname" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入英文名':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="助词码" prop="fastCode">
                          <el-input v-model="form.fastCode" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入助记码':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="身份证号" prop="cardCode">
                          <el-input v-model="form.cardCode" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入身份证号':''" :readonly="formStatus=='0' || formStatus=='3'" @change="cardCodeChange"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="性别" prop="sex">
                          <el-select v-model="form.sex" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择性别':' '" style="width: 100%;" :disabled="formStatus=='0' || formStatus=='3'">
                            <el-option
                                v-for="dict in sys_user_sex"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="出生日期" prop="bornDate">
                          <el-date-picker clearable
                                          v-model="form.bornDate"
                                          type="date"
                                          style="width: 100%"
                                          value-format="YYYY-MM-DD"
                                          :readonly="formStatus=='0' || formStatus=='3'"
                                          :placeholder="formStatus=='1' || formStatus=='2' ? '请选择出生日期':''">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="籍贯" prop="nativeplace">
                          <el-select v-model="form.nativeplace" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择籍贯':' '" style="width: 100%;" filterable
                                     clearable :disabled="formStatus=='0' || formStatus=='3'">
                            <el-option
                                v-for="dict in sys_emp_nativeplace"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>


                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="婚姻状况" prop="marriage">
                          <el-select v-model="form.marriage" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择婚姻状况':' '" style="width: 100%;"
                                     filterable
                                     clearable
                                     :disabled="formStatus=='0' || formStatus=='3'">
                            <el-option
                                v-for="dict in sys_emp_marriage"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="学历" prop="education">
                          <el-select v-model="form.education" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择学历':' '" style="width: 100%;" filterable
                                     clearable
                                     :disabled="formStatus=='0' || formStatus=='3'">
                            <el-option
                                v-for="dict in sys_emp_education"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="民族" prop="nation">
                          <el-select v-model="form.nation" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择民族':' '" style="width: 100%;" filterable
                                     clearable
                                     :disabled="formStatus=='0' || formStatus=='3'">
                            <el-option
                                v-for="dict in sys_emp_nation"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="联系电话" prop="tel">
                          <el-input v-model="form.tel" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入联系电话':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>

                    </el-row>
                    <el-row>

                      <el-col :span="12">
                        <el-form-item label="现住址" prop="address">
                          <el-input v-model="form.address" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入现住址':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="籍贯地址" prop="npAddress">
                          <el-input v-model="form.npAddress" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入籍贯地址':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>

                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="紧急联系人" prop="contacter">
                          <el-input v-model="form.contacter" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入紧急联系人':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="紧急联系电话" prop="contactTel">
                          <el-input v-model="form.contactTel" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入紧急联系人电话':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="入职日期" prop="joinDate">
                          <el-date-picker clearable
                                          v-model="form.joinDate"
                                          type="date"
                                          style="width: 100%"
                                          value-format="YYYY-MM-DD"
                                          :readonly="formStatus=='0' || formStatus=='3'"
                                          :placeholder="formStatus=='1' || formStatus=='2' ? '请选择入职日期':''">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="归属部门" prop="deptId">
                          <el-tree-select
                              style="width: 100%"
                              v-model="form.deptId"
                              :data="deptLists"
                              :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
                              value-key="deptId"
                              :placeholder="formStatus=='1' || formStatus=='2' ? '请选择归属部门':' '"
                              check-strictly
                              filterable
                              :disabled="formStatus=='0' || formStatus=='3'"
                              @node-click="handleNodeClick"
                              :render-after-expand="false"
                          />
                        </el-form-item>
                      </el-col>

                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="岗位" prop="postId">
                          <el-select v-model="form.postId" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择岗位':' '" filterable :disabled="formStatus=='0' || formStatus=='3'">
                            <el-option
                                v-for="item in postOptions"
                                :key="item.postId"
                                :label="item.postName"
                                :value="item.postId"
                                :disabled="item.status == 1"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="归属公司" prop="companyId">
                          <el-input v-model="form.baseCompany.companySname" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择公司':' '" readonly/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="直接上司" prop="superiorId">
<!--                          <el-input v-model="form.superiorEmp.empName" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择直接上司':''" :readonly="formStatus=='0' || formStatus=='3'"/>-->
<!--                          <EmpImportField v-model="form.superiorEmp.empName" @import="handleImportFieldSelect" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择直接上司':''" :readonly="formStatus=='0' || formStatus=='3'"/>-->
                          <el-select
                              v-model="form.superiorId"

                              filterable
                              remote
                              reserve-keyword
                              :placeholder="formStatus=='1' || formStatus=='2' ? '请输入工号、姓名、部门、助记码查找':''"
                              :disabled="formStatus=='0' || formStatus=='3'"
                              remote-show-suffix
                              :remote-method="remoteQueryEmp"
                              :loading="loading"
                              style="width: 100%"
                          >
                            <el-option
                                v-for="item in empOptions"
                                :key="item.empId"
                                :label="item.empName"
                                :value="item.empId"

                            >
                              <div>{{item.empCode +'|'+ item.empName +'|'+ item.sysDept.deptName}}</div>
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :span="6">
                        <el-form-item label="办公室电话" prop="deptTel">
                          <el-input v-model="form.deptTel" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入办公室电话':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>



                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label="办公电邮" prop="eMail">
                          <el-input v-model="form.eMail" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入办公邮箱':''" :readonly="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="安全等级" prop="safeGrade">
                          <el-input-number v-model="form.safeGrade" style="width: 100%;" :placeholder="formStatus=='1' || formStatus=='2' ? '请输入安全等级':''" :readonly="formStatus=='0' || formStatus=='3'"  :min="0" :step="1"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="离职日期" prop="departDate">

                          <el-date-picker clearable
                                          v-model="form.departDate"
                                          type="date"
                                          style="width: 100%"
                                          value-format="YYYY-MM-DD"
                                          :readonly="formStatus=='0' || formStatus=='3'"
                                          :placeholder="formStatus=='1' || formStatus=='2' ? '请选择离职日期':''">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>

                      <el-col :span="6">
                        <el-form-item label="离职类型" prop="departType">
                          <el-select v-model="form.departType" style="width: 100%;" :placeholder="formStatus=='1' || formStatus=='2' ? '请选择离职类型':' '" :disabled="formStatus=='0' || formStatus=='3'">
                            <el-option
                                v-for="dict in sys_emp_departtype"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="4">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="照片">
                          <image-upload v-model="form.photo" :limit="1" file-size="0.1" :disabled="formStatus=='0' || formStatus=='3'"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>

          <div class="form-detail">
            <el-tabs v-model="detailTabs" active-name="family_info">
              <el-tab-pane label="家庭资料" class="form-detail-familypane" name="family_info">
                <el-row :gutter="10" class="mb8" >
                  <el-col :span="1.5" v-if="formStatus=='1' || formStatus=='2'">
                    <el-button type="primary" icon="Plus" @click="handleAddBaseEmpfamily">添加</el-button>
                  </el-col>
                  <el-col :span="1.5" v-if="formStatus=='1' || formStatus=='2'">
                    <el-button type="danger" icon="Delete" @click="handleDeleteBaseEmpfamily">删除</el-button>
                  </el-col>
                  <right-toolbar :search="false" :refresh="false" v-model:columns="detail1Columns" :options="{ menusetCode: menusetCode, className: 'BaseEmpfamily', isForm: false }"></right-toolbar>
                </el-row>
                <el-table :data="baseEmpfamilyList"
                          @selection-change="handleBaseEmpfamilySelectionChange" style="width: 100%"
                          ref="baseEmpfamily">
                  <el-table-column type="selection" width="50" align="center"
                                   v-if="formStatus=='1' || formStatus=='2'"/>
                  <!--                                <el-table-column label="序号" align="center" prop="index" width="50"/>-->
                  <el-table-column label="项次号" prop="itemId" width="80" v-if="detail1Columns.find(i=>{return i.javaField==='itemId'})?.isList || false"/>

                  <el-table-column label="成员姓名" prop="familyName" width="120" v-if="detail1Columns.find(i=>{return i.javaField==='familyName'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-form-item label="" label-width="0px" :prop=" 'baseEmpfamilyList.'+scope.$index+'.familyName'" >
                        <el-input v-model="scope.row.familyName" placeholder="请输入成员姓名"/>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column label="工作单位" prop="workCompany" width="250" v-if="detail1Columns.find(i=>{return i.javaField==='workCompany'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-form-item label="" label-width="0px" :prop=" 'baseEmpfamilyList.'+scope.$index+'.workCompany'" >
                        <el-input v-model="scope.row.workCompany" placeholder="请输入工作单位"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="成员关系" prop="memberShip" width="100" v-if="detail1Columns.find(i=>{return i.javaField==='memberShip'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.memberShip" placeholder="请输入成员关系"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="紧急联系人" prop="isContacts" width="150" v-if="detail1Columns.find(i=>{return i.javaField==='isContacts'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">

                      <el-radio-group v-model="scope.row.isContacts">
                        <el-radio-button
                            v-for="dict in base_yes_no"
                            :key="dict.value"
                            :label="dict.value"
                        >{{dict.label}}</el-radio-button>
                      </el-radio-group>
                    </template>
                    <template #default="scope" v-if="formStatus=='0' || formStatus=='3'">

                      <dict-tag :options="base_yes_no" :value="scope.row.isContacts"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="联系电话" prop="memberTel" width="150" v-if="detail1Columns.find(i=>{return i.javaField==='memberTel'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.memberTel" placeholder="请输入联系电话"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="住址" prop="memberAddress" width="250" v-if="detail1Columns.find(i=>{return i.javaField==='memberAddress'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.memberAddress" placeholder="请输入住址"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="教育经历" class="form-detail-educationpane" name="education_info">
                <el-row :gutter="10" class="mb8" >
                  <el-col :span="1.5" v-if="formStatus=='1' || formStatus=='2'">
                    <el-button type="primary" icon="Plus" @click="handleAddBaseEmpeducation">添加</el-button>
                  </el-col>
                  <el-col :span="1.5" v-if="formStatus=='1' || formStatus=='2'">
                    <el-button type="danger" icon="Delete" @click="handleDeleteBaseEmpeducation">删除</el-button>
                  </el-col>
                  <right-toolbar :search="false" :refresh="false" v-model:columns="detail2Columns" :options="{ menusetCode: menusetCode, className: 'BaseEmpeducation', isForm: false }"></right-toolbar>
                </el-row>
                <el-table :data="baseEmpeducationList"
                          @selection-change="handleBaseEmpeducationSelectionChange" style="width: 100%"
                          ref="baseEmpeducation">
                  <el-table-column type="selection" width="50" align="center"
                                   v-if="formStatus=='1' || formStatus=='2'"/>
                  <!--                                <el-table-column label="序号" align="center" prop="index" width="50"/>-->
                  <el-table-column label="项次号" prop="itemId" width="80" v-if="detail2Columns.find(i=>{return i.javaField==='itemId'})?.isList || false"/>

                  <el-table-column label="学校" prop="schoolName" width="250" v-if="detail2Columns.find(i=>{return i.javaField==='schoolName'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-form-item label="" label-width="0px" :prop=" 'baseEmpeducationList.'+scope.$index+'.schoolName'" >
                        <el-input v-model="scope.row.schoolName" placeholder="请输入学校"/>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column label="开始时间" prop="sDate" width="180" v-if="detail2Columns.find(i=>{return i.javaField==='sDate'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-form-item label="" label-width="0px" :prop=" 'baseEmpeducationList.'+scope.$index+'.sDate'" >

                        <el-date-picker clearable
                                        v-model="scope.row.sDate"
                                        type="date"
                                        style="width: 100%"
                                        value-format="YYYY-MM-DD"

                                        placeholder="请选择开始时间">
                        </el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="结束时间" prop="eDate" width="180" v-if="detail2Columns.find(i=>{return i.javaField==='eDate'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-date-picker clearable
                                      v-model="scope.row.eDate"
                                      type="date"
                                      style="width: 100%"
                                      value-format="YYYY-MM-DD"

                                      placeholder="请选择结束时间">
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column label="学历" prop="education" width="150" v-if="detail2Columns.find(i=>{return i.javaField==='education'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.education" placeholder="请输入学历"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="专业" prop="science" width="200" v-if="detail2Columns.find(i=>{return i.javaField==='science'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.science" placeholder="请输入专业"/>
                    </template>
                  </el-table-column>

                </el-table>
              </el-tab-pane>
              <el-tab-pane label="工作经历" class="form-detail-workpane" name="work_info">
                <el-row :gutter="10" class="mb8" >
                  <el-col :span="1.5" v-if="formStatus=='1' || formStatus=='2'">
                    <el-button type="primary" icon="Plus" @click="handleAddBaseEmpwork">添加</el-button>
                  </el-col>
                  <el-col :span="1.5" v-if="formStatus=='1' || formStatus=='2'">
                    <el-button type="danger" icon="Delete" @click="handleDeleteBaseEmpwork">删除</el-button>
                  </el-col>
                  <right-toolbar :search="false" :refresh="false" v-model:columns="detail3Columns" :options="{ menusetCode: menusetCode, className: 'BaseEmpwork', isForm: false }"></right-toolbar>
                </el-row>
                <el-table :data="baseEmpworkList"
                          @selection-change="handleBaseEmpworkSelectionChange" style="width: 100%"
                          ref="baseEmpwork">
                  <el-table-column type="selection" width="50" align="center"
                                   v-if="formStatus=='1' || formStatus=='2'"/>
                  <!--                                <el-table-column label="序号" align="center" prop="index" width="50"/>-->
                  <el-table-column label="项次号" prop="itemId" width="80" v-if="detail3Columns.find(i=>{return i.javaField==='itemId'})?.isList || false"/>

                  <el-table-column label="开始时间" prop="sDate" width="180" v-if="detail3Columns.find(i=>{return i.javaField==='sDate'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-form-item label="" label-width="0px" :prop=" 'baseEmpworkList.'+scope.$index+'.sDate'" >
                        <el-date-picker clearable
                                        v-model="scope.row.sDate"
                                        type="date"
                                        style="width: 100%"
                                        value-format="YYYY-MM-DD"

                                        placeholder="请选择开始时间">
                        </el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column label="结束时间" prop="eDate" width="180" v-if="detail3Columns.find(i=>{return i.javaField==='eDate'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-form-item label="" label-width="0px" :prop=" 'baseEmpworkList.'+scope.$index+'.eDate'" >
                        <el-date-picker clearable
                                        v-model="scope.row.eDate"
                                        type="date"
                                        style="width: 100%"
                                        value-format="YYYY-MM-DD"

                                        placeholder="请选择结束时间">
                        </el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="工作单位" prop="workCompany" width="250" v-if="detail3Columns.find(i=>{return i.javaField==='workCompany'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.workCompany" placeholder="请输入工作单位"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="部门" prop="workDept" width="150" v-if="detail3Columns.find(i=>{return i.javaField==='workDept'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.workDept" placeholder="请输入工作部门"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="职位" prop="workPost" width="150" v-if="detail3Columns.find(i=>{return i.javaField==='workPost'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.workPost" placeholder="请输入工作职位"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="薪资" prop="workSalary" width="150" v-if="detail3Columns.find(i=>{return i.javaField==='workSalary'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.workSalary" placeholder="请输入工作薪资"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="离职原因" prop="departReason" width="150" v-if="detail3Columns.find(i=>{return i.javaField==='departReason'})?.isList || false">
                    <template #default="scope" v-if="formStatus=='1' || formStatus=='2'">
                      <el-input v-model="scope.row.departReason" placeholder="请输入离职原因"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-form>


      </el-card>

    </div>


    <!-- 离职处理 -->
    <el-dialog :title="title" v-model="departOpen" width="500px" :close-on-click-modal="false" append-to-body draggable>
      <div class="dialog_box" style="height: 200px;">
        <el-form ref="empdepartRef" :model="form"  label-position="left">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="离职类型" prop="departType">
                <el-select v-model="form.departType" style="width: 100%;" placeholder='请选择离职类型'>
                  <el-option
                      v-for="dict in sys_emp_departtype"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="离职日期" prop="departDate">

                <el-date-picker
                                v-model="form.departDate"
                                type="date"
                                style="width: 100%"
                                value-format="YYYY-MM-DD"
                                placeholder='请选择离职日期'>
                </el-date-picker>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDepartForm">确 定</el-button>
          <el-button @click="departCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Emp">
import {
  listEmp,
  getEmp,
  delEmp,
  addEmp,
  updateEmp,
  deactivateEmp,
  activateEmp,
  departEmp,
  listEmpOptions
} from "@/api/base/emp";
import {deptTreeSelect} from "@/api/system/user";
import { listPost } from "@/api/system/post";
import { listCompany } from "@/api/system/company";
import {listDept} from "@/api/system/dept";
import {ref} from "vue";
import {deactivateSupplier, getSupplier} from "@/api/base/supplier";
import {getPy, handleMaxItemId} from "@/utils/erp";
import EmpImportField from '@/components/ImportField/EmpImportField'


const { proxy } = getCurrentInstance();
const { sys_emp_education, sys_emp_departtype, sys_emp_nativeplace, sys_user_sex, sys_emp_marriage, sys_normal_disable, sys_emp_nation, base_yes_no  } = proxy.useDict('sys_emp_education', 'sys_emp_departtype', 'sys_emp_nativeplace', 'sys_user_sex', 'sys_emp_marriage', 'sys_normal_disable', 'sys_emp_nation', 'base_yes_no');

const advanced = ref(false);
let tableHeight = proxy.getInitTableHeight();
const empList = ref([]);
const open = ref(false);
const departOpen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeJoinDate = ref([]);
const formStatus = ref('0');//0：表示查询浏览界面；1：表示新增界面；2：表示修改界面；3：表示单笔资料浏览界面
const deptOptions = ref(undefined);
const postOptions = ref([]);
const companyLists = ref([]);
const deptLists = ref([]);
const photopath = ref(undefined);
const baseEmpfamilyList = ref([]);
const baseEmpeducationList = ref([]);
const baseEmpworkList = ref([]);
const checkedBaseEmpfamily = ref([]);
const checkedBaseEmpeducation = ref([]);
const checkedBaseEmpwork = ref([]);
const menusetCode = ref('base.emp')
const empOptions = ref([]);
const superiorQueryParams = ref({params:{}})

const masterColumns = ref([
  { key: 0, label: "员工编码", javaField: "empCode", isForm: true, isList: true },
  { key: 1, label: "员工姓名", javaField: "empName", isForm: true, isList: true },
  { key: 2, label: "员工英文名", javaField: "empEname", isForm: true, isList: true },
  { key: 3, label: "助记码", javaField: "fastCode", isForm: true, isList: true },
  { key: 4, label: "身份证号", javaField: "cardCode", isForm: true, isList: true },
  { key: 5, label: "性别", javaField: "sex", isForm: true, isList: true },
  { key: 6, label: "出生日期", javaField: "bornDate", isForm: true, isList: true },
  { key: 7, label: "入职日期", javaField: "joinDate", isForm: true, isList: true },
  { key: 8, label: "现住址", javaField: "address", isForm: true, isList: true },
  { key: 9, label: "籍贯地址", javaField: "npAddress", isForm: true, isList: true },
  { key: 10, label: "联系手机", javaField: "tel", isForm: true, isList: true },
  { key: 11, label: "紧急联系人", javaField: "contacter", isForm: true, isList: true },
  { key: 12, label: "联系人电话", javaField: "contactTel", isForm: true, isList: true },
  { key: 13, label: "籍贯", javaField: "nationplace", isForm: true, isList: true },
  { key: 14, label: "民族", javaField: "nation", isForm: true, isList: true },
  { key: 15, label: "教育", javaField: "education", isForm: true, isList: true },
  { key: 16, label: "婚姻状况", javaField: "marriage", isForm: true, isList: true },
  { key: 17, label: "岗位", javaField: "sysPost.postName", isForm: true, isList: true },
  { key: 18, label: "部门", javaField: "sysDept.deptName", isForm: true, isList: true },
  { key: 19, label: "部门电话", javaField: "deptTel", isForm: true, isList: true },
  { key: 20, label: "电邮", javaField: "eMail", isForm: true, isList: true },
  { key: 21, label: "离职日期", javaField: "departDate", isForm: true, isList: true },
  { key: 22, label: "离职类型", javaField: "departType", isForm: true, isList: true },
  { key: 23, label: "安全等级", javaField: "safeGrade", isForm: true, isList: true },
  { key: 24, label: "公司别", javaField: "baseCompany.companySname", isForm: true, isList: true },
  { key: 25, label: "状态", javaField: "status", isForm: true, isList: true },
  { key: 26, label: "备注", javaField: "remark", isForm: true, isList: true },
  { key: 27, label: "创建者", javaField: "createBy", isForm: true, isList: true },
  { key: 28, label: "创建时间", javaField: "createTime", isForm: true, isList: true },
  { key: 29, label: "更新者", javaField: "updateBy", isForm: true, isList: true },

]);
// 家庭资料列显隐信息
const detail1Columns = ref([
  { key: 0, label: "项次号", javaField: "itemId", isForm: true, isList: true },
  { key: 1, label: "成员姓名", javaField: "familyName", isForm: true, isList: true },
  { key: 2, label: "工作单位", javaField: "workCompany", isForm: true, isList: true },
  { key: 3, label: "关系", javaField: "memberShip", isForm: true, isList: true },
  { key: 4, label: "是否紧急联系人", javaField: "isContacts", isForm: true, isList: true },
  { key: 5, label: "联系电话", javaField: "memberTel", isForm: true, isList: true },
  { key: 5, label: "住址", javaField: "memberAddress", isForm: true, isList: true },
]);

// 教育经历列显隐信息
const detail2Columns = ref([
  { key: 0, label: "项次号", javaField: "itemId", isForm: true, isList: true },
  { key: 1, label: "学校", javaField: "schoolName", isForm: true, isList: true },
  { key: 2, label: "开始时间", javaField: "sDate", isForm: true, isList: true },
  { key: 3, label: "结束时间", javaField: "eDate", isForm: true, isList: true },
  { key: 4, label: "学历", javaField: "education", isForm: true, isList: true },
  { key: 5, label: "专业", javaField: "science", isForm: true, isList: true },

]);
// 工作经历列显隐信息
const detail3Columns = ref([
  { key: 0, label: "项次号", javaField: "itemId", isForm: true, isList: true },
  { key: 1, label: "工作单位", javaField: "workCompany", isForm: true, isList: true },
  { key: 2, label: "开始时间", javaField: "sDate", isForm: true, isList: true },
  { key: 3, label: "结束时间", javaField: "eDate", isForm: true, isList: true },
  { key: 4, label: "部门", javaField: "workDept", isForm: true, isList: true },
  { key: 5, label: "职位", javaField: "workPost", isForm: true, isList: true },
  { key: 6, label: "薪资", javaField: "workSalary", isForm: true, isList: true },
  { key: 7, label: "离职原因", javaField: "departReason", isForm: true, isList: true },
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
        empCode: null,
        empName: null,
        joinDate: null,
        postId: null,
        deptId: null,
        companyId: null,
        status: null,
  },
  rules: {
        empCode: [
      { required: true, message: "工号不能为空", trigger: "blur" }
    ],
        empName: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
    fastCode: [
      { required: true, message: "助记码不能为空", trigger: "blur" }
    ],
        cardCode: [
      { required: true, message: "身份证号不能为空", trigger: "blur" }
    ],
        joinDate: [
      { required: true, message: "入职日期不能为空", trigger: "blur" }
    ],
        tel: [
      { required: true, message: "联系电话不能为空", trigger: "blur" }
    ],
        contacter: [
      { required: true, message: "联系人不能为空", trigger: "blur" }
    ],
        contactTel: [
      { required: true, message: "联系人电话不能为空", trigger: "blur" }
    ],
        deptId: [
      { required: true, message: "归属部门不能为空", trigger: "blur" }
    ],
        companyId: [
      { required: true, message: "公司别不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

const detailTabs = ref("family_info")
const masterTabs = ref("base_info")

const remoteQueryEmp = (query ) => {
  if (query) {

    loading.value = true
    setTimeout(() => {
      loading.value = false


      superiorQueryParams.value["searchValue"] = query;
      superiorQueryParams.value.params["status"] = "0";
      listEmpOptions(superiorQueryParams.value).then(response => {
        empOptions.value = response.rows;

      })
    }, 200)
  } else {
    empOptions.value = []
  }
}

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

// watch(() => form.value.empName, (value) => {
//   if (value) {
//     form.value.fastCode = getPy(value).toUpperCase()
//   } else {
//     form.value.fastCode = ''
//   }
// })

function handleEmpNameChange(value){
  if (value) {
    form.value.fastCode = getPy(value).toUpperCase()
  } else {
    form.value.fastCode = ''
  }
}
/** 展开按钮操作 */
function toggleAdvanced() {
  const oldHeight = proxy.$refs.queryRef.$el.offsetHeight
  advanced.value = !advanced.value
  nextTick(() => (
    tableHeight.value = proxy.$refs.tableRef.$el.offsetHeight - (proxy.$refs.queryRef.$el.offsetHeight-oldHeight)
  ));
}

/** 查询员工资料列表 */
function getList() {

  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeJoinDate && '' != daterangeJoinDate) {
    queryParams.value.params["beginJoinDate"] = daterangeJoinDate.value[0];
    queryParams.value.params["endJoinDate"] = daterangeJoinDate.value[1];
  }

  listEmp(queryParams.value).then(response => {
    empList.value = response.rows;
    total.value = response.total;
    loading.value = false;

  });
}
function handleImportFieldSelect(item){
  form.value.superiorId = item.empId;
  // form.value.superiorEmp.empCode = item.empCode;
  // form.value.superiorEmp.empName = item.empName;
}
// 浏览弹窗关闭按钮
function handleBrowseClose() {
  // formStatus.value = '0';
  open.value = false;
  reset();

}

// 浏览弹窗新增按钮
function handleBrowseToAdd() {
  // formStatus.value = '0';
  open.value = false;
  reset();
  formStatus.value = '1';
  title.value = "添加员工资料";
}

// 浏览弹窗修改按钮
function handleBrowseToUpdate() {
  const empId = form.value.empId;
  open.value = false;
  reset();

  getEmp(empId).then(response => {
    form.value = response.data;
    formStatus.value ='2';
    // console.log(form.value)
    title.value = "修改员工资料";
  });
}

// 浏览弹窗复制按钮
function handleBrowseToCopy() {
  let copyBeforeForm = form.value;
  open.value = false;
  reset();
  copyFormData(copyBeforeForm);
  formStatus.value = '1';
  title.value = "添加员工资料";
}

// 取消按钮
function cancel() {
  if (formStatus.value=='3'){
    formStatus.value = '0';
    reset();
  }
  else {
    if (JSON.stringify(this.form) !== sessionStorage.getItem("initForm")) {
      proxy.$modal.confirm('表单数据有变化，请确认不保存吗？').then(function () {
        formStatus.value = '0';
        reset();
      });
    } else {
      formStatus.value = '0';
      reset();
    }

  }



}

// 表单重置
function reset() {
  form.value = {
        empId: null,
        empCode: null,
        empName: null,
        empEname:null,
        fastCode:null,
        cardCode: null,
        sex: null,
        bornDate: null,
        joinDate: null,
        address: null,
        npAddress: null,
        tel: null,
        contacter: null,
        contactTel: null,
        nativeplace: null,
        nation: null,
        education: null,
        marriage: null,
        photo: null,
        postId: null,
        deptId: null,
        deptTel: null,
        eMail: null,
        departDate: null,
        departType: null,
        superiorId:null,
        safeGrade: null,
        companyId: null,
        status: "1",
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        baseCompany:{
          companyId: null,
          companyCode: null,
          companySname: null,
          companyName:null,
          Status:"1",
        },
        sysDept:{
          deptId: null,
          deptName:null,
          status:"1"
        },
        sysPost:{
          postId:null,
          postCode:null,
          postName:null,
          status:"1"
        },
       superiorEmp:{
          empCode:null,
          empName:null,
       }
  };
  baseEmpfamilyList.value = [];
  baseEmpeducationList.value = [];
  baseEmpworkList.value = [];
  proxy.resetForm("empRef");
}
/** 查询部门下拉树结构 */
function getDeptTree() {
  // deptTreeSelect().then(response => {
  //   deptOptions.value = response.data;
  //   console.log(deptOptions.value)
  // });
  listDept().then(response => {
    deptLists.value = proxy.handleTree(response.data.filter(item=>item.status=='0'), "deptId");

  });
};
/**查询岗位列表*/
function getPostList() {
  listPost().then(response => {
    postOptions.value = response.rows.filter(item => item.status == 0)

  })

}
/**查询公司列表*/
function getCompanyList() {
  listCompany().then(response => {
    companyLists.value = response.rows;

  })

}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;

  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeJoinDate.value = [];
  proxy.resetForm("queryForm");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.empId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 复制按钮操作 */
function handleCopy(row) {
  reset();
  const empId = row.empId || ids.value
  getEmp(empId).then(response => {

    form.value = JSON.parse(JSON.stringify(response.data));

    form.value["empId"] = null;
    form.value["empCode"] = null;
    form.value["empName"] = null;
    form.value["empEname"] = null;
    form.value["fastCode"] = null;
    form.value["photo"] = null;
    form.value["status"] = "0";

    form.value["createTime"] = null;
    form.value["createBy"] = null;
    form.value["updateTime"] = null;
    form.value["updateBy"] = null;


    baseEmpfamilyList.value = JSON.parse(JSON.stringify(response.data.baseEmpfamilyList));
    baseEmpeducationList.value = JSON.parse(JSON.stringify(response.data.baseEmpeducationList));
    baseEmpworkList.value = JSON.parse(JSON.stringify(response.data.baseEmpworkList));

    for (let i = 0; i < baseEmpfamilyList.value.length; i++) {
      baseEmpfamilyList.value[i].empId = null;
    }

    for (let i = 0; i < baseEmpeducationList.value.length; i++) {
      baseEmpeducationList.value[i].empId = null;
    }

    for (let i = 0; i < baseEmpworkList.value.length; i++) {
      baseEmpworkList.value[i].empId = null;
    }

    formStatus.value ='1';
    sessionStorage.setItem("initForm",JSON.stringify(form.value));
    title.value = "新增员工资料";
  });


}

/** 新增按钮操作 */
function handleAdd() {
  reset();

  formStatus.value = '1';
  sessionStorage.setItem("initForm",JSON.stringify(form.value));
  title.value = "添加员工资料";

}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const empId = row.empId || ids.value
  getEmp(empId).then(response => {
    empOptions.value = [];
    if(response.data.superiorEmp !== null){
      empOptions.value.push(response.data.superiorEmp);
    }
    console.log(empOptions.value)
    form.value = response.data;

    baseEmpfamilyList.value = response.data.baseEmpfamilyList;
    baseEmpeducationList.value = response.data.baseEmpeducationList;
    baseEmpworkList.value = response.data.baseEmpworkList;


    formStatus.value ='2';

    sessionStorage.setItem("initForm",JSON.stringify(form.value));
    title.value = "修改员工资料";
  });
}

/** 查看按钮操作 */
function handleBrowse(row) {

  reset();
  ids.value = row.empId;
  const empId = row.empId || ids.value
  getEmp(empId).then(response => {
    empOptions.value = [];
    if(response.data.superiorEmp !== null){
      empOptions.value.push(response.data.superiorEmp);
    }
    form.value = response.data;
    baseEmpfamilyList.value = response.data.baseEmpfamilyList;
    baseEmpeducationList.value = response.data.baseEmpeducationList;
    baseEmpworkList.value = response.data.baseEmpworkList;

    formStatus.value ='3';
    console.log(form.value)

    title.value = "浏览供货商资料";
  });
}

/**提交按钮*/
function submitSaveForm(){
  proxy.$refs["empRef"].validate(valid => {
    if (valid) {
      form.value.baseEmpfamilyList = baseEmpfamilyList.value;
      form.value.baseEmpeducationList = baseEmpeducationList.value;
      form.value.baseEmpworkList = baseEmpworkList.value;
      if (form.value.empId != null) {
        updateEmp(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          formStatus.value = '0';
          getList();
        });
      } else {
        addEmp(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          formStatus.value = '0';
          getList();
        });
      }
    }
  });
}
/**提交按钮*/
function submitSaveAddForm(){
  proxy.$refs["empRef"].validate(valid => {
    if (valid) {
      form.value.baseEmpfamilyList = baseEmpfamilyList.value;
      form.value.baseEmpeducationList = baseEmpeducationList.value;
      form.value.baseEmpworkList = baseEmpworkList.value;
      if (form.value.empId != null) {
        updateEmp(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          getList();
          reset();
          formStatus.value = '1';
          title.value = "添加员工资料";
          sessionStorage.setItem("initForm",JSON.stringify(form.value));
        });
      } else {
        addEmp(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          getList();
          reset();
          sessionStorage.setItem("initForm",JSON.stringify(form.value));
        });
      }
    }
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["empRef"].validate(valid => {
    if (valid) {
      form.value.baseEmpfamilyList = baseEmpfamilyList.value;
      form.value.baseEmpeducationList = baseEmpeducationList.value;
      form.value.baseEmpworkList = baseEmpworkList.value;
      if (form.value.empId != null) {

        updateEmp(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          formStatus.value = '0';
          getList();
        });
      } else {
        addEmp(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          formStatus.value = '0';
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const empIds = row.empId || ids.value;
  proxy.$modal.confirm('是否确认删除员工资料编号为"' + empIds + '"的数据项？').then(function() {
    return delEmp(empIds);
  }).then(() => {
    getList();
    if(formStatus.value == '3'){
      formStatus.value = '0';
    }
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('base/emp/export', {
    ...queryParams.value
  }, `emp_${new Date().getTime()}.xlsx`)
}
// /***/
// function getPostName(rowdata){
//   console.log(rowdata);
//
//   console.log(postOptions)
//
//
//
//
// }
function handleNodeClick(data){
  // console.log(data);
  form.value.companyId = data.companyId;
  form.value.baseCompany.companyId = data.companyId;
  form.value.baseCompany.companyCode = data.companyCode;
  form.value.baseCompany.companySname = data.companySname;
}

/**根据Id查找树状数据*/
function findNodeById(treeData,nodeId){
  for (let node of treeData) {
    if (node.id === nodeId) {
      return node; // 返回目标节点
    } else if (Array.isArray(node.children)) {
      const result = findNodeById(node.children, nodeId);
      if (result !== null) {
        return result; // 如果在子节点中找到了目标节点，则直接返回
      }
    }
  }

  return null; // 没有找到目标节点时返回null
}

function setCellStyle({row, column, rowIndex, columnIndex}) {
  let cellStyle = '';
  if(row !=null){
    if(column.label=='部门')
    {
      if (row.sysDept.status=='1')
      {

        cellStyle = {color:'red'}
      }
    }
  }
  return cellStyle;
}


/** 启用操作按钮*/
function handleActivate(row){
  const empIds = row.empId || ids.value;
  if (empList.value.find(item => item.empId == empIds).status == '0') {
    proxy.$modal.msgError('数据已启用');
    return;
  }
  proxy.$modal.confirm('是否确认启用当前数据项？').then(function() {
    return activateEmp(empIds);
  }).then(() => {
    getList();
    getEmp(empIds).then(response => {
      form.value = response.data;
      baseEmpfamilyList.value = response.data.baseEmpfamilyList;
      baseEmpeducationList.value = response.data.baseEmpeducationList;
      baseEmpworkList.value = response.data.baseEmpworkList;
    });
    proxy.$modal.msgSuccess("启用成功");
  }).catch(() => {});
}
/** 停用操作按钮*/
function handleDeactivate(row){
  const empIds = row.empId || ids.value;
  if (empList.value.find(item => item.empId == empIds).status == '1') {
    proxy.$modal.msgError('数据已停用');
    return;
  }
  proxy.$modal.confirm('是否确认停用当前数据项？').then(function() {
    return deactivateEmp(empIds);
  }).then(() => {
    getList();
    getEmp(empIds).then(response => {
      form.value = response.data;
      baseEmpfamilyList.value = response.data.baseEmpfamilyList;
      baseEmpeducationList.value = response.data.baseEmpeducationList;
      baseEmpworkList.value = response.data.baseEmpworkList;
    });
    proxy.$modal.msgSuccess("停用成功");
  }).catch(() => {});


}

/**離職處理*/
function handleDepart(row){
  proxy.$modal.confirm('请确认要离职处理当前员工吗？').then(function() {
    reset();
    form.value.departType = "1";
    form.value.departDate = new Date();

    console.log(form.value)
    departOpen.value = true;
    title.value = "离职处理"
  });
}

function submitDepartForm() {
  if (form.value.departDate == null) {
    proxy.$modal.msgError('离职日期不能为空');
    return;
  }
  if (form.value.departType == null) {
    proxy.$modal.msgError('离职类型不能为空');
    return;
  }
  const empIds = ids.value;
  const emp = {}
  emp.status = "1";
  emp.departDate = form.value.departDate;
  emp.departType = form.value.departType;
  departEmp(empIds,emp).then(response =>{
    departOpen.value = false;
    getList();
    proxy.$modal.msgSuccess("离职成功");
  })


}

function departCancel(){
  departopen.value = false;
}
/**  */
function cardCodeChange(value) {

}

function copyFormData(copyData){
  form.value.sex = copyData.sex;
  form.value.joinDate = copyData.joinDate;
  form.value.address = copyData.address;
  form.value.npAddress = copyData.npAddress;
  form.value.nation = copyData.nation;
  form.value.nativeplace = copyData.nativeplace;
  form.value.education = copyData.education;
  form.value.marriage = copyData.marriage;
  form.value.deptId = copyData.deptId;
  form.value.postId = copyData.postId;
  form.value.deptTel= copyData.deptTel;
  form.value.safeGrade = copyData.safeGrade;
  form.value.companyId = copyData.companyId;
  form.value.baseCompany = copyData.baseCompany;
  form.value.sysDept = copyData.sysDept;
  form.value.sysPost = copyData.sysPost;

}

/** 员工家庭信息添加按钮操作 */
function handleAddBaseEmpfamily() {
  let obj = {};
  obj.itemId = handleMaxItemId(baseEmpfamilyList.value)+1;
  obj.familyName = "";
  obj.workCompany = "";
  obj.memberShip = "";
  obj.isContacts = "0";
  obj.memberTel = "";
  obj.memberAddress = "";
  baseEmpfamilyList.value.push(obj);
}

/** 员工家庭信息删除按钮操作 */
function handleDeleteBaseEmpfamily() {
  if (baseEmpfamilyList.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的员工家庭信息数据");
  } else {
    const baseEmpfamilys  = baseEmpfamilyList.value;
    const checkedBaseEmpfamilys = checkedBaseEmpfamily.value;
    baseEmpfamilyList.value = baseEmpfamilys.filter(function(item) {
      return checkedBaseEmpfamilys.indexOf(item.itemId) == -1
    });
  }
}

/** 复选框选中数据 */
function handleBaseEmpfamilySelectionChange(selection) {
  checkedBaseEmpfamily.value = selection.map(item => item.itemId)
}

/** 教育经功信息添加按钮操作 */
function handleAddBaseEmpeducation() {
  let obj = {};
  obj.itemId = handleMaxItemId(baseEmpeducationList.value)+1;
  obj.schoolName = "";
  obj.sDate = "";
  obj.eDate = "";
  obj.education = "";
  obj.science = "";

  baseEmpeducationList.value.push(obj);
}

/** 教育经历信息删除按钮操作 */
function handleDeleteBaseEmpeducation() {
  if (baseEmpeducationList.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的教育经历信息数据");
  } else {
    const baseEmpeducations  = baseEmpeducationList.value;
    const checkedBaseEmpeducations = checkedBaseEmpeducation.value;
    baseEmpeducationList.value = baseEmpeducations.filter(function(item) {
      return checkedBaseEmpeducations.indexOf(item.itemId) == -1
    });
  }
}

/** 复选框选中数据 */
function handleBaseEmpeducationSelectionChange(selection) {
  checkedBaseEmpeducation.value = selection.map(item => item.itemId)
}

/** 工作经历信息添加按钮操作 */
function handleAddBaseEmpwork() {
  let obj = {};
  obj.itemId = handleMaxItemId(baseEmpworkList.value)+1;
  obj.schoolName = "";
  obj.sDate = "";
  obj.eDate = "";
  obj.education = "";
  obj.science = "";

  baseEmpworkList.value.push(obj);
}

/** 工作经历信息删除按钮操作 */
function handleDeleteBaseEmpwork() {
  if (baseEmpworkList.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的工作经历信息数据");
  } else {
    const baseEmpworks  = baseEmpworkList.value;
    const checkedBaseEmpworks = checkedBaseEmpwork.value;
    baseEmpworkList.value = baseEmpworks.filter(function(item) {
      return checkedBaseEmpworks.indexOf(item.itemId) == -1
    });
  }
}

/** 复选框选中数据 */
function handleBaseEmpworkSelectionChange(selection) {
  checkedBaseEmpwork.value = selection.map(item => item.itemId)
}

/** 排序触发事件 */
function handleSortChange(column) {
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
}

getDeptTree();
getPostList();
getCompanyList();
getList();
</script>
<style scoped lang="scss">
.erp-header-text {
  font-size: 12px;
  font-weight: bolder;
}
.app-container{
  height: calc(100vh - 84px);
  max-width: 100%;
  display: flex;
  flex-direction: column;
}
.search-emp{
  flex: 1;
}
.edit-emp{
  flex:1;
  display: flex;
  flex-direction: column;
}
.edit-empcard{
  flex:1;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body){
    padding: 0px 12px 0px 12px !important;
  }
}
.edit-empdata-form{
  flex:1;
  display: flex;
  flex-direction: column;

}

.form-header{
  height: 380px;
  margin: 0px;
}
.form-detail{
  flex: 1;
  :deep(.el-tabs){
    .el-tabs__header{
      margin: 0px;
    }
  }
}
.form-detail-familypane{
  height: calc(100vh - 84px - 12px - 12px - 51px - 2px - 380px - 40px + 2px);
  //100vh-84px app-main 与app-container高度
  //二个12px是app-container的padding上下高度
  //51px是el-card__header操作按钮区高度
  //2px 是el-card的上下borderr 1px高度
  //440是主表内容 高度
  display: flex;
  flex-direction: column;
  .mb8{
    margin-top: 4px;
    margin-bottom: 4px;
  }
  .el-table{
    flex: 1;
  }
}
.form-detail-educationpane{
  height: calc(100vh - 84px - 12px - 12px - 51px - 2px - 380px - 40px + 2px);
  //100vh-84px app-main 与app-container高度
  //二个12px是app-container的padding上下高度
  //51px是el-card__header操作按钮区高度
  //2px 是el-card的上下borderr 1px高度
  //440是主表内容 高度
  display: flex;
  flex-direction: column;
  .mb8{
    margin-top: 4px;
    margin-bottom: 4px;
  }
  .el-table{
    flex: 1;
  }
}
.form-detail-workpane{
  height: calc(100vh - 84px - 12px - 12px - 51px - 2px - 350px - 40px + 2px);
  //100vh-84px app-main 与app-container高度
  //二个12px是app-container的padding上下高度
  //51px是el-card__header操作按钮区高度
  //2px 是el-card的上下borderr 1px高度
  //440是主表内容 高度
  display: flex;
  flex-direction: column;
  .mb8{
    margin-top: 4px;
    margin-bottom: 4px;
  }
  .el-table{
    flex: 1;
  }
}
:deep(.el-form-item){
  margin-bottom: 5px;
}
:deep(.el-form-item__error){
  display: none;
}

:deep(.el-table__row) {
  height: 5px;
}
  .imgBox{
    border:1px solid #ebeef5;
    border-left:none;
    width: 100%;
    height: 100%;
    position: relative;
    .devImg{
      position:absolute;
      top:50%;
      transform:translateY(-50%);
      width:100%;
      height: auto;
      max-height: 100%;
      padding: 12px 10px;
    }
  }
</style>
