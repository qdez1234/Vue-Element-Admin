import request from '@/utils/request'

// 查询供货商资料列表
export function listSupplier(query) {
  return request({
    url: '/base/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询供货商资料详细
export function getSupplier(suppId) {
  return request({
    url: '/base/supplier/' + suppId,
    method: 'get'
  })
}

// 新增供货商资料
export function addSupplier(data) {
  return request({
    url: '/base/supplier',
    method: 'post',
    data: data
  })
}

// 修改供货商资料
export function updateSupplier(data) {
  return request({
    url: '/base/supplier',
    method: 'put',
    data: data
  })
}

// 删除供货商资料
export function delSupplier(suppId) {
  return request({
    url: '/base/supplier/' + suppId,
    method: 'delete'
  })
}

// 启用供货商资料
export function activateSupplier(suppId) {
  return request({
    url: '/base/supplier/activate/' + suppId,
    method: 'put'
  })
}

// 停用供货商资料
export function deactivateSupplier(suppId) {
  return request({
    url: '/base/supplier/deactivate/' + suppId,
    method: 'put'
  })
}
// 审核供货商资料
export function auditSupplier(suppId) {
  return request({
    url: '/base/supplier/audit/' + suppId,
    method: 'put'
  })
}

// 反审供货商资料
export function unAuditSupplier(suppId) {
  return request({
    url: '/base/supplier/unAudit/' + suppId,
    method: 'put'
  })
}
