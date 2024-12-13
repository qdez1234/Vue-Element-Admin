import request from '@/utils/request'

// 查询仓库资料列表
export function listWarehouse(query) {
  return request({
    url: '/base/warehouse/list',
    method: 'get',
    params: query
  })
}

// 查询仓库资料详细
export function getWarehouse(warehouseId) {
  return request({
    url: '/base/warehouse/' + warehouseId,
    method: 'get'
  })
}

// 新增仓库资料
export function addWarehouse(data) {
  return request({
    url: '/base/warehouse',
    method: 'post',
    data: data
  })
}

// 修改仓库资料
export function updateWarehouse(data) {
  return request({
    url: '/base/warehouse',
    method: 'put',
    data: data
  })
}

// 删除仓库资料
export function delWarehouse(warehouseId) {
  return request({
    url: '/base/warehouse/' + warehouseId,
    method: 'delete'
  })
}

// 启用仓库
export function activateWarehouse(warehouseId) {
  return request({
    url: '/base/warehouse/activate/' + warehouseId,
    method: 'put'
  })
}

// 停用仓库
export function deactivateWarehouse(warehouseId) {
  return request({
    url: '/base/warehouse/deactivate/' + warehouseId,
    method: 'put'
  })
}
