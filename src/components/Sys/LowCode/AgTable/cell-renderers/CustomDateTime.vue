<template>
  <el-date-picker
    @change="onChange"
    v-model="selectedValue"
    class="customerDate_datetime"
    type="datetime"
    placeholder=""
    format="YYYY/MM/DD HH:mm:ss"
    value-format="YYYY/MM/DD HH:mm:ss"
  />
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["handleCellSelect"]);

const selectedValue = ref(props.params.value);

const options = ref(props.params.options || []);

watch(
  () => props.params.value,
  (newValue) => {
    selectedValue.value = newValue;
  }
);
// props.params本身为绑定的双向数据，可直接更新数据的字段key值就ok了
const onChange = (value) => {
  const { data, colDef } = props.params;
  data[colDef.field] = value;
  emit("handleCellSelect", value, data);
};

// 实现 getValue 方法，返回编辑后的值
const getValue = () => {
  return selectedValue.value;
};
</script>

<style lang='scss'>
.customerDate_datetime {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
}
</style>
