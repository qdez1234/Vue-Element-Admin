import request from '@/utils/request'

// 查询业务模型实体列表
export function listEntity(data) {
  return request({
    url: '/api/businessModel/entity/list',
    method: 'post',
    data: data
  })
}

// 查询业务模型实体详细
export function getEntity(entityId) {
  return request({
    url: '/api/businessModel/entity/' + entityId,
    method: 'get'
  })
}

// 查询表结构
export function getTableColumns(tableName) {
  return request({
    url: '/api/businessModel/db/getTableColumns/' + tableName,
    method: 'get'
  })
}


// 新增业务模型实体
export function addEntity(data) {
  return request({
    url: '/api/businessModel/entity',
    method: 'post',
    data: data
  })
}

// 修改业务模型实体
export function updateEntity(data) {
  return request({
    url: '/api/businessModel/entity',
    method: 'put',
    data: data
  })
}

// 删除业务模型实体
export function delEntity(entityId) {
  return request({
    url: '/api/businessModel/entity/' + entityId,
    method: 'delete'
  })
}