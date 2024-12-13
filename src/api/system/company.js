import request from '@/utils/request'

// 查询公司资料列表
export function listCompany(query) {
  return request({
    url: '/system/company/list',
    method: 'get',
    params: query
  })
}

// 查询公司资料详细
export function getCompany(companyId) {
  return request({
    url: '/system/company/' + companyId,
    method: 'get'
  })
}

// 新增公司资料
export function addCompany(data) {
  return request({
    url: '/system/company',
    method: 'post',
    data: data
  })
}

// 修改公司资料
export function updateCompany(data) {
  return request({
    url: '/system/company',
    method: 'put',
    data: data
  })
}

// 删除公司资料
export function delCompany(companyId) {
  return request({
    url: '/system/company/' + companyId,
    method: 'delete'
  })
}

// 启用公司资料
export function activateCompany(companyId) {
  return request({
    url: '/system/company/activate/' + companyId,
    method: 'put'
  })
}

// 停用公司资料
export function deactivateCompany(companyId) {
  return request({
    url: '/system/company/deactivate/' + companyId,
    method: 'put'
  })
}

// 获取公司树
export function getCompanyTree() {
  return request({
    url: '/system/company/getCompanyTree',
    method: 'get'
  })
}