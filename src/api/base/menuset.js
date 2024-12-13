import request from '@/utils/request'

// 查询表单设置列表
export function listMenuset(query) {
  return request({
    url: '/base/menuset/list',
    method: 'get',
    params: query
  })
}

// 查询表单设置详细
export function getMenuset(menusetId) {
  return request({
    url: '/base/menuset/' + menusetId,
    method: 'get'
  })
}

// 新增表单设置
export function addMenuset(data) {
  return request({
    url: '/base/menuset',
    method: 'post',
    data: data
  })
}

// 修改表单设置
export function updateMenuset(data) {
  return request({
    url: '/base/menuset',
    method: 'put',
    data: data
  })
}

// 删除表单设置
export function delMenuset(menusetId) {
  return request({
    url: '/base/menuset/' + menusetId,
    method: 'delete'
  })
}

// 查询表单设置详细
export function getMenusetCode(menusetCode) {
  return request({
    url: '/base/menuset/code/' + menusetCode,
    method: 'get'
  })
}

// 查询表单单别
export function getBillstyleCode(menusetCode) {
  return request({
    url: '/base/menuset/billstyle/' + menusetCode,
    method: 'get'
  })
}