/**
* v-hasPermi 操作权限处理
* Copyright (c) 2019 ruoyi
*/

import useUserStore from '@/store/modules/user'

export default {
  mounted(el, binding, vnode) {
    const { value } = binding
    const all_permission = "*:*:*";
    const permissions = useUserStore().permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
      if (!hasPermissions) {
        // 确保 el 元素的父节点、祖父节点、以及上一级存在
        if (el.parentNode && el.parentNode.parentNode && el.parentNode.parentNode.parentNode) {
          const parent = el.parentNode.parentNode.parentNode;
          const parentRow = el.parentNode.parentNode.parentNode.parentNode;
      
          // 确保 parent 存在并且具有 el-col 类
          if (parent.classList.contains('el-col')) {
            // 删除当前 el 元素的父节点的父节点的父节点
            parent.remove();
            if (parentRow) {
              // 获取当前父级同层级的所有兄弟元素
              const siblings = Array.from(parentRow.children);
              // 检查同层级是否还有其他 el-col 元素
              const hasOtherElCol = siblings.some(sibling => sibling !== parent && sibling.classList.contains('el-col'));
              // 如果没有其他 el-col，删除上一级父节点
              if (!hasOtherElCol) {
                parentRow.remove();
              }
            }
          }
        } else {
          // 如果没有祖父级节点，直接删除当前 el 元素
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }
      }

    } else {

    }
  }
}
