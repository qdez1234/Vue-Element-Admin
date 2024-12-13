import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
//新增业务流程图
export const addRouterDiagram = (data) => {
  return request({
    url: '/system/diagram',
    method: 'post',
    data
  })
}

// 修改业务流程图
export const editRouterDiagram = (data) => {
  return request({
    url: '/system/diagram',
    method: 'put',
    data
  })
}
// 查询业务流程图列表
export const getRouterDiagram = (data) => {
  return request({
    url: '/system/diagram/getDiagramMenu',
    method: 'get',
    params:data
  })
}
