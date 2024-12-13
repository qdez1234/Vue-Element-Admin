import request from '@/utils/request'

// 查询客户资料列表
export function listCustomer(query) {
  return request({
    url: '/base/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客户资料详细
export function getCustomer(custId) {
  return request({
    url: '/base/customer/' + custId,
    method: 'get'
  })
}

// 新增客户资料
export function addCustomer(data) {
  return request({
    url: '/base/customer',
    method: 'post',
    data: data
  })
}

// 修改客户资料
export function updateCustomer(data) {
  return request({
    url: '/base/customer',
    method: 'put',
    data: data
  })
}

// 删除客户资料
export function delCustomer(custId) {
  return request({
    url: '/base/customer/' + custId,
    method: 'delete'
  })
}

// 启用客户资料
export function activateCustomer(custId) {
  return request({
    url: '/base/customer/activate/' + custId,
    method: 'put'
  })
}

// 停用客户资料
export function deactivateCustomer(custId) {
  return request({
    url: '/base/customer/deactivate/' + custId,
    method: 'put'
  })
}
// 审核客户资料
export function auditCustomer(custId) {
  return request({
    url: '/base/customer/audit/' + custId,
    method: 'put'
  })
}

// 反审客户资料
export function unAuditCustomer(custId) {
  return request({
    url: '/base/customer/unAudit/' + custId,
    method: 'put'
  })
}
