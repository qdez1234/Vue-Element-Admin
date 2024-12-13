<template>
    <el-dialog v-model="dialogVisible" custom-class="exdialogModel" title="操作" :width="outerElement.width || '80%'"
        draggable :close-on-click-modal="outerElement.close">
        <div class="content" :style="`height:${outerElement.height || 'auto'}`">
            <ex-form :outerElement="outerElement" ref="exFormRef" :PageDisabled="PageDisabled" :outerData="form"
                v-if="dialogVisible"></ex-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="HandleClose">取消</el-button>
                <el-button type="primary" @click="HandleConfirm" v-if="!PageDisabled">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
import { $action } from "../action/index.js"
export default {
    props: {
        outerElement: {
            type: Object,
            default: () => ({})
        },
    },
    data() {
        return {
            dialogVisible: false,
            form: {},
            businessModelCode: "",
            PageDisabled: false
        }
    },
    mounted() {
        this.businessModelCode = $action.getBusinessModelCode()
    },
    methods: {
        /**
         * 弹窗开启
         */
        async HandleOpen(params = {}, disabled = false) {
            this.form = {}
            this.PageDisabled = disabled
            this.dialogVisible = true
            let { id } = params
            if (id) {
                const res = await $action.HandleGet(params)
                this.form = res.data
            } else {
                this.form = {}
            }
        },
        /**
         * 弹窗关闭
         */
        HandleClose() {
            this.dialogVisible = false
        },
        /**
         * 弹窗确认提交,新增or修改
         */
        async HandleConfirm() {
            if (await this.$refs.exFormRef.HandleValidate()) {
                let params = this.$refs.exFormRef.HandleGetData()
                if (params.id) {
                    const res = await $action.HandleChange(params, this.$parent.$refs.gridRef[0].HandleLoadData)
                    if (res.code == 200) {
                        this.HandleClose()
                    }
                } else {
                    const res = await $action.HandleAdd(params, this.$parent.$refs.gridRef[0].HandleLoadData)
                    if (res.code == 200) {
                        this.HandleClose()
                    }
                }
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.content {
    padding: 15px 10px;
}
</style>
<style lang="scss">
.exdialogModel {
    .el-dialog__body {
        overflow-x:hidden ;
        overflow-y: auto;
    }
}
</style>