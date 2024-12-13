<template>
  <el-dialog
    v-model="dialogTableVisible"
    :before-close="handleClose"
    title="数据来源配置"
    width="80%"
    draggable
  >
    <div class="type-box">
      <el-radio-group v-model="sourceType" @change="setData" class="radio_box">
        <el-radio-button :label="1">字典</el-radio-button>
        <el-radio-button :label="2">数据导入</el-radio-button>
        <el-radio-button :label="3">枚举</el-radio-button>
      </el-radio-group>
      <div class=""></div>
    </div>

    <div class="content">
      <dictionary v-if="sourceType == 1" ref="dictionaryRef" />
      <reportData v-if="sourceType == 2" ref="reportDataRef" />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="left"><el-button @click="handleDelete">删除数据</el-button></div>
        <div class="right">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script  setup>
import { nextTick } from "vue";
import dictionary from "./dictionary.vue";

import reportData from "./reportData.vue";

const { proxy } = getCurrentInstance();

const emit = defineEmits(["handleSubmit"]);

const dictionaryRef = ref(null);

const reportDataRef = ref(null);

const props = defineProps({});

const gridRef = ref(null);

let sourceType = ref(1);

let grildUrl = ref(null);

let dialogTableVisible = ref(false);

// 数据值
let source = {
  sourceType: null,
  sourceData: null,
};

const handleClose = () => {
  dialogTableVisible.value = false;
};

// 开启弹窗,初始化内容
const handleOpen = (row) => {
  source = row || {}; //数据设置
  sourceType.value = source?.sourceType || 1;
  dialogTableVisible.value = true;
  setData();
};

const setData = () => {
  if (sourceType.value == 1) {
    nextTick(() => {
      dictionaryRef.value.setValue(source?.sourceData);
    });
  }
  if (sourceType.value == 2) {
    nextTick(() => {
      reportDataRef.value.setValue(source?.sourceData);
    });
  }
};
// 提交值
const handleSubmit = () => {
  source.sourceType = sourceType.value;
  if (sourceType.value == 1) {
    let row = dictionaryRef.value.getValue();
    if (!row || row.length == 0) {
      proxy.$modal.msgWarning("请选择字典");
      return;
    }
    source.sourceData = row[0].dictType;
  }
  if (sourceType.value == 2) {
    source.sourceData = reportDataRef.value.getValue() || [];
  }

  emit("handleConfirm", source);

  handleClose();
};
// 删除数据
const handleDelete =()=>{
   emit("handleConfirm",undefined);
   handleClose();

}
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
.dialog-footer{
  display: flex;
  justify-content: space-between;
}
</style>

