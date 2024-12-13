<template>
  <div class="typical-home" ref="portaletDiv" style="margin: 8px 0;">
    <el-row :gutter="16" class="module-list">
      <!-- 待办事项 -->
      <el-col :span="24" >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>项目简介</span>
            </div>
          </template>
          <div class="box">
            <p style="text-indent: 30px;line-height: 200%;margin: -5px;">
              基于RuoYi-Vue3（ElementPlus）扩展，仅升级前端展示样式，修改代码生成器，未修改任何后端代码，目前已经在多个项目中使用，取得良好应用，适配RuoYi-Vue版本：V3.8.2
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup name="About">
  
function goTarget (url) {
  window.open(url)
}
function caseDisplay (url) {
  this.$message.success(
    '案例正在研发中，目前尚未实现，敬请期待！',
    3
   )
}
</script>
