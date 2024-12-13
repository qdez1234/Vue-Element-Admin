<template>
    <el-checkbox v-model="checked" @change="onChange" :disabled="getDisabled()" class="ag-cus-check" size="large" />
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

const checked = ref(props.params.value == 1 ? true : false);

let { isReadonly } = props.params.colDef

watch(
    () => props.params.value,
    (newValue) => {
        checked.value = newValue == 1 ? true : false;
    }
);
/**
 * 获取编辑状态
 */
const getDisabled = () => {
    return isReadonly || props.params.context.componentParent.HandleGetPageDisabled();
}
// props.params本身为绑定的双向数据，可直接更新数据的字段key值就ok了
const onChange = () => {
    const { data, colDef } = props.params;
    data[colDef.field] = checked.value ? '1' : '0';
};
</script>

<style lang='scss'>
.ag-cus-check {
    .el-checkbox__inner {
        width: 18px !important;
        height: 18px !important;
    }

    .el-checkbox__inner::after {
        border-width: 3px;
        left: 5px !important;
        top: 2px !important;
        ;
    }
}
</style>