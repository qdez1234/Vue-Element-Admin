// GridMixin.js
import $config from "@/plugins/config.js"
import { BtnConfig } from "@/utils/config.js"
import request from "@/utils/request";
export const GridMixin = {
  props: {

    GridTableId: {
      type: String,
      default: ''
    },
    GridTableData: {
      type: Array,
      default: []
    },
    GridOptions: {
      type: Array || Object,
      default: []
    },
    GridLabel: {
      type: String,
      default: ''
    },
    // 是否审核
    isAudited: {
      type: String || Number,
      default: 0
    },
    //是否能编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      GridColDefs: [],
      copyOptions: [],         //表单复制字段
      reportOptions: [],        //数据导入字段
      GridRenderBtnConfig: [],
      GridFormOptions: [],
      getActionList: [],
      sourceData:{},
      dialogVisibilit:false
    };
  },
  watch: {
    // 审核过后不能修改
    isAudited(newVal) {
      if (newVal == 1) {
        this.GridColDefs.forEach((ele) => ele.editable = false)
      } else {
        this.GridColDefs.forEach((ele) => {
          ele.editable = ele.isReadonly ? false : true
        })
      }
      if (this.routeStatus == 4) this.GridColDefs.forEach((ele) => {
        ele.editable = false
      })
    },
    // 没有编辑权限不能编辑
    editable(newVal) {
      if (!newVal) {
        this.GridColDefs.forEach((ele) => ele.editable = false)
      }
    }
  },
  methods: {
    /** 获取ag-grid配置表头数据 */
    async getConfig() {
      const source = JSON.parse(this.GridOptions.source);
      const { data } = this.GridOptions
      this.getActionList = $config._filterAndSortListData(source.listData, 'isShow');
      this.mainKeyParams = $config._extractFieldMainKey(data, this.$route.query)
      const colDefsList = data.filter(ele => ele.isShow).map(ele => $config._getColDefParams(ele, true));
      colDefsList.unshift($config._getIndexColumn());
      colDefsList.unshift($config._getCheckColumn());
      this.GridColDefs = colDefsList;
      this.GridFormOptions = $config._sortOptions(data, 'isForm', 'sequence')
      this.copyOptions = $config._extractFieldData(data, "isCopy")
      this.reportOptions = $config._extractData(data, "isImportable")
      this.GridRenderBtnConfig = $config._getRenderAllBtnConfig(this.getActionList)
      this.reportOptions.forEach(ele => {
        this.GridRenderBtnConfig.push({ label: `导入${ele.customName || ele.defaultName}`, type: 'primary', fun: `R_${ele.field}`, show: true })
      })
    },
    /** 按钮操作，有弹窗提示 */
    getBtnAction(fun, row, flag = true) {
      return new Promise((resolve, reject) => {
        const { config, params, method } = $config.getActionConfigAndParams(this.getActionList, fun, row, flag);
        const txt = BtnConfig.find(ele => ele.value === fun).label;
        this.$modal
          .confirm(`是否确认${txt}`)
          .then(() => {
            this._handleRequest(config.url, method, params, txt, resolve, reject);
          })
          .catch(reject);
      });
    },
    /** 按钮操作，无弹窗提示 */
    getBtnActionAsync(fun, row, flag = true) {
      return new Promise((resolve, reject) => {
        const { config, params, method } = $config.getActionConfigAndParams(this.getActionList, fun, row, flag);
        const txt = BtnConfig.find(ele => ele.value === fun).label;
        this._handleRequest(config.url, method, params, txt, resolve, reject);
      });
    },
    /** 处理请求 */
    _handleRequest(url, method, params, actionLabel, resolve, reject) {
      request({ url, method, data: params })
        .then((res) => {
          this.saveData = res.data;
          this.$modal.msgSuccess(`${actionLabel}成功`);
          resolve();
        })
        .catch((error) => {
          this.$modal.msgError(`${actionLabel}失败`);
          reject(error);
        });
    },
    /** 表单页面操作列点击 */
    async getFormHandleCellClick(fun, params, callback) {
      const btnActions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      if (btnActions.includes(fun)) {
        await this.getBtnAction(fun, params, false); // 按钮操作
        this._getFormRefesh(fun, callback)
      }
    },
    /** 表格数据出现新增删除触发 */
    handleRowDataChange() {
      this.$emit('handleRowDataChange')
    },
    handleClick(fun) {
      if (fun == 'A3') this.handleToolPanel()
      if (fun == 'A1') this.handleAddRow()
      if (fun == 'A2') this.handleDeleteRow()
      if (fun == '12') this.handleEditAPI(fun)
      if (fun == '11') this.handleDeleteAPI(fun)
      if (String(fun).startsWith("R_")) this.handleDialogReport(fun.replace(/^R_/, ""))
    },
    /**
     * 弹窗展示
     */
    handleDialogReport(fun) {
      let data = this.reportOptions.filter(ele => ele.field == fun)[0]
      let jsonData = JSON.parse(data.source)
      this.sourceData = jsonData.sourceData
      this.dialogVisibilit = true
      this.$nextTick(ele=>{
        this.$refs.dialogReport.handleOpen()
      })
    },
    /**
     * 数据导入
     */
    handleInsert(rows=[]) {
      this.$refs.gridRef.addRowsData(rows)
    },
    // 用户点击确认过程
    async GridHandleChange(fun, params) {
      await this.getBtnActionAsync(fun, params, false);
      this.$emit("GridRefresh")
    },
    /** aggrid新增一行 */
    handleAddRow() {
      this.$refs.gridRef.addRowAndSelect();
    },
    /** aggrid删除一行 */
    handleDeleteRow() {
      this.$refs.gridRef.deleteSelectedRows();
    },
    /** dialog弹窗修改数据 */
    handleEditAPI(fun) {
      let selectRows = this.$refs.gridRef.getSelectRows()
      if (selectRows.length == 0) {
        this.$message.warning("请勾选修改数据")
        return
      }
      if (selectRows.length > 1) {
        this.$message.warning("只能勾选一条数据修改")
        return
      }
      this.$refs.changeRef.handleOpen({ fun, params: selectRows[0] })
    },
    /** dialog弹窗删除数据 */
    async handleDeleteAPI(fun) {
      let selectRows = this.$refs.gridRef.getSelectRows()
      if (selectRows.length == 0) {
        this.$message.warning("请勾选修改数据")
        return
      }
      if (selectRows.length > 1) {
        this.$message.warning("一次只能删除一条")
        return
      }
      await this.getBtnAction(fun, selectRows[0]);
      this.$emit("GridRefresh")
    },
    handleToolPanel() {
      this.$refs.gridRef?.toggleColumnToolPanel();
    },
    // 获取全部数据
    getData() {
      let list = this.$refs.gridRef.gridGetData()
      return list
    },
    /**
     * 获取copy的原始数据
     */
    getCopyData() {
      let result = this.GridTableData.map(item =>
        Object.fromEntries(this.copyOptions.map(key => [key, item[key]]))
      );
      return result
    },
    // 校验函数
    validate() {
      let jsonData = this.$refs.gridRef.gridGetData()
      let requestMap = this.GridColDefs
      const errors = [];
      // 遍历 jsonData 数据
      jsonData.forEach((item, index) => {
        // 遍历 data 的每个字段定义
        requestMap.forEach(({ require, field, headerName }) => {
          // 如果字段是必填并且在数据中为空或不存在
          if (require && (!item[field] || item[field] === "")) {
            errors.push(`第 ${index + 1} 条数据的 ${headerName} 为必填项`);
          }
        });
      });
      if (errors.length > 0) {
        this.$message.warning(`${this.GridLabel}存在必填项未填`)
        return false
      }
      return true;
    },
  },
  mounted() {
    this.routeStatus = this.$route.query.status;
    this.getConfig()
    this.getCopyData()
  }
};
