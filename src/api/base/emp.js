import request from '@/utils/request'

// 查询员工资料列表
export function listEmp(query) {
  return request({
    url: '/base/emp/list',
    method: 'get',
    params: query
  })
}

// 查询员工资料详细
export function getEmp(empId) {
  return request({
    url: '/base/emp/' + empId,
    method: 'get'
  })
}

// 新增员工资料
export function addEmp(data) {
  return request({
    url: '/base/emp',
    method: 'post',
    data: data
  })
}

// 修改员工资料
export function updateEmp(data) {
  return request({
    url: '/base/emp',
    method: 'put',
    data: data
  })
}

// 删除员工资料
export function delEmp(empId) {
  return request({
    url: '/base/emp/' + empId,
    method: 'delete'
  })
}

// 启用工作中心
export function activateEmp(empId) {
  return request({
    url: '/base/emp/activate/' + empId,
    method: 'put'
  })
}

// 停用工作中心
export function deactivateEmp(empId) {
  return request({
    url: '/base/emp/deactivate/' + empId,
    method: 'put'
  })
}

// 停用工作中心
export function departEmp(empIds,data) {
  return request({
    url: '/base/emp/depart/' + empIds,
    method: 'put',
    data: data
  })
}

//外部查询员工列表

export function listEmpOptions(query) {
  return request({
    url: '/base/emp/publicImportQuery',
    method: 'get',
    params: query
  })
}
