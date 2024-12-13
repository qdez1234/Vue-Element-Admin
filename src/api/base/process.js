import request from '@/utils/request'

// 查询工序资料列表
export function listProcess(query) {
  return request({
    url: '/base/process/list',
    method: 'get',
    params: query
  })
}

// 查询工序资料详细
export function getProcess(processId) {
  return request({
    url: '/base/process/' + processId,
    method: 'get'
  })
}

// 新增工序资料
export function addProcess(data) {
  return request({
    url: '/base/process',
    method: 'post',
    data: data
  })
}

// 修改工序资料
export function updateProcess(data) {
  return request({
    url: '/base/process',
    method: 'put',
    data: data
  })
}

// 删除工序资料
export function delProcess(processId) {
  return request({
    url: '/base/process/' + processId,
    method: 'delete'
  })
}

// 启用工序资料
export function activateProcess(processId) {
  return request({
    url: '/base/process/activate/' + processId,
    method: 'put'
  })
}

// 停用工序资料
export function deactivateProcess(processId) {
  return request({
    url: '/base/process/deactivate/' + processId,
    method: 'put'
  })
}
// 审核工序资料
export function auditProcess(processId) {
  return request({
    url: '/base/process/audit/' + processId,
    method: 'put'
  })
}

// 反审工序资料
export function unAuditProcess(processId) {
  return request({
    url: '/base/process/unAudit/' + processId,
    method: 'put'
  })
}
