import request from '@/utils/request'

// 查询参数列表
export function listConfig(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  })
}

// 查询参数详细
export function getConfig(configId) {
  return request({
    url: '/system/config/' + configId,
    method: 'get'
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/system/config/configKey/' + configKey,
    method: 'get'
  })
}

// 新增参数配置
export function addConfig(data) {
  return request({
    url: '/system/config',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: '/system/config',
    method: 'put',
    data: data
  })
}
// 删除参数配置
export function delConfig(configId) {
  return request({
    url: '/system/config/' + configId,
    method: 'delete'
  })
}

// 刷新参数缓存
export function refreshCache() {
  return request({
    url: '/system/config/refreshCache',
    method: 'delete'
  })
}

// 获取aggrid表单配置
export function getAgConfig(configId) {
  return request({
    url: '/sys/model/table/'+ configId,
    method: 'get',
  })
}
// 数据表配置 -- 新增数据表
export function addDataBase(data) {
  return request({
    url: '/system/form',
    method: 'post',
    data: data
  })
}
// 数据表配置 --获取数据表
export function getDataBase(id) {
  return request({
    url: '/system/form/'+id,
    method: 'post',
    data: data
  })
}
// 数据表配置 --获取数据表详情
export function getDataBaseDetail(id) {
  return request({
    url: '/api/businessModel/'+id,
    method: 'get',
  })
}
// 数据表配置 --提交数据表列表
export function addDataBaseList(data) {
  return request({
    url: '/api/businessModel',
    method: 'post',
    data: data
  })
}
export function uploadDataBaseList(data) {
  return request({
    url: '/api/businessModel',
    method: 'put',
    data: data
  })
}
// 删除参数配置
export function delDataBase(id) {
  return request({
    url: "/api/businessModel/" + id,
    method: 'delete'
  })
}
// 数据表配置 --获取数据表详情
export function getDataBaseCode(id) {
  return request({
    url: '/api/businessModel/'+id,
    method: 'get',
  })
}

// 数据表配置 --通过模型名称获取模型详情
export function getDataBaseName(name) {
  return request({
    url: '/api/businessModel/name/'+name,
    method: 'get',
  })
}

// 数据表配置 --获取数据表详情
export function getBIData() {
  return request({
    url: '/system/dashboard/getAllDashboard',
    method: 'get',
  })
}
