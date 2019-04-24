import Axios from 'axios'     //注意如果通过Vue.use(Axios) 这样的用法是有问题的，axios不支持Vue.use()的声明方式,通过Vue.prototype.$baseAxios=Axios

Axios.defaults.baseURL="http://118.89.64.133:8182/mall/"  // 测试地址

Axios.defaults.withCredentials=true    //开启跨域方式

Axios.interceptors.request.use(function(config){           //添加一个拦截器,主要是对返回数据的一个处理,比如JSON
    return config
})


export default{
    install(vue){
        vue.prototype.$baseAxios = Axios
    }
}





