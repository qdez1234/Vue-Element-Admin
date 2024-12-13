import request from '@/utils/request'

// 查询仓库库位列表
export function listHouselocation(query) {
  return request({
    url: '/base/houselocation/list',
    method: 'get',
    params: query
  })
}

// 查询仓库库位详细
export function getHouselocation(locationId) {
  return request({
    url: '/base/houselocation/' + locationId,
    method: 'get'
  })
}

// 新增仓库库位
export function addHouselocation(data) {
  return request({
    url: '/base/houselocation',
    method: 'post',
    data: data
  })
}

// 修改仓库库位
export function updateHouselocation(data) {
  return request({
    url: '/base/houselocation',
    method: 'put',
    data: data
  })
}

// 删除仓库库位
export function delHouselocation(locationId) {
  return request({
    url: '/base/houselocation/' + locationId,
    method: 'delete'
  })
}
