<template>

<div>
      <blog-post></blog-post>

        <blog-post2>
            <h1 slot="header"><span>About Me</span></h1>
            <p>Here's some page content</p>
            <p slot="footer">Copyright 2016 Evan You</p>
            <p>If I have some content down here</p>
        </blog-post2>
        <ele :show="show"></ele>
        <ele :show="!show"></ele>

</div>

</template>



<script>
import Vue from 'vue'


//默认创建标签方法


Vue.component('blog-post', {
  render: function (createElement) {        //remder函数自带参数crateElemtn函数用来创建html标签使用,
    var list = ['你好','你好','你好']
    return createElement('div', [            //第一个标签为创建的标签,第二个标签为对象可以是HTML内容或者class,[]代表创建的字标签, 
        list.map(function(data){              
            return createElement('li',data)
        })
    ])
  }
})

//使用$slot方法

 Vue.component('blog-post2', {
            render: function(createElement) {
                var header = this.$slots.header,//返回由VNode组成的数组     在blog-post2里面分发的插槽, $slotes.default代表的是没有命名的slot      
                    body = this.$slots.default,
                    footer = this.$slots.footer;
                return createElement('div', [
                    createElement('header', header),
                    createElement('main', body),
                    createElement('footer', footer)
                ])
            }
        });

//使用props传递数据

        Vue.component('ele', {
            render: function(createElement) {
                if (this.show) {
                    return createElement('p', 'true');
                } else {
                    return createElement('p', 'false');
                }
            },
            props: {
                show: {
                    type: Boolean,
                    default: false
                }
            }
        });


  export default {
         data() {
      return {
                show:''
      };
    },
    methods: {
  
 
    }
  }
</script>