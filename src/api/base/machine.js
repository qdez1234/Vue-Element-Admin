import request from '@/utils/request'

// 查询设备资料列表
export function listMachine(query) {
  return request({
    url: '/base/machine/list',
    method: 'get',
    params: query
  })
}

// 查询设备资料详细
export function getMachine(machineId) {
  return request({
    url: '/base/machine/' + machineId,
    method: 'get'
  })
}

// 新增设备资料
export function addMachine(data) {
  return request({
    url: '/base/machine',
    method: 'post',
    data: data
  })
}

// 修改设备资料
export function updateMachine(data) {
  return request({
    url: '/base/machine',
    method: 'put',
    data: data
  })
}

// 删除设备资料
export function delMachine(machineId) {
  return request({
    url: '/base/machine/' + machineId,
    method: 'delete'
  })
}

// 启用设备
export function activateMachine(machineId) {
  return request({
    url: '/base/machine/activate/' + machineId,
    method: 'put'
  })
}

// 停用设备
export function deactivateMachine(machineId) {
  return request({
    url: '/base/machine/deactivate/' + machineId,
    method: 'put'
  })
}
