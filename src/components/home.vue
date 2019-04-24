<template>
      <div>
       <el-select v-model="value" placeholder="请选择" @change='goRouter'>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>


  </el-select>


   <template>
    <router-view></router-view>
   </template>
      </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: 'tab',
          label: 'tab表'
        },{
          value: 'tree',
          label: '节点树'
        },{
          value: 'page',
          label: '分页'
        },{
          value: 'navMenu',
          label: '导航菜单'
        },{
          value: 'createHtml',
          label: '创建组件html元素'
        }],
        value: ''
      }
    },
    methods: {
        goRouter:function(){
           const obj={x:1,y:2}
           const {n}=obj
           console.log(n)
           this.$router.push({name:this.value})
        }
        
    },
  }
</script>