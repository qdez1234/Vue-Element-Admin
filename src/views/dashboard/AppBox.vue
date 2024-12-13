<template>
  <div class="app_box">
    <el-row class="app_row">
      <el-card shadow="hover" class="app-card">
        <template #header>
          <div class="card-header">
            <span>功能清单</span>
          </div>
        </template>
        <el-tabs v-model="activeName" class="menu-tabs">
          <el-tab-pane v-for="data in routers" :label="data.meta.title" :name="data.name" :key="data.path">
            <el-col v-for="(item, index) in genMenuList(data.path, data.children)" :key="index" :md="8" :lg="4" :xl="3" >
              <el-card shadow="hover" @click="addTabMenu(item.path)">
                <div  class="app_inner" @click="addTabMenu(item.path)">
                  <span class="app_icon" :style="{ background: getMenuColor(index) }">
                    <svg-icon :icon-class="item.icon" />
                  </span>
                  <span>{{ item.title }}</span>
                </div>
              </el-card>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-row>
  </div>
</template>

<script setup name="AppBox">
import usePermissionStore from '@/store/modules/permission'
const permissionStore = usePermissionStore()
const { proxy } = getCurrentInstance();  
const dialogTableVisible = ref(false)

// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);
// 功能清单页签默认第一页
const activeName = ref(routers.value[0].name)

const colorList=ref(['#5584fd', '#3470ff', '#ff8801', '#00d6b9', '#7e3bf3'])

function getMenuColor (index) {
  return colorList.value[index % 4]
}

function addTabMenu (path) {
  proxy.$router.push(path)
}

// 递归获取子节点
function genMenuList(path, datas) {
  let result = []
  if (!datas) {
    return result
  }
  datas.forEach(data => {
    let tempPath = path + '/' + data.path
    if (data.children) {
      result = result.concat(genMenuList(tempPath, data.children))
    } else {
      result.push({path:tempPath, title:data.meta.title, icon: data.meta.icon})
    }    
  })
  return result
}

</script>
<style lang="scss" scoped>
.app_row{
  display: block!important;
  overflow: hidden;
}
.app_row .el-col{
  display: block!important;
  width: 100%!important;
	float: left;
}
.el-card__body{
  overflow: hidden;
  .app_inner{
    padding: 16px;
    height: 64px;
    line-height: 32px;
    padding-left: 64px;
    position: relative;
    cursor: pointer;
    .app_icon{
      position: absolute;
      left: 14px;
      top: 12px;
      height:40px;
      width: 40px;
      background: #cfd4db;
      color: #FFFFFF;
      border-radius:50% ;
      border: 1px solid rgba(0,0,0,.1);
      box-sizing: border-box;
      .svg-icon{
        text-align: center;
        font-size: 22px;
        line-height: 40px;
        margin:8px auto;
        display: block;
        vertical-align: middle;
      }
    }
  }
}
.menu-tabs {
  padding: 16px;
}
.app_box{
  margin:  0 -8px;
  .el-card{
    margin: 8px;
  }
}

.app_box .app_row .app-card :deep(.el-card__header) {
  padding:16px;
  line-height: 20px;
  font-size: 16px;
  font-weight: 600;
  border: 0;
  padding-bottom: 0;
}

.app_box .app_row .app-card :deep(.el-tabs__content) {
  height: 340px;
  overflow: auto;
}

</style>
