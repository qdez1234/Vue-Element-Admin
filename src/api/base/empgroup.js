import request from '@/utils/request'

// 查询组别资料列表
export function listEmpgroup(query) {
  return request({
    url: '/base/empgroup/list',
    method: 'get',
    params: query
  })
}

// 查询组别资料详细
export function getEmpgroup(groupId) {
  return request({
    url: '/base/empgroup/' + groupId,
    method: 'get'
  })
}

// 新增组别资料
export function addEmpgroup(data) {
  return request({
    url: '/base/empgroup',
    method: 'post',
    data: data
  })
}

// 修改组别资料
export function updateEmpgroup(data) {
  return request({
    url: '/base/empgroup',
    method: 'put',
    data: data
  })
}

// 删除组别资料
export function delEmpgroup(groupId) {
  return request({
    url: '/base/empgroup/' + groupId,
    method: 'delete'
  })
}


// 启用工作中心
export function activateEmpgroup(groupId) {
  return request({
    url: '/base/empgroup/activate/' + groupId,
    method: 'put'
  })
}

// 停用工作中心
export function deactivateEmpgroup(groupId) {
  return request({
    url: '/base/empgroup/deactivate/' + groupId,
    method: 'put'
  })
}
// 审核工作中心
export function auditEmpgroup(groupId) {
  return request({
    url: '/base/empgroup/audit/' + groupId,
    method: 'put'
  })
}

// 反审工作中心
export function unAuditEmpgroup(groupId) {
  return request({
    url: '/base/empgroup/unAudit/' + groupId,
    method: 'put'
  })
}
