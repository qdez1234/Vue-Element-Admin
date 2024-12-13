import request from '@/utils/request'

// 查询币别汇率列表
export function listMoneyrate(query) {
  return request({
    url: '/base/moneyrate/list',
    method: 'get',
    params: query
  })
}

// 查询币别汇率详细
export function getMoneyrate(moneyrateId) {
  return request({
    url: '/base/moneyrate/' + moneyrateId,
    method: 'get'
  })
}

// 新增币别汇率
export function addMoneyrate(data) {
  return request({
    url: '/base/moneyrate',
    method: 'post',
    data: data
  })
}

// 修改币别汇率
export function updateMoneyrate(data) {
  return request({
    url: '/base/moneyrate',
    method: 'put',
    data: data
  })
}

// 删除币别汇率
export function delMoneyrate(moneyrateId) {
  return request({
    url: '/base/moneyrate/' + moneyrateId,
    method: 'delete'
  })
}
// 启用币别汇率
export function activateMoneyrate(moneyrateId) {
  return request({
    url: '/base/moneyrate/activate/' + moneyrateId,
    method: 'put'
  })
}

// 停用币别汇率
export function deactivateMoneyrate(moneyrateId) {
  return request({
    url: '/base/moneyrate/deactivate/' + moneyrateId,
    method: 'put'
  })
}
// 审核币别汇率
export function auditMoneyrate(moneyrateId) {
  return request({
    url: '/base/moneyrate/audit/' + moneyrateId,
    method: 'put'
  })
}

// 反审币别汇率
export function unAuditMoneyrate(moneyrateId) {
  return request({
    url: '/base/moneyrate/unAudit/' + moneyrateId,
    method: 'put'
  })
}
