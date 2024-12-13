<template>
  <div class="ex-page-container">
    <div class="type-box">
      <el-radio-group v-model="tableType" @change="setData" class="radio_box">
        <el-radio-button v-for="item in tableList" :label="item.tableId" :key="item.tableId">{{ item.name
          }}</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="handleEditPage">编辑页面</el-button>
    </div>
    <template v-for="item in tableList" :key="item.tableId">
      <cmp :GridTableData="item.data" :ref="handleSetDivRef(item.tableId)" v-show="tableType == item.tableId"
        @handleSubmit="handleSubmit" />
    </template>

  </div>
</template>


<script setup>
import { nextTick, onMounted } from "vue";
import cmp from "./cmp.vue"
import { getDataBaseCode, uploadDataBaseList } from "@/api/system/config";
import { ElMessage } from "element-plus";

const route = useRoute();

const router = useRouter()

let tableType = ref(null)

let tableList = ref([])

const divRefs = ref({}); // 存储 div 的 refs

let configData = {}
// 动态设置 div 的 ref
const handleSetDivRef = (tableId) => (el) => {
  if (el) {
    divRefs.value[tableId] = el; // 将 DOM 元素存储到数组中
  }
};
getDataBaseCode(route.query.businessModelCode).then((res) => {
  configData = res.data
  let list = res.data.sysBusinessModelDetailList || []
  tableList.value = list.map(ele => {
    return { name: ele.name, tableId: ele.sysGrid.gridId, data: ele.sysGrid }
  })
  tableType.value = tableList.value[0].tableId
});
/**
 * 保存
 */
const handleSubmit = () => {
  Object.keys(divRefs.value).forEach((ele, index) => {
    let params = divRefs.value[ele].getData()
    configData.sysBusinessModelDetailList[index].sysGrid.data = params.data
    configData.sysBusinessModelDetailList[index].sysGrid.source = params.source
    configData.sysBusinessModelDetailList[index].sysGrid.isBatchDel = params.isBatchDel
  })
  uploadDataBaseList(configData).then((res) => {
    ElMessage.success(res.msg);
  })
}
/**
 * 编辑页面
 */
const handleEditPage = ()=>{
  router.push({path:"/system/render/config",query:{businessModelCode:route.query.businessModelCode}})
}
</script>

<style scoped lang="scss">
.AgTable {
  height: 100%;
}

.ex-action-box-left {
  padding-left: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}

.type-box {
  padding: 12px 12px 0 12px;
  display: flex;
  justify-content: space-between;
}
</style>
