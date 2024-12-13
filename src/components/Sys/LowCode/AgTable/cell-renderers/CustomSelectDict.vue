<template>
    <el-select v-model="selectedValue" filterable @change="onChange" class="select-cell" style="height: 100%;">
        <el-option v-for="(option, index) in options" :key="index" :label="option.label" :value="option.value" />
    </el-select>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const { proxy } = getCurrentInstance();

const props = defineProps({
    params: {
        type: Object,
        required: true
    }
});
const dict_key = props.params.dict_key

const options = ref([])

onMounted(async () => {
    options.value = await proxy.getDictValue(dict_key)
})

const selectedValue = ref(props.params.value);

watch(() => props.params.value, (newValue) => {
    selectedValue.value = newValue;
});

// props.params本身为绑定的双向数据，可直接更新数据的字段key值就ok了
const onChange = (value) => {
    const { data, colDef } = props.params;
    data[colDef.field] = value;
    props.params.context.componentParent.handleCellSelect(colDef.field, data);
};
// 必须实现 getValue 方法，用于AGGrid获取返回编辑后的值
const getValue = () => {
    return selectedValue.value;
};
</script>

<style scoped>
.select-cell {
    width: 100%;
    box-sizing: border-box;
}
</style>