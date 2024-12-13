import request from '@/utils/request'

// 查询币别资料列表
export function listMoney(query) {
  return request({
    url: '/base/money/list',
    method: 'get',
    params: query
  })
}

// 查询币别资料详细
export function getMoney(moneyId) {
  return request({
    url: '/base/money/' + moneyId,
    method: 'get'
  })
}

// 新增币别资料
export function addMoney(data) {
  return request({
    url: '/base/money',
    method: 'post',
    data: data
  })
}

// 修改币别资料
export function updateMoney(data) {
  return request({
    url: '/base/money',
    method: 'put',
    data: data
  })
}

// 删除币别资料
export function delMoney(moneyId) {
  return request({
    url: '/base/money/' + moneyId,
    method: 'delete'
  })
}
