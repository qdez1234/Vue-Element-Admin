<template>
  <div class="block">
    <span class="demonstration">完整功能</span>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size='page_size'
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</template>
<script>
  export default {
     //size-change ==>代表当前显示多少条数据(page-size)发生改变的时候触发
     //current-change==>代表着当前页数发生改变的时候触发
     //current-page ==> 默认首次现显示在第几页
     //page-sizes ==> 一个数组[100,200,300] 表示可以选着一页显示多少条数据,触发size-change函数
     //page-size ==>  默认一页显示多少条数据,当在page-sizes里面选择一页多少条数据,应该在size-change里面改变这个默认值
     //tatal ==>代表总数  
         data() {
      return {
        page_size: 100,
        currentPage4:4
      };
    },
    methods: {
      handleSizeChange(val) {
         this.page_size=val
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        console.log('一共请求多少条数据',this.page_size*val)
      }
    }
  }
</script>