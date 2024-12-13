import request from '@/utils/request'

// 查询业务模型实体列表
export function listModel(data) {
  return request({
    url: '/api/businessModel/list',
    method: 'post',
    data: data
  })
}

// 查询业务模型实体详细
export function getModel(modelId) {
  return request({
    url: '/api/businessModel/' + modelId,
    method: 'get'
  })
}

// 新增业务模型实体
export function addModel(data) {
  return request({
    url: '/api/businessModel',
    method: 'post',
    data: data
  })
}

// 修改业务模型实体
export function updateModel(data) {
  return request({
    url: '/api/businessModel/update',
    method: 'put',
    data: data
  })
}

// 删除业务模型实体
export function delModel(modelId) {
  return request({
    url: '/api/businessModel/' + modelId,
    method: 'delete'
  })
}

// 查询业务模型实体列表
export function listEntity(data) {
  return request({
    url: '/api/businessModel/entity/list',
    method: 'post',
    data: data
  })
}