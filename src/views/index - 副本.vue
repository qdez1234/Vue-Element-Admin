<template>
  <div class="home" style="padding: 16px;">
    <div class="index-box">
      <el-row>
        <el-col class="todo-col" :xs="24" :sm="12" :md="16" :lg="16" :xl="16">
          <Todo />
        </el-col>
        <el-col class="notice-col" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <Notice />
        </el-col> 
      </el-row>
    </div>
    <AppBox />
  </div>
</template>

<script>
import AppBox from '@/views/dashboard/AppBox'
// import About from '@/views/dashboard/About'
import Todo from '@/views/dashboard/ToDo'
// import ProjectBox from '@/views/dashboard/ProjectBox'
import Notice from '@/views/dashboard/Notice'
// import ProductBox from '@/views/dashboard/ProductBox'
// import LineChart from '@/views/dashboard/LineChart'
// import PieChart from '@/views/dashboard/PieChart'
// import RaddarChart from '@/views/dashboard/RaddarChart'
// import BarChart from '@/views/dashboard/BarChart'
import ReportBox from '@/views/dashboard/ReportBox'
</script>

<style  lang="scss" >
  
.home{
  
  height: calc(100vh - 90px);
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;

  .index-box {
    flex: 1;
    margin: 0 -8px;
    .el-card{
      margin: 8px;
    }
    .el-card__body{
        padding: 0;
      .box{
        padding: 16px;
        min-height: 240px;
      }
    }
  }

  .app_box {
    flex: 0;
    // display: flex;
    // flex-flow: column nowrap;
    height: 450px;
    margin:  0 -8px;
    .el-card{
      margin: 8px;
    }
    .el-card__body{
        padding: 0;
    }
  }

  margin-top: -8px;

  



}
</style>


<script setup name="Index">
// const version = ref('3.8.4')

// function goTarget(url) {
//   window.open(url, '__blank')
// }
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
