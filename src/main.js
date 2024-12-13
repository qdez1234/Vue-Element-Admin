import { createApp } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'

import locale from 'element-plus/es/locale/lang/zh-cn' // 中文语言

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import '@/assets/styles/index.scss' // global css

import 'element-plus/theme-chalk/index.css'

import "@/assets/styles/ex-ui.scss"

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

import CaiLeUI from 'caileui'    //彩乐

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

// 字典组件
import MenuTree from '@/components/sys/menuTree/index.vue'
import ExSearchBox from '@/components/sys/exSearch/ex_search_box.vue'
import ExActionBox from '@/components/sys/exAction/ex_action_box.vue'
import ExMainBox from '@/components/sys/exMain/index.vue'
import ExDetailBox from '@/components/sys/exDetail/index.vue'
import EXTableDetail from '@/components/sys/exTableDetail/index.vue'

// 低代码组件start
import ExInput from '@/components/sys/LowCode//ExInput/index.vue'
import ExDate from '@/components/sys/LowCode//ExDate/index.vue'
import ExDateRange from '@/components/sys/LowCode//ExDateRange/index.vue'
import ExButton from '@/components/sys/LowCode/ExButton/index.vue'
import DictValueSelect from '@/components/sys/LowCode/exDictSelect/index.vue'
import ExReport from '@/components/sys/LowCode/ExReport/index.vue'
import ExRender from '@/components/sys/LowCode/ExRender/index.vue'
import ExFrom from '@/components/sys/LowCode/ExRender/form.vue'
import ExTabs from '@/components/sys/LowCode/ExRender/tabs.vue'
import ExDialog from '@/components/sys/LowCode/ExDialog/index.vue'
import Exfile from '@/components/sys/LowCode/Exfile/index.vue'
import ExImg from '@/components/sys/LowCode/ExImg/index.vue'
import ExTree from '@/components/sys/LowCode/ExTree/index.vue'
import ExTreeSelect from '@/components/sys/LowCode/ExTreeSelect/index.vue'

import ExReportDialog from '@/components/sys/exReportDialog'
import ExReportSelect from '@/components/sys/exReportSelect'
import ExChange from '@/components/sys/exChange'

import { useI18n } from 'vue-i18n';

import i18n from './i18n'; // 引入 i18n 配置

import './permission' // permission control

import { useDict,getDictValue } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels,getInitTableHeight } from '@/utils/ruoyi'

// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 自定义表格工具组件
import AgTable from '@/components/sys/LowCode/AgTable'
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 自定义树选择组件
import TreeSelect from '@/components/TreeSelect'
// 字典标签组件
import DictTag from '@/components/DictTag'

const app = createApp(App)

// 全局方法挂载 
app.config.globalProperties.useDict = useDict
app.config.globalProperties.getDictValue = getDictValue
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
app.config.globalProperties.getInitTableHeight = getInitTableHeight

// 将 i18n 实例挂载到全局属性
app.use(i18n); // 使用 i18n 插件
app.config.globalProperties.$t = i18n.global.t;
app.config.globalProperties.$locale = i18n.global.locale;

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component("AgTable",AgTable)
app.component('Editor', Editor)

app.component('menu-tree',MenuTree)
app.component('ex-search-box',ExSearchBox)
app.component('ex-action-box',ExActionBox)
app.component('ex-main-box',ExMainBox)
app.component("ex-report-dialog-box",ExReportDialog)
app.component("ex-report-select-box",ExReportSelect)
app.component("ex-change-box",ExChange)
app.component('ex-detail-box',ExDetailBox)
app.component('ex-table-detail-box',EXTableDetail)

app.component('ex-dictSelect',DictValueSelect)
app.component('ex-input',ExInput)
app.component('ex-date',ExDate)
app.component('ex-dateRange',ExDateRange)
app.component('ex-dateRange',ExDateRange)
app.component('ex-button',ExButton)
app.component('ex-report',ExReport)
app.component('ex-render',ExRender)
app.component('ex-form',ExFrom)
app.component('ex-tabs',ExTabs)
app.component('ex-dialog',ExDialog)
app.component('ex-file',Exfile)
app.component('ex-img',ExImg)
app.component('ex-tree',ExTree)
app.component('ex-tree-select',ExTreeSelect)

app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
CaiLeUI.install(app)
app.component('svg-icon', SvgIcon)

directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})

app.config.warnHandler = (msg, vm, trace) => {
  // 自定义警告处理逻辑
};

app.mount('#app')

export default app