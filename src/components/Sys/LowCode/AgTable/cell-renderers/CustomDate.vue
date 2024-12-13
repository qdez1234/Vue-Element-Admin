<template>
  <el-date-picker
    @change="onChange"
    v-model="selectedValue"
    class="customerDate_input"
    type="date"
    placeholder="Pick a Date"
    format="YYYY-MM-DD"
    value-format="YYYY-MM-DD"
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
const emit = defineEmits(["HandleCellClick"]);

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
  props.params.context.componentParent.handleCellSelect(colDef.field, data);
};
</script>

<style lang='scss'>
.customerDate_input {
  width: 100% !important;
}
</style>
