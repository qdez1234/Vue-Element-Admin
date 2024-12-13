import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

// 查询用户列表
export function listRoleByPerms(query) {
  return request({
    url: '/system/role/roleListByPerms/',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system/role',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'delete'
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: data
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId) {
  return request({
    url: '/system/role/deptTree/' + roleId,
    method: 'get'
  })
}

// 根据用户ID查询部门树结构
export function userDeptTreeSelect(userId) {
  return request({
    url: '/system/role/userDeptTree/' + userId,
    method: 'get'
  })
}

// 查询角色已授权用户列表
export function allocatedCompanyList(roleId) {
  return request({
    url: '/system/role/authCompany/allocatedCompanyList/' + roleId,
    method: 'get',
  })
}

// 查询角色已授权用户列表
export function allocatedWarehouseList(roleId) {
  return request({
    url: '/system/role/authWarehouse/allocatedWarehouseList/' + roleId,
    method: 'get',
  })
}

// 取消公司授权角色
export function authCompanyCancel(data) {
  return request({
    url: '/system/role/authCompany/cancel',
    method: 'put',
    data: data
  })
}

// 取消仓库授权角色
export function authWarehouseCancel(data) {
  return request({
    url: '/system/role/authWarehouse/cancel',
    method: 'put',
    data: data
  })
}

// 授权公司选择
export function authCompanySelectAll(data) {
  return request({
    url: '/system/role/authCompany/selectAll',
    method: 'put',
    params: data
  })
}

// 查询角色未授权公司列表
export function unallocatedCompanyList(query) {
  return request({
    url: '/system/role/authCompany/unallocatedList',
    method: 'get',
    params: query
  })
}

// 授权仓库选择
export function authWarehouseSelectAll(data) {
  return request({
    url: '/system/role/authWarehouse/selectAll',
    method: 'put',
    params: data
  })
}

// 查询角色未授权仓库列表
export function unallocatedWarehouseList(query) {
  return request({
    url: '/system/role/authWarehouse/unallocatedList' ,
    method: 'get',
    params: query
  })
}
