import app from "../main";
import request from "@/utils/request";
import { BtnConfig } from "@/utils/config.js"
/**
 * 根据过滤条件过滤并且排序
 * @param {*} data 
 * @param {*} filterKey 
 * @param {*} sequence 
 */
export function _sortOptions(data, filterKey, sequence) {
    const filterList = data
        .filter(ele => ele[filterKey])
        .map(ele => ({
            ...ele,
            [sequence]: ele[sequence] || 100000
        }))
        .sort((a, b) => a[sequence] - b[sequence]);
    return filterList
}
/**
 * 通过配置获取制定按钮
 * @param {*} data 
 * @param {*} filterKeybuyao 
 * @param {*} sequence 
 * @returns 
 */
export function getButtonConfig(row) {
    const actionMap = {
        1: { label: "新增", type: "primary", aliasLabel: "保存" },
        2: { label: "删除", type: "danger" },
        3: { label: "修改", type: "warning", aliasLabel: "保存" },
        4: { label: "查看", type: "primary" },
        5: { label: "停用", type: "danger" },
        6: { label: "启用", type: "success" },
        7: { label: "审核", type: "success" },
        8: { label: "反审核", type: "danger" },
        9: { label: "导出", type: "primary" },
        10: { label: "新增", type: "primary" },
        11: { label: "删除", type: "danger" },
        12: { label: "修改", type: "warning" },
        13: { label: "复制", type: "success" },
        14: { label: "查看", type: "primary" },
        15: { label: "批量删除", type: "danger" },
        16: { label: "批量停用", type: "danger" },
        17: { label: "批量启用", type: "success" },
        18: { label: "批量审核", type: "success" },
        19: { label: "批量反审核", type: "danger" },

    };
    const config = actionMap[row.fun];
    if (!config) return null;
    return {
        ...config,
        fun: row.fun,
        show: app.config.globalProperties.$auth.hasPermi(row.perms)
    };
}
/**
 * 获取按钮配置列表
 * @param {*} getActionList 
 * @returns 
 */
export function _getButtonConfigs(getActionList) {
    return getActionList
        .filter(ele => [2, 3, 4, 5, 6, 7, 8, 11, 12, 14].includes(ele.fun))
        .map(ele => getButtonConfig(ele))
        .filter(config => config);
}
/**
 * 获取单元格渲染器参数
 * @param {*} ele 
 * @returns 
 */
export function getCellRendererParams(ele) {
    if (ele.source) {
        const source = JSON.parse(ele.source);
        if (source.sourceType === 1) {  // 字典
            return { dict_key: source.sourceData };
        }
        if (source.sourceType === 2) {  // 字典
            return { source: source.sourceData };
        }
    }
    return null;
}
/**
 * 获取单元格渲染器
 * @param {*} ele 
 * @returns 
 */
export function getCellRenderer(ele) {
    if (!ele.source) {
        return null;
    }
    const source = JSON.parse(ele.source);
    return source.sourceType === 1 ? 'CustomDict' : source.sourceType === 2 ? 'CustomDialogReport' : null;
}
// 自定义方法: 获取单元格编辑器
export function getCellEditor(ele) {
    if (ele.source && JSON.parse(ele.source).sourceType === 1) return 'CustomSelectDict'
    switch (ele.javaType) {
        case "Long":
        case "Integer":
        case "Double":
        case "BigDecimal":
            return "agNumberCellEditor";
        case "Boolean":
            return "agCheckboxCellEditor";
        case "Date":
            return ele.isReadonly ? "agTextCellEditor" : "CustomDateTime";
        case "String":
            return "agTextCellEditor";
        default:
            return null;
    }
}
/**
 * 操作列
 * @param {*} buttonConfig 
 * @returns 
 */
export function _getActionColumn(buttonConfig) {
    return {
        headerName: "操作",
        pinned: "right",
        filter: false, // 隐藏过滤条件
        suppressMenu: true, // 隐藏菜单
        cellRendererParams: { buttonConfig },
        cellRenderer: 'ActionButtons',
        width: 300
    };
}
/**
 * 获取操作列序号
 * @param {*} buttonConfig 
 * @returns 
 */
export function _getCheckColumn(buttonConfig) {
    return {
        headerCheckboxSelection: true,  // 在表头显示多选框
        isReadonly: true,
        checkboxSelection: true,        // 行前显示多选框
        width: 50,
        filter: false, // 隐藏过滤条件
        suppressMenu: true, // 隐藏菜单
        minWidth: 70
    };
}
/**
 * 获取操作列序号
 * @param {*} buttonConfig 
 * @returns 
 */
export function _getIndexColumn(buttonConfig) {
    return {
        headerName: "序号",
        isReadonly: true,
        valueGetter: (params) => params.node.rowIndex + 1,
        filter: false, // 隐藏过滤条件
        suppressMenu: true, // 隐藏菜单
        minWidth: 70
    };
}
/**
 * 获取list按钮操作,渲染操作列的按钮
 * @param {*} buttonConfig 
 * @returns 
 */
export function _getRenderBtnConfig(getActionList) {
    return getActionList
        .filter(ele => [1, 9, 10, 15, 16, 17, 18, 19].includes(ele.fun))
        .map(ele => getButtonConfig(ele))
        .filter(config => config);
}
/**
 * 获取list按钮操作,渲染所有按钮
 * @param {*} buttonConfig 
 * @returns 
 */
export function _getRenderAllBtnConfig(getActionList) {
    return getActionList.map(ele => getButtonConfig(ele))
        .filter(config => config);
}
/**
 * 获取列定义参数
 * @param {*} ele 
 * @returns 
 */
export function _getColDefParams(ele, rule = false) {
    return {
        headerName: ele.customName || ele.defaultName,
        field: ele.field,
        headerClass: (ele.isEmpty) && rule ? 'agRequire' : '',
        tooltipField: ele.field,
        cellClassRules: {
            'ag-cell-error': params => (!params.value || params.value === "") && ele.isEmpty // 如果单元格值为空，设置红色样式
        },
        defaultValue: ele.defaultValue,
        isReadonly: ele.isReadonly,
        editable: ele.isReadonly ? false : rule,
        require: ele.isEmpty,
        cellEditor: getCellEditor(ele),
        cellEditorParams: getCellRendererParams(ele),
        cellRenderer: getCellRenderer(ele),
        cellRendererParams: getCellRendererParams(ele)
    };
}
/**
 * 提取过滤之后的字段的field字段
 * @param {*} data 
 * @param {*} filterKey 
 * @returns 
 */
export function _extractFieldData(data, filterKey) {
    return data.filter(ele => ele[filterKey]).map(ele => ele.field);
}
/**
 * 提取过滤之后的字段的field字段
 * @param {*} data 
 * @param {*} filterKey 
 * @returns 
 */
export function _extractData(data, filterKey) {
    return data.filter(ele => ele[filterKey])
}
/**
 * 过滤并排序列表数据
 * @param {*} listData  
 * @param {*} key 
 * @returns 
 */
export function _filterAndSortListData(listData, key) {
    return listData.filter(ele => ele[key] && ele.fun).sort((a, b) => a.sequence - b.sequence);
}
/**
 * 通过主键获取route的query的对应参数,拼接成页面参数
 * @param {*} data 
 * @returns 
 */
export function _extractFieldMainKey(data, query) {
    return _extractFieldData(data, 'isPk').reduce((acc, field) => {
        query[field] ? acc[field] = query[field] : '';
        return acc;
    }, {});
}
/**
 * 
 * @param 要复制的字段 list 
 * @param 数据源 data 
 */
export function _exCopyData(list, data) {
    return list.reduce((acc, field) => {
        acc[field] = data[field]
        return acc;
    }, {});
}
/**
 *  按钮单条参数解析   flag 代表新增或者修改返回解析后的参数,要是false就代表整条数据
 * @param {*} fun 
 * @param {*} row 
 * @param {*} flag
 * @returns
 */
export function getActionConfigAndParams(getActionList, fun, row, flag = true) {
    const config = getActionList.find(ele => ele.fun === fun);
    const method = [2, 11].includes(fun) ? 'delete' :
        [1, 10].includes(fun) ? 'post' :
            [3, 12].includes(fun) || [5, 6, 7, 8].includes(fun) ? 'put' :
                'get';
    let params
    if (!flag && [1, 10, 3, 12].includes(fun)) {  //新增，修改全部值
        params = row
    } else {
        const fields = (config.field || "").split(",").filter(Boolean);  // 缓存并过滤空字段
        params = fields.reduce((acc, field) => {
            if (field) acc[field] = row[field];
            return acc;
        }, {});
    }
    return { config, params, method };
}
/**
 *  按钮多条参数解析   flag 代表新增或者修改返回解析后的参数,要是false就代表整条数据
 * @param {*} fun 
 * @param {*} row 
 * @param {*} flag 
 * @returns 
 */
export function getActionConfigAndParamsList(getActionList, fun, rows) {
    const config = getActionList.find(ele => ele.fun === fun);
    const method = [15].includes(fun) ? 'delete' :
        [16, 17, 18, 19].includes(fun) ? 'put' : 'get';
    let paramsList
    const fields = (config.field || "").split(",").filter(Boolean);  // 缓存并过滤空字段
    paramsList = rows.map(ele =>
        fields.reduce((acc, field) => {
            acc[field] = ele[field];  // 直接赋值字段
            return acc;
        }, {})
    );
    return { config, paramsList, method };
}
let $config = {
    _sortOptions,
    getButtonConfig,
    _getButtonConfigs,
    getCellRendererParams,
    getCellRenderer,
    getCellEditor,
    _getActionColumn,
    _getCheckColumn,
    _getIndexColumn,
    _getRenderBtnConfig,
    _getRenderAllBtnConfig,
    _getColDefParams,
    _extractFieldData,
    _extractData,
    _filterAndSortListData,
    _extractFieldMainKey,
    _exCopyData,
    getActionConfigAndParams,
    getActionConfigAndParamsList
}
export default $config