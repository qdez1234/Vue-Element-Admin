import request from '@/utils/request'

// 查询公司资料列表
export function listCompany(query) {
  return request({
    url: '/base/company/list',
    method: 'get',
    params: query
  })
}

// 查询公司资料详细
export function getCompany(companyId) {
  return request({
    url: '/base/company/' + companyId,
    method: 'get'
  })
}

// 新增公司资料
export function addCompany(data) {
  return request({
    url: '/base/company',
    method: 'post',
    data: data
  })
}

// 修改公司资料
export function updateCompany(data) {
  return request({
    url: '/base/company',
    method: 'put',
    data: data
  })
}

// 删除公司资料
export function delCompany(companyId) {
  return request({
    url: '/base/company/' + companyId,
    method: 'delete'
  })
}
