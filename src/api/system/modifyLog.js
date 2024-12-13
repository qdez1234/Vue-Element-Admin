import request from '@/utils/request'

// 查询修改日志列表
export function listModifyLog(query) {
  return request({
    url: '/system/modifyLog/list',
    method: 'get',
    params: query
  })
}

// 查询修改日志详细
export function getModifyLog(id) {
  return request({
    url: '/system/modifyLog/' + id,
    method: 'get'
  })
}

// 新增修改日志
export function addModifyLog(data) {
  return request({
    url: '/system/modifyLog',
    method: 'post',
    data: data
  })
}

// 修改修改日志
export function updateModifyLog(data) {
  return request({
    url: '/system/modifyLog',
    method: 'put',
    data: data
  })
}

// 删除修改日志
export function delModifyLog(id) {
  return request({
    url: '/system/modifyLog/' + id,
    method: 'delete'
  })
}

// 批量删除修改日志
export function delModifyLogs(ids) {
  return request({
    url: '/system/modifyLogs/' + ids,
    method: 'delete'
  })
}



export function listModifyLogOptions(query) {
  return request({
    url: '/system/modifyLog/publicImportQuery',
    method: 'get',
    params: query
  })
}

export function listDeptOptions(query) {
  return request({
    url: '/system/modifyLog/deptList',
    method: 'get',
    params: query
  })
}
