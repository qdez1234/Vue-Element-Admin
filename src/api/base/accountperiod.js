import request from '@/utils/request'

// 查询会计期间列表
export function listAccountperiod(query) {
  return request({
    url: '/base/accountperiod/list',
    method: 'get',
    params: query
  })
}

// 查询会计期间详细
export function getAccountperiod(periodOid) {
  return request({
    url: '/base/accountperiod/' + periodOid,
    method: 'get'
  })
}

// 新增会计期间
export function addAccountperiod(data) {
  return request({
    url: '/base/accountperiod',
    method: 'post',
    data: data
  })
}

// 修改会计期间
export function updateAccountperiod(data) {
  return request({
    url: '/base/accountperiod',
    method: 'put',
    data: data
  })
}

// 删除会计期间
export function delAccountperiod(periodOid) {
  return request({
    url: '/base/accountperiod/' + periodOid,
    method: 'delete'
  })
}

// 按年自然月产生会计期间
export function generatePeriodByYear(data) {
  return request({
    url: '/base/accountperiod/generateperiodbyyear',
    method: 'post',
    data: data
  })
}

// 设置当前活动会计期间
export function setCurPeriod(data) {
  return request({
    url: '/base/accountperiod/setCurPeriod',
    method: 'put',
    data: data
  })
}

// 盘点关账
export function pdClose(data) {
  return request({
    url: '/base/accountperiod/pdClose',
    method: 'put',
    data: data
  })
}

// 取消盘点关账
export function pdCancel(data) {
  return request({
    url: '/base/accountperiod/pdCancel',
    method: 'put',
    data: data
  })
}

// 月结
export function monthClose(data) {
  return request({
    url: '/base/accountperiod/monthClose',
    method: 'put',
    data: data
  })
}

// 月结
export function monthCancel(data) {
  return request({
    url: '/base/accountperiod/monthCancel',
    method: 'put',
    data: data
  })
}
