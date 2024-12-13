<template>
  <el-select v-model="selectedValue" clearable filterable @change="onChange" class="select-cell" style="height: 100%;">
    <el-option
      v-for="(option,index) in options"
      :key="index"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
const props = defineProps({
  params: {
    type: Object,
    required: true
  }
});

const selectedValue = ref(props.params.value);

const options = ref(props.params.options || []);

watch(() => props.params.value, (newValue) => {
  selectedValue.value = newValue;
});
watch(() => props.params.options, (newValue) => {
  options.value = newValue;
});

// props.params本身为绑定的双向数据，可直接更新数据的字段key值就ok了
const onChange = (value) => {
  const { data, colDef } = props.params;
  data[colDef.field] = value;
  props.params.context.componentParent.HandleCellSelect(colDef.field,data);
};
</script>

<style scoped>
.select-cell {
  width: 100%;
  box-sizing: border-box;
}
</style>
