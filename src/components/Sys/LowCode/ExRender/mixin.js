// GridMixin.js
import { ref, nextTick, computed } from "vue";
import { getDataBaseName } from "@/api/system/config";
import { processExpressions } from "../config/index"
import request from "@/utils/request";
import { commonDetailAPI, commonChangeAPI, commonAddAPI } from "../config/index.js"
import { $action } from "../action/index.js"
import usePermissionStore from '@/store/modules/permission'
import caseDialog from '../ExDialog/case.vue'
export const GridMixin = {
    props: {},
    data() {
        return {
            pageConfig: [],
            form: {},
            businessModelCode: "",
            fullPath: "",
            isCache: 0,
            PageDisabled: false,
        };
    },
    components:{caseDialog},
    watch: {
        '$route': {
            handler(to, from) {
                if (to.path == this.path && this.isCache == 1) {
                    to.fullPath != this.fullPath ? this.$tab.refreshPage() : ''
                }
            }
        }
    },
    async created() {
        this.businessModelCode = $action.getBusinessModelCode()
        if (this.$route.query.status == 2 || this.$route.query.status == 3) this.PageDisabled = true
        this.fullPath = this.$route.fullPath
        this.path = this.$route.path
        this.isCache = this.$route.meta.menu?.isCache
        await this.init();
        if(this.$route.query.status==3) this.handleEditChange()
    },
    methods: {
        /**
         * 获取ag-grid配置表头数据
         */
        async init() {
            let list = []
            let res = await getDataBaseName(this.businessModelCode)
            if (this.$route.meta.isMain == '1') {
                list = JSON.parse(res.data.source)?.main || []
            } else {
                list = JSON.parse(res.data.source).detail
            }
            this.pageConfig = processExpressions(list)
            this.HandleGetDataAPI()
        },
        GridHandleSetting() {
            this.$router.push({ path: "/system/render/config", query: { businessModelCode: this.businessModelCode, name: this.$route.meta.title } });
        },
        /**
         * 开启页面编辑状态
         */
        handleEditChange() {
            this.PageDisabled = !this.PageDisabled
        },
        /**
         * 根据api获取数据来源
         * @param id 
         */
        async HandleGetDataAPI() {
            let { id } = this.$route.query
            if (this.$route.query.copy == 1) {
                this.form = usePermissionStore().catchCopyData
                return
            }
            if (!id) return
            let url = commonDetailAPI + this.businessModelCode
            await request({
                url: url,
                method: 'post',
                data: { id },
            }).then((res) => {
                this.form = res.data
            });
        },
        /**
         * 保存页面复制字段
         */
        HandleCopy() {
            let data = {}
            this.$refs.exFormRef.forEach(ele => {
                data = Object.assign(data, ele.HandleGetCopyData())
            })
            this.$refs.tabs.forEach(ele => {
                data = Object.assign(data, ele.HandleGetCopyData())
            })
            usePermissionStore().setCatchCopyData(data);
            this.$route.query.id = undefined
            this.$route.query.status = 1
            this.$route.query.copy = 1
            this.$tab.refreshPage()
        },
        /**
         * 数据保存  
         */
        async HandleSave() {
            let tabsData = this.$refs.tabs[0].HandleGetData()
            let data = Object.assign(this.form, tabsData)
            if (data.id) {
                const res = await $action.HandleChange(data, this.init)
                if (res.code == 200) this.handleEditChange()
            } else {
                const res = await $action.HandleAdd(data, this.$tab.closePage)
            }
        },
        /**
         * 数据导出  
         */
        async HandleReport() {
            let data = {}
            this.$refs.exFormRef.forEach(ele => {
                data = Object.assign(data, ele.HandleGetData())
            })
            $action.HandleReport(data)
        },
        /**
         * 执行自定义代码逻辑
         */
        updateMethods(code) {
            eval(code)
        },
    },
};
