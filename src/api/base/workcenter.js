import request from '@/utils/request'

// 查询工作中心列表
export function listWorkcenter(query) {
  return request({
    url: '/base/workcenter/list',
    method: 'get',
    params: query
  })
}

// 查询工作中心详细
export function getWorkcenter(workcenterId) {
  return request({
    url: '/base/workcenter/' + workcenterId,
    method: 'get'
  })
}

// 新增工作中心
export function addWorkcenter(data) {
  return request({
    url: '/base/workcenter',
    method: 'post',
    data: data
  })
}

// 修改工作中心
export function updateWorkcenter(data) {
  return request({
    url: '/base/workcenter',
    method: 'put',
    data: data
  })
}

// 删除工作中心
export function delWorkcenter(workcenterId) {
  return request({
    url: '/base/workcenter/' + workcenterId,
    method: 'delete'
  })
}
// 启用工作中心
export function activateWorkcenter(workcenterId) {
  return request({
    url: '/base/workcenter/activate/' + workcenterId,
    method: 'put'
  })
}

// 停用工作中心
export function deactivateWorkcenter(workcenterId) {
  return request({
    url: '/base/workcenter/deactivate/' + workcenterId,
    method: 'put'
  })
}
// 审核工作中心
export function auditWorkcenter(workcenterId) {
  return request({
    url: '/base/workcenter/audit/' + workcenterId,
    method: 'put'
  })
}

// 反审工作中心
export function unAuditWorkcenter(workcenterId) {
  return request({
    url: '/base/workcenter/unAudit/' + workcenterId,
    method: 'put'
  })
}
