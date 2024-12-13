import request from "@/utils/request";
import { getDataBaseCode, getAgConfig } from "@/api/system/config";
import $config from "@/plugins/config.js"
import { BtnConfig } from "@/utils/config.js"

export const GridMixin = {
  data() {
    return {
      formOptions: [],        // 渲染表单显示
      queryParams: {},        // 详情页面数据
      copyParams: {},          //复制按钮的原始数据
      formAPI: null,          // 表单API
      copyOptions: [],         //表单复制字段
      getActionList: [],        //操作按钮数据
      renderBtnConfig: [],    // 按钮列数据
      active: 0,              // 当前激活的表单
      tableList: [],          // 表单列表
      tableName: null,        // 表单名称
      editable: true,
      hasDetail: false,        //明细是否存在数据
      mainKey:"",
      fullPath:"",   //页面完整路径
      path:""   //页面完整路径
    };
  },
  created() {
    this.title = this.$route.meta.title
    this.businessModelCode = this.$route.query.businessModelCode
    this.fullPath = this.$route.fullPath
    this.path = this.$route.path
    this.init();
  },
  watch:{
    '$route': {
      handler(to, from) {
        if(to.path == this.path){
          to.fullPath !=this.fullPath ? this.$tab.refreshPage() :''
        }
      }
    },
  },
  methods: {
    /** 表单页面操作列点击 */
    async getFormHandleCellClick(fun, params) {
      const btnActions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      if (btnActions.includes(fun)) {
        await this.getBtnAction(fun, params); // 按钮操作
        this._getFormRefesh(fun)
      }
    },
    /**表单操作刷新页面*/
    _getFormRefesh(fun) {
      if (fun == 2 || fun === 1) {
        this.$tab.closePage()
      }
      else {
        this.getList()
      }
    },
    // 处理请求
    _handleRequest(url, method, params, actionLabel, resolve, reject) {
      request({ url, method, data: params })
        .then((res) => {
          this.$modal.msgSuccess(`${actionLabel}成功`);
          resolve();
        })
        .catch((error) => {
          this.$modal.msgError(`${actionLabel}失败`);
          reject(error);
        });
    },
    /**按钮操作，有弹窗提示*/
    getBtnAction(fun, row) {
      return new Promise((resolve, reject) => {
        const { config, params, method } = $config.getActionConfigAndParams(this.getActionList, fun, row, false);
        const txt = BtnConfig.find(ele => ele.value === fun).label;
        this.$modal
          .confirm(`是否确认${txt}`)
          .then(() => {
            this._handleRequest(config.url, method, params, txt, resolve, reject);
          })
          .catch(reject);
      });
    },
    /**按钮操作，无弹窗提示*/
    getBtnActionAsync(fun, row) {
      return new Promise((resolve, reject) => {
        const { config, params, method } = $config.getActionConfigAndParams(this.getActionList, fun, row, false);
        const txt = BtnConfig.find(ele => ele.value === fun).label;
        this._handleRequest(config.url, method, params, txt, resolve, reject);
      });
    },
    /**
     * 复制用户数据
     */
    getCopyData() {
      let result = $config._exCopyData(this.copyOptions, this.copyParams)  //主表字段
      for (const ele of this.tableList) {           //明细表字段
        let dom = this.$refs[('table' + ele.tableId)][0]
        result[ele.propName] = dom.getCopyData()
      }
      localStorage.setItem('copyData', JSON.stringify(result));
      const obj = { path: this.$route.path, name: this.$route.name, query: { status: 1, copy: true, businessModelCode: this.$route.query.businessModelCode } };
      this.$tab.refreshPage(obj);
    },
    /**
     * 获取所有数据
     */
    getVaildData(fun) {
      let that = this
      this.$refs.exSearchBoxRef.searchValid().then((Valid) => {
        if (Valid) {
          let childValid = true
          for (const ele of this.tableList) {
            let dom = that.$refs[('table' + ele.tableId)][0]
            that.queryParams[ele.propName] = dom.getData()
            if (!dom.validate()) {
              childValid = false
              return false
            }
          }
          if (!childValid) return
          this.getFormHandleCellClick(fun, this.queryParams);
        } else {
          this.$message.warning("存在必填项未填")
        }
      });
    },
    /** aggrid操作列点击 */
    handleCellClick(fun) {
      if (fun === 3 || fun === 1) {  // 新增修改,需要进行校验
        this.getVaildData(fun)
      }
      else if (fun === 13) {  //复制数据
        this.getCopyData()
      }
      else {
        this.getFormHandleCellClick(fun, this.queryParams);
      }
    },
    /** 初始化操作 */
    async init() {
      await this.initDetailForm();
      if (this.$route.query.status != 1) {
        this.getList();
      } else {
        if (this.$route.query.copy) {  //copy 为 true代表复制数据源
          this.queryParams = JSON.parse(localStorage.getItem('copyData'))
          this.handleRowDataChange()
        } else {  //代表新增数据,取默认值
          this.formOptions.map(ele => {
            if (ele.defaultValue && ele.defaultValue != "") this.queryParams[ele.field] = ele.defaultValue
          })
        }
      }
    },
    /** 初始化明细表单 */
    async initDetailForm() {
      let res = await getDataBaseCode(this.businessModelCode)

      let formOptionsData = res.data.sysBusinessModelDetailList.find((ele) => ele.entityType == 'master').sysGrid

      let detailOptionsData = res.data.sysBusinessModelDetailList.filter((ele) => ele.entityType != 'master')

      this.tableList = detailOptionsData.map(ele => {
        return { name: ele.name, propName: ele.propName, tableId: ele.sysGrid.gridId, data: ele.sysGrid }
      })

      const { data } = formOptionsData   //是否开启多选

      if (this.tableList[0]) this.active = this.tableList[0]?.tableId

      this.tableName = formOptionsData.name;    // 主表名

      const source = JSON.parse(formOptionsData.source);  // API配置

      this.mainKeyParams = $config._extractFieldMainKey(data, this.$route.query)
      this.mainKey = Object.keys(this.mainKeyParams)[0]
      this.getActionList = $config._filterAndSortListData(source.listData, 'isShowForm');

      this.formOptions = $config._sortOptions(data, "isForm", 'formSequence');

      this.formAPI = source.formAPI;

      this.renderBtnConfig = this.getActionList.map(ele => $config.getButtonConfig(ele));

      this.copyOptions = $config._extractFieldData(data, "isCopy")

    },
    /** aggrid初始化获取数据 */
    getList() {
      request({
        url: this.formAPI,
        method: 'get',
        params: this.$route.query,
      }).then((res) => {
        this.queryParams = res.data;
        this.copyParams = { ...res.data };
        this.editable = res.editable  //编辑权限
        this.handleRowDataChange()
      });
    },
    /**
     * 监听明细表的数据变化
     */
    handleRowDataChange() {
      let that = this
      let flag = false
      setTimeout(() => {
        for (const ele of that.tableList) {
          let dom = that.$refs[('table' + ele.tableId)][0]
          dom.getData().length > 0 ? flag = true : ''
        }
        that.hasDetail = flag
      }, 300)
    },
  },
};
