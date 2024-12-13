import request from '@/utils/request'

// 查询货品分类列表
export function listGoodsclass(query) {
  return request({
    url: '/base/goodsclass/list',
    method: 'get',
    params: query
  })
}

// 查询货品分类详细
export function getGoodsclass(classId) {
  return request({
    url: '/base/goodsclass/' + classId,
    method: 'get'
  })
}

// 新增货品分类
export function addGoodsclass(data) {
  return request({
    url: '/base/goodsclass',
    method: 'post',
    data: data
  })
}

// 修改货品分类
export function updateGoodsclass(data) {
  return request({
    url: '/base/goodsclass',
    method: 'put',
    data: data
  })
}

// 删除货品分类
export function delGoodsclass(classId) {
  return request({
    url: '/base/goodsclass/' + classId,
    method: 'delete'
  })
}

// 启用货品分类
export function activateGoodsclass(classId) {
  return request({
    url: '/base/goodsclass/activate/' + classId,
    method: 'put'
  })
}

// 停用货品分类
export function deactivateGoodsclass(classId) {
  return request({
    url: '/base/goodsclass/deactivate/' + classId,
    method: 'put'
  })
}
