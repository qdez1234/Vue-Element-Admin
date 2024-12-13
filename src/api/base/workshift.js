import request from '@/utils/request'

// 查询班次资料列表
export function listWorkshift(query) {
  return request({
    url: '/base/workshift/list',
    method: 'get',
    params: query
  })
}

// 查询班次资料详细
export function getWorkshift(shiftId) {
  return request({
    url: '/base/workshift/' + shiftId,
    method: 'get'
  })
}

// 新增班次资料
export function addWorkshift(data) {
  return request({
    url: '/base/workshift',
    method: 'post',
    data: data
  })
}

// 修改班次资料
export function updateWorkshift(data) {
  return request({
    url: '/base/workshift',
    method: 'put',
    data: data
  })
}

// 删除班次资料
export function delWorkshift(shiftId) {
  return request({
    url: '/base/workshift/' + shiftId,
    method: 'delete'
  })
}
