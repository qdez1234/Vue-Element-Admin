import Vue from 'vue'
import Vuex from 'vuex'


const state={
    map:10
}
const mutations={
    addCount(state){
         state.map=20
    }
}
const actions={
    addMap({ cocmmit },payload){
      return  new Promise((resolve,reject)=>{
                resolve(payload)
        })
    },
    GetSkeckillListByPage ({ commit }, payload) {
        console.log(this)
        return new Promise((resolve, reject) => {
          this._vm.$baseAxios({
            method: 'get',
            url: '/api/activity/queue/current',
            params: payload
          }).then(response => {
            resolve(response)
          }, err => {
            reject(err)
          }).catch(error => {
            console.log(error)
          })
        })
      },
}


Vue.use(Vuex)

export default new Vuex.Store({                    //在store目录下的index文件作为我们组装模块并导出 store 的地方,组装好了之后只需要在main.js里面获取到这个index文件然后再new Vue({ store注册一下即可
    state,
    mutations,
    actions
})