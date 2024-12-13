import request from '@/utils/request'

// 查询公共查询接口列表
export function listSearch(query) {
  return request({
    url: '/system/search/list',
    method: 'get',
    params: query
  })
}

// 查询公共查询接口详细
export function getSearch(searchId) {
  return request({
    url: '/system/search/' + searchId,
    method: 'get'
  })
}

// 新增公共查询接口
export function addSearch(data) {
  return request({
    url: '/system/search',
    method: 'post',
    data: data
  })
}

// 修改公共查询接口
export function updateSearch(data) {
  return request({
    url: '/system/search',
    method: 'put',
    data: data
  })
}

// 删除公共查询接口
export function delSearch(searchId) {
  return request({
    url: '/system/search/' + searchId,
    method: 'delete'
  })
}

// 启用公共查询接口
export function activateSearch(searchId) {
  return request({
    url: '/system/search/activate/' + searchId,
    method: 'put'
  })
}

// 停用公共查询接口
export function deactivateSearch(searchId) {
  return request({
    url: '/system/search/deactivate/' + searchId,
    method: 'put'
  })
}
