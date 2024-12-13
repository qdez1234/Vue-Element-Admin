import request from '@/utils/request'

// 查询自定义事件列表
export function listEvent(query) {
  return request({
    url: '/system/customEvent/list',
    method: 'get',
    params: query
  })
}

// 查询自定义事件详细
export function getEvent(evnetId) {
  return request({
    url: '/system/customEvent/' + evnetId,
    method: 'get'
  })
}

// 新增自定义事件
export function addEvent(data) {
  return request({
    url: '/system/customEvent',
    method: 'post',
    data: data
  })
}

// 修改自定义事件
export function updateEvent(data) {
  return request({
    url: '/system/customEvent',
    method: 'put',
    data: data
  })
}

// 删除自定义事件
export function delEvent(evnetId) {
  return request({
    url: '/system/customEvent/' + evnetId,
    method: 'delete'
  })
}
