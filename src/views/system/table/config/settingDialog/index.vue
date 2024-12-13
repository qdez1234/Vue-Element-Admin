<template>
  <el-dialog v-model="dialogTableVisible" :before-close="handleClose" title="数据来源" width="80%" draggable>

    <div class="content">
      <reportData ref="reportDataRef" />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="left"></div>
        <div class="right">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { nextTick } from "vue";

import reportData from "./reportData.vue";

const { proxy } = getCurrentInstance();

const emit = defineEmits(["handleSubmit"]);


const reportDataRef = ref(null);

const props = defineProps({});


let dialogTableVisible = ref(false);

// 数据值
let source = {}

const handleClose = () => {
  dialogTableVisible.value = false;
};

// 开启弹窗,初始化内容
const handleOpen = (row) => {
  source = row; //数据设置
  dialogTableVisible.value = true;
  setData();
};

const setData = () => {
  nextTick(() => {
    reportDataRef.value.setValue(source);
  });
};
// 提交值
const handleSubmit = () => {
  source = reportDataRef.value.getValue() || [];
  emit("handleConfirm", source);
  handleClose();
};

defineExpose({
  handleOpen,
});

</script>

<style scoped lang="scss">
.radio_box {
  padding: 6px;
}

.content {
  height: 60vh;
  display: flex;
  flex-direction: column;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
