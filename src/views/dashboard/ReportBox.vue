<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">
        <span>报表</span>
      </div>
    </template>
    <div class="box">
      <ul class="list" style="height: 250px;">
        <li v-for="(item, index) in reportList" :key="index">
          <span @click="handleClick(item)">{{ item.title }}</span>
        </li>
      </ul>
    </div>
  </el-card>
</template>
<script setup name="ReportBox">
import usePermissionStore from '@/store/modules/permission'
import { computed } from 'vue';
const { proxy } = getCurrentInstance();
const permissionStore = usePermissionStore()
// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);


const reportList = ref([])

const report = computed(()=>routers.value.find(item=>{return item.name==="Report"})) 

reportList.value = genMenuList(report.value.path, report.value.children)

// 递归获取子节点
function genMenuList(path, datas) {
  let result = []
  if (!datas) {
    return result
  }
  datas.forEach(data => {
    let tempPath = path
    if (data.path.slice(0,1)==='/') {
      tempPath += data.path
    } else {
      tempPath = tempPath + '/' + data.path
    }
    if (data.children) {
      result = result.concat(genMenuList(tempPath, data.children))
    } else {
      result.push({path:tempPath, title:data.meta.title, icon: data.meta.icon})
    }    
  })
  return result
}

function handleClick(item) {
  proxy.$tab.openPage(item.title, item.path, {"reportName":item.title})
}

</script>
<style lang="scss" scope>
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
 .todo_top {
    .todo_top_box{
      background: #F7F9FA;
      border-radius:4px ;
      padding:12px  16px;
      span{
        font-size: 24px;
        line-height: 32px;

        color:#5584fd ;
      }
      p{
        font-size: 14px;
        color:#383838 ;
        margin: 0;
        line-height: 20px;
      }
    }
   }
   .todo_list{
     margin: 0 ;
     padding: 0;
     li{
      list-style: none;
      background: #F7F9FA;
      line-height: 20px;
      padding: 8px;
      margin:6px 0;
      cursor: pointer;
      font-size: 14px;
      p{
        margin:  0;
        display: inline-block;
        margin: 0 4px;
        vertical-align: middle;
      }
      span{
        display: inline-block;
        margin: 0 4px;
        width: calc(100% - 120px);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
     }
     li:hover{color: #5584fd;
     }
 }
</style>
