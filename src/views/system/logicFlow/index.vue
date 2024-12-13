<template>
  <div id="mainFlowBox">
    <div id="matrix-flow-container" ref="lfContainer" @drop="onDrop" @dragover="onDragOver"></div>
    <div class="menuList">
      <div class="action">
        <el-button type="success" plain @click="handleEdit">{{ isSilentMode ? '开启编辑' : '保存' }}</el-button>
      </div>
      <div class="listBox">
        <div class="list" v-for="(item, index) in menuList" :key="index" draggable="true"
          @dragstart="onDragStart($event, 'CustomNode', item.menuName, item.icon, item.path)">
          <div class="icon">
            <svg-icon :icon-class="item.icon" />
          </div>
          <div class="txt">
            {{ item.menuName }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import LogicFlow from '@logicflow/core';
import "@logicflow/core/lib/style/index.css";
import { listMenu } from "@/api/system/menu"
import CustomNode from "@/plugins/logicflowRender";
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'

import { getRouterDiagram, editRouterDiagram, addRouterDiagram } from "@/api/menu"
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance();
const lfContainer = ref(null);
const queryParams = ref({})
const menuList = ref([])
let lf = null;
let nodeId = 10;
let isSilentMode = ref(true)
// 定义graphData
const graphData = {
  "nodes": [],
  "edges": []
}
onMounted(() => {
  initNode();
  getList()
});

let graphPrams = {
  id: null,
  menuId: route.query.menuId || null,
  source: null
}
watch(
  () => route.query,
  (newQuery, oldQuery) => {
    if (route.name === 'LogicFlow') {
      graphPrams = {
        id: null,
        menuId: route.query.menuId || null,
        source: null
      }
      isSilentMode.value = true
      initNode();
      getList()
    }
  },
);
/** 查询菜单列表 */
async function getList() {
  await listMenu(queryParams.value).then(response => {
    menuList.value = handleTreeMenu(response.data)
   
  });
  await getRouterDiagram({ menuId: graphPrams.menuId }).then(res => {
    if (res.data) {
      graphPrams = res.data
      let source = JSON.parse(graphPrams.source)
      lf.render(source);
    }
  })
  disableAllOperations()   //开启禁用状态
}
// 处理编辑修改
const handleSubmit = () => {
  graphPrams.source = JSON.stringify(lf.getGraphData())
  if (graphPrams.id) {
    editRouterDiagram(graphPrams).then(res => {
      ElMessage.success("操作成功")
    })
  } else {
    addRouterDiagram(graphPrams).then(res => {
      ElMessage.success("操作成功")
    })
  }
  disableAllOperations()
}
// 编辑
const handleEdit = () => {
  isSilentMode.value = !isSilentMode.value
  if (isSilentMode.value) handleSubmit()
  else enableAllOperations()
}

// 禁止一切操作
function disableAllOperations() {
  lf.updateEditConfig({
    isSilentMode: true,      // 禁止用户交互
    stopScrollGraph: true,   // 禁止滚动
    stopZoomGraph: true,     // 禁止缩放
    stopMoveGraph: true      // 禁止移动画布
  });
}

// 如果需要重新启用操作
function enableAllOperations() {
  lf.updateEditConfig({
    isSilentMode: false,     // 启用用户交互
    stopScrollGraph: false,  // 允许滚动
    stopZoomGraph: false,    // 允许缩放
    stopMoveGraph: false     // 允许移动画布
  });
}

const initNode = () => {
  lf = new LogicFlow({
    container: lfContainer.value,
    isSilentMode: false,     // 启用用户交互
    stopScrollGraph: false,  // 允许滚动
    stopZoomGraph: false,    // 允许缩放
    stopMoveGraph: false,     // 允许移动画布
    keyboard: {
      enabled: true,
    },
    background: "white",
    width: '100%',
    height: '100%',
  });
  lf.setTheme({
    polyline: {
      stroke: "rgb(24, 125, 255)",
      strokeWidth: 2,
    },
  });
  lf.register(CustomNode);
  lf.render(graphData);
  // 假设你已经初始化了 LogicFlow 实例 lf
  lf.on('node:dbclick', ({ data, e }) => {
    let path = '/' + data.properties.path
    if (isSilentMode.value) router.push({ path: path })
  });
};

let nodeType = null
let nodeTxt = null
let nodeIcon = null
let nodePath = null
// 处理拖拽事件
const onDragStart = (event, type, txt, icon, path) => {
  nodeType = type
  nodeTxt = txt
  nodeIcon = icon
  nodePath = path
};

const onDrop = (event, txt) => {
  if (isSilentMode.value) return
  event.preventDefault();
  const { offsetX, offsetY } = event;  // 获取拖放时的坐标
  nodeId += 10;
  lf.addNode({
    id: nodeId,
    type: nodeType,
    x: offsetX,  // 根据拖拽位置设置节点坐标
    y: offsetY,
    text: nodeTxt,
    properties: {
      iconHref: `#icon-${nodeIcon}`,  // 传递自定义图标ID
      path: nodePath
    }
  });
};

const onDragOver = (event) => {
  event.preventDefault();  // 必须阻止默认事件才能触发drop事件
};

const handleTreeMenu = (list) => {
  // Step 1: 创建一个 parentMap 存储每个菜单项
  let parentMap = {};

  // Step 2: 遍历 list，将每个菜单项按 menuId 存入 parentMap
  list.forEach(item => {
    if (item.menuType === 'M') parentMap[item.menuId] = item;
  });

  // Step 3: 用于存储所有 menuType: "C" 的菜单项
  let menuCList = [];

  // Step 4: 定义递归函数来拼接 path
  function buildPath(menu) {
    if (menu.parentId === 0 || !parentMap[menu.parentId]) return;
    const parent = parentMap[menu.parentId];

    // 如果当前菜单没有拼接过 path 才进行拼接
    if (!menu.path.startsWith(parent.path)) {
      buildPath(parent);  // 递归处理父类
      menu.path = `${parent.path}/${menu.path}`;  // 拼接父类 path
    }
  }

  // Step 5: 处理每个菜单项，拼接路径并筛选 menuType: "C" 的项
  list.forEach(menu => {
    if (menu.menuType === "C") {
      buildPath(menu);  // 递归构建 path
      menuCList.push(menu);  // 将 menuType: "C" 的菜单项放入新数组
    }
  });

  // Step 6: 返回处理后的 menuType: "C" 的菜单
  return menuCList;
};


</script>

<style lang="scss">
#mainFlowBox {
  height: 100%;
  display: flex;


  #matrix-flow-container {
    width: 100%;
    height: 100%;
  }

  #matrix-flow-container>div {
    height: 100%;
  }

  .drag-item {
    margin-top: 10px;
    padding: 8px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    cursor: grab;
  }

  .action {
    display: flex;
    justify-content: flex-end;
    padding: 10px 13px 0 4px;

    button {
      width: 50%;
    }
  }

  .menuList {
    max-width: 330px;
    background: white;

    .listBox {
      height: 95%;
      overflow: auto;
    }

    .list {
      width: 150px;
      height: 45px;
      background: rgb(255, 255, 255);
      margin: 5px;
      text-align: center;
      border: 1px solid #ddd;
      font-size: 14px;
      padding: 4px;
      color: dimgray;
      display: inline-block;
    }
  }
}
</style>
