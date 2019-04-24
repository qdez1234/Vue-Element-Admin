<template>

<el-tree
  :data="data"
  :props="defaultProps"
  accordion
  @node-click="handleNodeClick">
</el-tree>
</template>

<script>
  export default {
    data() {
      return {
        seckillList:'',
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    created:function(){
      var _this=this
      this.$store.dispatch('GetSkeckillListByPage', { pageNum: 1, pageSize: 10 }).then(res => {
        if (res.data.meta.success) {
          _this.seckillList = res.data.data.list
          console.log(res.data.data.list)
        } else {
          // window.Mint.Toast(res.data.meta.message)
        }
      })
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    }
  };
</script>