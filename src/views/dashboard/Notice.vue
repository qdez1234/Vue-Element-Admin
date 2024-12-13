<template>
  <el-card shadow="hover" class="notice-card">
    <template #header>
      <div class="card-header">
        <span>通知公告</span>
        <el-button class="button" text @click="handleMore">更多</el-button>
      </div>
    </template>
    <div class="box">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="tab in sys_notice_type" :key="tab.value" :label="tab.label" :name="tab.value">
          <ul class="list" style="height: 242px;">
            <li v-for="(item, index) in tableData.filter(i=>{return i.noticeType===tab.value})" :key="index">
              <span>【{{ tab.label }}】</span> <span>{{ item.noticeTitle }}</span>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
      
</template>
<script setup name="Notice">
import { listNotice } from "@/api/system/notice";
const { proxy } = getCurrentInstance();
const { sys_notice_type } = proxy.useDict("sys_notice_type");

const activeName = ref("1")
const total = ref(0);
const loading = ref(true);
const router = useRouter();
const tableData = ref([]);

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  noticeTitle: undefined,
  createBy: undefined,
  status: undefined
})

/** 查询公告列表 */
function getList() {
  loading.value = true;
  listNotice(queryParams.value).then(response => {
    tableData.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function handleMore() {
  router.push({ path: "/system/notice" });
}

getList()
</script>
<style lang="scss" scope>
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list{
    margin: 0 ;
    padding: 0;
    overflow: auto;
    li{
      line-height: 32px;
      margin: 4px 0;
      font-size: 14px;
      color: #30324a;
      list-style: none;
      cursor: pointer;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    li:hover{
      color: #5b7fff;
    }
  }
  .box .el-tabs .el-tabs__header {
    margin-bottom: 8px;
  }
  .notice-card .el-card__header {
     padding:16px;
     line-height: 20px;
     font-size: 16px;
     font-weight: 600;
     border: 0;
     padding-bottom: 0;
  }
</style>
