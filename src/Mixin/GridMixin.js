// GridMixin.js
import { ref, nextTick } from "vue";
import { getDataBaseCode } from "@/api/system/config";
import request from "@/utils/request";
import { BtnConfig } from "@/utils/config.js"
import $config from "@/plugins/config.js"
import useTagsViewStore from '@/store/modules/tagsView'
export const GridMixin = {
  props: {},
  data() {
    return {
      GridShowSearch: true,
      GridColDefs: [],
      GridRenderBtnConfig: [],
      getActionList: [],
      GridActionList: [],
      GrildQueryParams: {},
      GrildUrl: null,
      GrildMenuUrl: null,
      GrildSearchOptions: [],
      GridQiuckOptions: [],
      GridFormOptions: [],
      GridImKeyParams: {},
      mainKey: {},
      dialogEditAble:true
    };
  },
  methods: {
    GridGetList() {
      nextTick(() => {
        this.$refs.gridRef?.gridLoadData();
      });
    },
    /**
     * 获取ag-grid配置表头数据
     */
    async getConfig() {
      let res = await getDataBaseCode(this.businessModelCode)
      let configData = res.data.sysBusinessModelDetailList.find((ele) => ele.entityType == 'master')?.sysGrid
      const source = JSON.parse(configData.source || '');
      const { isBatchDel, data } = configData   //是否开启多选
      this.getActionList = $config._filterAndSortListData(source.listData, 'isShow');

      this.mainKey = $config._extractFieldData(data, 'isPk')[0]   //主键

      const colDefsList = data.filter(ele => ele.isShow).map(ele => $config._getColDefParams(ele));

      colDefsList.unshift($config._getIndexColumn());

      if (isBatchDel) colDefsList.unshift($config._getCheckColumn());

      colDefsList.push($config._getActionColumn($config._getButtonConfigs(this.getActionList)));

      this.GridColDefs = colDefsList

      this.GridRenderBtnConfig = $config._getRenderBtnConfig(this.getActionList)

      this.GridActionList = this.getActionList

      this.GrildUrl = source.listAPI

      this.GrildMenuUrl = source.menuUrl;

      this.GrildSearchOptions = $config._sortOptions(data, 'isSearch', 'sequence')
      
      this.GridFormOptions = $config._sortOptions(data, 'isForm', 'sequence')

      this.GridQiuckOptions = $config._sortOptions(data, 'isQuickSearch', 'sequence')

      this.GridImKeyParams = this.mainKey || {}

      this.GridGetList();
    },
    /**
     * list页面操作列点击
     * @param {*} fun  
     * @param {*} params 
     * @returns 
     */
    async GridHandleCellClick(fun, params) {
      const detailActions = [1, 3, 4];
      const btnActions = [2, 5, 6, 7, 8, 11];
      const listAction = [15, 16, 17, 18, 19]

      const dialogAction = [10, 12, 14]

      if (detailActions.includes(fun)) {
        this.getHandleToDetail(fun, params.data); // 查看详情
        return
      } else if (btnActions.includes(fun)) {
        await this.getBtnAction(fun, params.data); // 按钮操作
      } else if (fun === 9) {
        this.getHandleExport(fun, this.GrildQueryParams); // 导出
      } else if (listAction.includes(fun)) {
        await this.handleListClick(fun)
      } else if (dialogAction.includes(fun)) {
        await this.handleDialogClick(fun, params.data)
        return
      }
      this.GridGetList()
    },
    /**  dialog操作数据 */
    async handleDialogClick(fun, data) {
      this.dialogEditAble=true
      if (fun == '14'){
        this.dialogEditAble=false
      }
      this.handleEditAPI(fun,data)
    },
    /** dialog弹窗修改数据 */
    handleEditAPI(fun,data) {
      this.$refs.changeRef.handleOpen({ fun, params: data })
    },
    // dialog弹窗点击确认过程
    async GridHandleChange(fun, params) {
      await this.getBtnActionAsync(fun, params, false);
      this.GridGetList()
    },
    /** 批量操作数据 */
    async handleListClick(fun) {
      return new Promise((resolve, reject) => {
        let selectRows = this.$refs.gridRef.getSelectRows()
        if (selectRows.length == 0) return reject
        const { config, paramsList, method } = $config.getActionConfigAndParamsList(this.getActionList, fun, selectRows);
        let params = { [this.mainKey + 's']: [] }
        params[[this.mainKey + 's']] = paramsList.map((ele) => {
          if (Object.hasOwn(ele, this.mainKey)) return ele[this.mainKey]
        })
        const txt = BtnConfig.find(ele => ele.value === fun).label;
        this.$modal
          .confirm(`是否确认${txt}`)
          .then(() => {
            this._handleRequest(config.url, method, params, txt, resolve, reject);
          })
          .catch(reject);
      });
    },
    /** 单条数据操作,有弹窗提示*/
    getBtnAction(fun, row, flag = true) {
      return new Promise((resolve, reject) => {
        const { config, params, method } = $config.getActionConfigAndParams(this.getActionList, fun, row, flag);
        const txt = BtnConfig.find(ele => ele.value === fun).label;
        if (Object.hasOwn(params, this.mainKey)) params[this.mainKey + 's'] = [params[this.mainKey]]
        this.$modal
          .confirm(`是否确认${txt}`)
          .then(() => {
            this._handleRequest(config.url, method, params, txt, resolve, reject);
          })
          .catch(reject);
      });
    },
    /** 单条数据操作,无弹窗提示*/
    getBtnActionAsync(fun, row, flag = true) {
      return new Promise((resolve, reject) => {
        const { config, params, method } = $config.getActionConfigAndParams(this.getActionList, fun, row, flag);
        const txt = BtnConfig.find(ele => ele.value === fun).label;
        if (Object.hasOwn(params, this.mainKey)) params[this.mainKey + 's'] = params[this.mainKey]
        this._handleRequest(config.url, method, params, txt, resolve, reject);
      });
    },
    /**
     * 处理请求
     * @param {*} url 
     * @param {*} method 
     * @param {*} params 
     * @param {*} actionLabel 
     * @param {*} resolve 
     * @param {*} reject 
     */
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
    /**
     * 跳转详情页面
     * @param {*} fun 
     * @param {*} row 
     */
    getHandleToDetail(fun, row) {
      const path = '/' + this.GrildMenuUrl.replace('/index', '');

      const visitedViews = useTagsViewStore().visitedViews;

      let targetView = visitedViews.some(ele => ((ele.path == path && (ele.query.status == 1 || ele.query.status == 3))))

      const { config, params } = $config.getActionConfigAndParams(this.getActionList, fun, row);

      if (targetView) {
        this.$modal
          .confirm(`该页面已经被打开，处于新增或修改状态，是否覆盖`)
          .then(() => {
            this.$router.push({ path: path, query: { ...params, status: fun, businessModelCode: this.businessModelCode } });
          })
      } else {
        this.$router.push({ path: path, query: { ...params, status: fun, businessModelCode: this.businessModelCode } });
      }
    },
    GridHandleSetting() {
      this.$router.push({ path: "/system/render/config", query: { businessModelCode: this.businessModelCode, name: this.$route.meta.title } });
    },
    GridHandleToolPanel() {
      this.$refs.gridRef?.toggleColumnToolPanel();
    },
    /**
     * 导出按钮操作
     * @param {*} fun 
     * @param {*} row 
     */
    getHandleExport(fun, row) {
      const { config } = $config.getActionConfigAndParams(this.getActionList, fun, row);
      this.download(
        config.url,
        {
          ...row,
        },
        `company_${new Date().getTime()}.xlsx`
      );
    },
    /**
     * 模型code获取表名读取配置
     */
    async init() {
      this.businessModelCode = this.$route.meta.businessModelCode
      this.getConfig()
    }
  },
  mounted() {
    this.init();
  }
};
