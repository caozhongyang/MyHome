<template>
  <div class="" style="position: relative;height: 100%;">
    <el-row>
      <el-col>
        <div class="navBarWrap">
          <!-- 蓝色导航条 -->
          <div class="navBar">
            <a
              class="item"
              v-for='(navItem,idx) in NarBarArry'
              :key='idx'
              :class='navIndex == idx ? "active":""'
              href="javascript:;"
              @click='ChangeChartByNav(idx,$event)'>{{navItem}}</a>
            <el-input placeholder="请输入股票代码" v-model="GlobalSymbol" @keyup.enter.native="ChangeStock(GlobalSymbol)" size="mini" style="width: 15vw;" suffix-icon="el-icon-search">
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="chartDataWrap clearfix" style="background-color: #171e2a;">
          <!-- 左侧图形 -->
          <div class="leftChart el-col-24">
            <div
              id="minuteChartID"
              ref="minuteChartID"
              style="width:90%;height:660px;position: relative;"
              v-show="IsChartShow.MinuteChartShow"></div>
            <div
              id="kLine"
              ref='kLine'
              style="width:90%;height:660px;position: relative;"
              v-show="IsChartShow.KlineChartShow">
            </div>
            <div class="indexList" v-show='BottomIndexShow'>
          <span
            v-for='(item,index) in IndexBottomData.children'
            :key='index'
            :class='{active:BottomIndexForMinute == index}'
            @click='ChangeBottomIndex(item,index)'>{{item}}
          </span>
            </div>
            <div class="indexList" v-show='!BottomIndexShow'>
          <span
            v-for='(item,index) in IndexBottomData.children'
            :key='index'
            :class='{active:BottomIndexForHistory == index}'
            @click='ChangeBottomIndex(item,index)'>{{item}}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import $ from 'jquery'
import HQChart from 'hqchart'

const jsChart = HQChart.Chart
const jsStock = HQChart.Stock
const blackStyle = jsChart.HQChartStyle.GetStyleConfig(jsChart.STYLE_TYPE_ID.BLACK_ID)
blackStyle.FrameTitleBGColor = '#151b26'
jsChart.JSChart.SetStyle(blackStyle)

export default {
  name: 'Hq',
  data() {
    return {
      GlobalSymbol: '300749.sz',
      pageData: null,
      pageDataColor: null,
      bookData: null,
      buyData: [],
      sellData: [],
      detailData: [],
      IndexBottomData: {},
      IndexBottomForHistory: {
        type: 'history',
        children: ['MACD', 'BBI', 'MA', 'HMA', 'LMA', 'VMA', 'BOLL', 'STD', 'KDJ', 'RST', 'OBV', 'BIAS']
      },
      IndexBottomForMinute: {
        type: 'minute',
        children: ['MACD', 'DMI', 'DMA', 'BRAR', 'KDJ', 'RSI', 'WR', 'CCI', 'TRIX']
      },
      IndexInMinute: 999, // 副图指标下标
      IndexActive: 'active',
      MenuOneSelected: false,
      MenuMinuteData: [
        {
          Text: '副图指标',
          ActiveIndex: null,
          Children: ['MACD', 'DMI', 'DMA', 'BRAR', 'KDJ', 'RSI', 'WR', 'CCI', 'TRIX']
        }
      ],
      ExtendChart: null, // 绘制画图工具
      MenuOneIndex: 999, // 一级菜单下标
      MenuOneSelectedIndex: 0, // 一级菜单下标
      NarBarArry: ['分时', '五日', '日线', '周线', '月线', '年线', '1分钟', '5分钟', '15分钟', '30分钟', '60分钟'],
      IsChartShow: {
        MinuteChartShow: true,
        FiveMinuteChartShow: false,
        KlineChartShow: false
      },
      SpellStockShow: { // 股票联想是否显示
        Input: false,
        List: false
      },
      MenuTwoIndex: null, // 二次菜单下标
      currentDirection: 'icon-xia', // 下拉列表的三角
      SearchSymbols: null, // 联想股票数据
      inputSymbolStr: '', // 输入的股票代码
      navIndex: 0, // 导航下标
      BottomIndexForMinute: 0, // 底部指标下标
      BottomIndexForHistory: 0, // 底部指标下标
      BottomIndexShow: true,
      TrueWidth: 1104, // 画布实际宽度
      JSEnvironment: {
        // Symbol: '600000.sh', // 股票代码
        Name: '',
        KLineIndex: [ // K线指标
          { Name: 'KDJ', Index: 'KDJ' },
          { Name: 'MACD', Index: 'MACD' },
          { Name: 'RSI', Index: 'RSI' },
          { Name: 'BOLL', Index: 'BOLL' },
          { Name: 'VOL', Index: 'VOL' },
          { Name: '均线', Index: '均线' }
        ],

        MinuteChart: null, // 走势图
        MinuteOption: null,

        HistoryChart: null, // K线图
        HistoryOption: null,

        WidthPercent: 0.653,

        FiveDMinuteChart: null,
        FiveDMinuteOption: null, // 5日分时图选项

        StockCache: null, // 股票数据
        CurrentNews: 0,
        CurrentInteract: 1,
        CurrentVisited: 2,
        CurrentNotice: 3,
        CurrentFlag: 1,
        JqTableInfo: $('<table class="tableInfo"></table>'),
        JqUlOne: $('<ul class="ulOne"><li class="noRight">不复权</li><li class="noRight active">前复权</li><li class="noRight">后复权</li><ul>'),
        JqUlTwo: $('<ul class="ulTwo"></ul>'),
        GetIndexByName: function(name) {
          for (const i in this.KLineIndex) {
            const item = this.KLineIndex[i]
            if (item.Name === name) return item.Index
          }

          return null
        },

        GetIndexName: function(index) {
          for (const i in this.KLineIndex) {
            const item = this.KLineIndex[i]
            if (item.Index === index) return item.Name
          }

          return null
        }
      }
    }
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function(el) {
        el.focus()
      }
    }
  },
  watch: {
    inputSymbolStr: function(newValue, oldValue) {
      this.SpellStock()
    },
    GlobalSymbol: function(newValue, oldValue) {
      const symbolAry = []
      symbolAry.push(newValue)
      console.log('[watch GlobalSymbol] newValue', newValue)
      this.UpdateMain(null, symbolAry, null, this.JSEnvironment.StockCache)
      this.JSEnvironment.StockCache.ReqeustData()
    }
  },
  methods: {
    getURLParams(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return decodeURI(r[2])
      return null
    },
    ShowSpell() {
      this.SpellStockShow.Input = true
      this.inputSymbolStr = ''
    },
    HideSpell() {
      this.SpellStockShow.Input = false
      this.SpellStockShow.List = false
    },
    ChangeCurrentRight(index) {
      if (this.JSEnvironment.HistoryChart != null) {
        this.JSEnvironment.HistoryChart.ChangeRight(index)
      }
    },
    ChangeCurrentIndex(indexName) { // 切换二级菜单指标
      // 通过classname判断点击了哪个位置的元素
      if (this.JSEnvironment.HistoryChart != null) {
        this.JSEnvironment.HistoryChart.ChangeIndex(1, indexName)
      }
    },
    ChangeBottomIndex(indexName, ind) { // 切换图形底部指标
      if (this.IndexBottomData.type === 'history' && this.JSEnvironment.HistoryChart != null) {
        this.JSEnvironment.HistoryChart.ChangeIndex(1, 'VOL')
        this.JSEnvironment.HistoryChart.ChangeIndex(2, indexName)
        this.BottomIndexForHistory = ind
      } else if (this.IndexBottomData.type === 'minute' && this.JSEnvironment.MinuteChart != null) {
        this.JSEnvironment.MinuteChart.ChangeIndex(1, indexName)
        this.BottomIndexForMinute = ind
      }
    },
    ChangeMainLineType(index) {
      if (this.JSEnvironment.HistoryChart != null) {
        switch (index) {
          case 0:
            this.JSEnvironment.HistoryChart.ChangeKLineDrawType(3)
            break
          case 1:
            this.JSEnvironment.HistoryChart.ChangeKLineDrawType(0)
            break
          case 2:
            this.JSEnvironment.HistoryChart.ChangeKLineDrawType(2)
            break
          case 3:
            this.JSEnvironment.HistoryChart.ChangeKLineDrawType(1)
            break
        }
      }
    },
    ChangeCurrentCoordinateType(index) {
      if (this.JSEnvironment.HistoryChart != null) {
        this.JSEnvironment.HistoryChart.JSChartContainer.ChangeCoordinateType(index)
      }
    },
    ChangeStock(code) {
      this.GlobalSymbol = code
      this.SpellStockShow.Input = false
      this.SpellStockShow.List = false
      if (this.JSEnvironment.MinuteChart != null) {
        this.JSEnvironment.MinuteChart.ChangeSymbol(code)
      }
      if (this.JSEnvironment.HistoryChart != null) {
        this.JSEnvironment.HistoryChart.ChangeSymbol(code)
      }
    },
    ChangeWindowCount(index) {
      if (this.JSEnvironment.HistoryChart != null) {
        this.JSEnvironment.HistoryChart.ChangeIndexWindowCount(index + 1)
      }
    },
    ChangeDragType(index) {
      if (this.JSEnvironment.HistoryChart != null) {
        this.JSEnvironment.HistoryChart.JSChartContainer.DragMode = index
      }
    },
    showTools() {
      console.log('[index page::画图工具]')
      if (this.JSEnvironment.HistoryChart != null) {
        const chart = this.JSEnvironment.HistoryChart
        const frame = chart.JSChartContainer.Frame
        if (this.ExtendChart === null) {
          this.DrawTools = chart.JSChartContainer.GetExtendChartByClassName('DrawToolsButton')
          // let drawTools = this.DrawTools
          const option = { Name: '画图工具', Top: frame.ChartBorder.Top, IsAutoIndent: 1 }
          this.ExtendChart = chart.JSChartContainer.CreateExtendChart(option.Name, option) // 创建扩展图形
          const extendChart = this.ExtendChart
          frame.ChartBorder.Right += extendChart.ToolsWidth
          chart.JSChartContainer.SetSizeChage(true)
          chart.JSChartContainer.Draw()
        }
      }
    },
    openMenuTwo(ind) { // 展开二级菜单
      this.currentDirection = 'icon-shang'
      if (this.IsChartShow.MinuteChartShow) { // 分时图
        this.IndexInMinute = ind
      } else {
        this.MenuOneIndex = ind
        this.MenuOneSelectedIndex = ind
      }
    },
    SpellStock() { // 股票联想
      const inputText = this.inputSymbolStr
      const spellData = {
        Input: inputText,
        Start: 0,
        End: 10,
        Callback: this.RequestSpell
      }
      const Url = 'https:// opensource.zealink.com/API/StockSpell'
      $.ajax({
        url: Url,
        method: 'POST',
        data: {
          'input': spellData.Input,
          'start': spellData.Start,
          'end': spellData.End
        },
        dataType: 'json',
        success(res) {
          if (res.code === 0) {
            spellData.Callback(res.stock)
          }
        },
        fail(res) {
          console.log('SpellStock fail', res)
        }
      })
    },
    RequestSpell(data) {
      if (data.length > 0) {
        this.SpellStockShow.List = true
        this.SearchSymbols = data
      } else {
        this.SpellStockShow.List = false
      }
    },
    changeKLineChart(currentData, name, ind) { // 参数：一级菜单名称，二级菜单内容，二级菜单下标
      this.MenuOneIndex = 999 // 下标不相等，隐藏二级菜单
      this.IndexInMinute = 999
      this.currentDirection = 'icon-xia'
      currentData.ActiveIndex = ind
      const text = currentData.Text
      // 修改一级菜单文本
      // this.MenuData[index].Text = name
      switch (text) {
        case '副图指标':
          if (this.JSEnvironment.MinuteChart != null) {
            this.JSEnvironment.MinuteChart.ChangeIndex(1, name)
          }
          break
        case '分析周期':
          this.updateHistoryChart(ind)
          break
        case '复权处理':
          this.ChangeCurrentRight(ind)
          break
        case '指标切换':
          this.ChangeCurrentIndex(name)
          break
        case '五彩K线':
          this.ChangeInsCurrentIndex(name)
          break
        case '专家系统':
          this.ChangeSystem(name)
          break
        case '叠加品种':
          this.ChangeOVerlay(ind)
          break
        case '主图线型':
          this.ChangeMainLineType(ind)
          break
        case '坐标类型':
          this.ChangeCurrentCoordinateType(ind)
          break
        case '窗口个数':
          this.ChangeWindowCount(ind)
          break
        case '鼠标拖拽':
          this.ChangeDragType(ind)
          break
        case '工具':
          this.showTools()
          break
      }
    },
    LoadEnvironment() {
      const symbol = this.getURLParams('symbol')
      if (symbol != null) this.GlobalSymbol = symbol

      const strIndex = this.getURLParams('index')
      if (strIndex) {
        const aryIndex = strIndex.split(',')
        if (aryIndex.length > 0) this.JSEnvironment.KLineIndex = aryIndex
      }
      // 分钟走势图配置
      this.JSEnvironment.MinuteOption = {
        Type: '分钟走势图', // 历史分钟走势图
        Symbol: this.GlobalSymbol,
        IsAutoUpate: true, // 是自动更新数据
        Windows:
          [
            { Index: 'MACD', Modify: false, Change: false }
          ],
        DayCount: 1,

        IsShowRightMenu: false, // 右键菜单
        IsShowCorssCursorInfo: true, // 是否显示十字光标的刻度信息

        Border: // 边框
          {
            Left: 60, // 左边间距
            Right: 60, // 右边间距
            Top: 20,
            Bottom: 20
          },

        KLineTitle: // 标题设置
          {
            IsShowName: false, // 不显示股票名称
            IsShowSettingInfo: false // 不显示周期/复权
          },

        Frame: // 子框架设置,刻度小数位数设置
          [
            { SplitCount: 5, StringFormat: 0 },
            { SplitCount: 3, StringFormat: 0 },
            { SplitCount: 3, StringFormat: 0 }
          ]
      }

      // K线图配置
      this.JSEnvironment.HistoryOption = {
        Type: '历史K线图',
        Windows: [
          { Index: '均线', Modify: false, Change: false, Overlay: false, Close: false },
          { Index: 'VOL', Modify: false, Change: false, Overlay: false, Close: false },
          { Index: 'MACD', Modify: false, Change: false, Overlay: false, Close: false }
        ], // 窗口指标
        Symbol: this.GlobalSymbol,
        IsAutoUpdate: true, // 是自动更新数据

        IsShowRightMenu: false, // 右键菜单

        KLine: {
          DragMode: 1, // 拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
          Right: 1, // 复权 0 不复权 1 前复权 2 后复权
          Period: 0, // 周期 0 日线 1 周线 2 月线 3 年线
          MaxReqeustDataCount: 1000, // 日线数据最近1000天
          MaxRequestMinuteDayCount: 15, // 分钟数据最近15天
          PageSize: 50, // 一屏显示多少数据
          IsShowTooltip: true // 是否显示K线提示信息
        },

        KLineTitle: // 标题设置
          {
            IsShowName: true, // 不显示股票名称
            IsShowSettingInfo: true // 不显示周期/复权
          },

        Border: // 边框
          {
            Left: 60, // 左边间距
            Right: 60, // 右边间距
            Top: 20
          },

        Frame: // 子框架设置
          [
            { SplitCount: 3, StringFormat: 0, IsShowLeftText: false },
            { SplitCount: 3, StringFormat: 0, IsShowLeftText: false },
            { SplitCount: 3, StringFormat: 0, IsShowLeftText: false },
            { SplitCount: 3, StringFormat: 0, IsShowLeftText: false }
          ]
      }
    },
    // changeCurrentMinuteIndex(name,ind){  // 切换分时图副图指标
    //     this.menuTwoIndexMinute = ind
    //     if(this.JSEnvironment.MinuteChart != null){
    //         this.JSEnvironment.MinuteChart.ChangeIndex(1,name)
    //     }
    // },
    ChangeChartByNav(idx, event) {
      const text = event.currentTarget.text
      this.navIndex = idx
      if (text === '分时') {
        this.IsChartShow = {
          MinuteChartShow: true,
          KlineChartShow: false
        }
        this.updateMinuteChart(1)
        this.IndexBottomData = this.IndexBottomForMinute
        this.BottomIndexShow = true
      } else if (text === '五日') {
        this.IsChartShow = {
          MinuteChartShow: true,
          KlineChartShow: false
        }
        this.updateMinuteChart(5)
        this.IndexBottomData = this.IndexBottomForMinute
        this.BottomIndexShow = true
      } else {
        this.IsChartShow = {
          MinuteChartShow: false,
          KlineChartShow: true
        }
        // this.MenuTwoIndex = idx - 2  // 选中对应的二级菜单
        switch (text) {
          case '日线':
            this.updateHistoryChart(0)
            break
          case '周线':
            this.updateHistoryChart(1)
            break
          case '月线':
            this.updateHistoryChart(2)
            break
          case '年线':
            this.updateHistoryChart(3)
            break
          case '1分钟':
            this.updateHistoryChart(4)
            break
          case '5分钟':
            this.updateHistoryChart(5)
            break
          case '15分钟':
            this.updateHistoryChart(6)
            break
          case '30分钟':
            this.updateHistoryChart(7)
            break
          case '60分钟':
            this.updateHistoryChart(8)
            break
        }
        this.IndexBottomData = this.IndexBottomForHistory
        this.BottomIndexShow = false
      }

      // console.log('[ChangeChartByNav event]',event.currentTarget.text)
    },
    addClassForData(arrData, arrSource, yClose, type) {
      arrData.splice(0, arrData.length)
      const ary1 = ['卖一', '卖二', '卖三', '卖四', '卖五']
      const ary2 = ['买一', '买二', '买三', '买四', '买五']
      let textAry = []
      if (type === 'Buy') {
        textAry = ary2
      } else if (type === 'Sell') {
        textAry = ary1
      }
      if (arrSource !== undefined && arrSource.length > 0) {
        arrSource.forEach(function(item, index) {
          if (item.Price > yClose) {
            item.ClassName = 'upColor'
          } else if (item.Price < yClose) {
            item.ClassName = 'lowColor'
          } else {
            item.ClassName = ''
          }
          item.PriceFormat = Number(item.Price).toFixed(2)
          let timeStr = ''

          if (type !== 'Deal') {
            item.Text = textAry[index]
          } else {
            if (String(item.Time).length === 5) {
              timeStr = '0' + item.Time
            } else {
              timeStr = String(item.Time)
            }
            item.TimeFormat = timeStr.substring(0, 2) + ':' + timeStr.substring(2, 4)
          }
          arrData.push(item)
        })
      }
    },
    updateMinuteChart(count) { // 更新分时图
      // 根据百分比获取分时图div的宽度
      const trueWidth = $('.leftChart').width()
      // this.TrueWidth = trueWidth
      $('#minuteChartID').width(Number(trueWidth))

      if (this.JSEnvironment.MinuteChart === null) {
        this.JSEnvironment.MinuteChart = jsChart.jsChartInit(this.$refs.minuteChartID) // 初始化走势图
        jsChart.jsChartStyle(this.JSEnvironment.MinuteOption)
        this.JSEnvironment.MinuteChart.SetOption(this.JSEnvironment.MinuteOption)
      } else {
        this.JSEnvironment.MinuteChart.ChangeDayCount(count)
      }
    },
    UpdateMain(id, arySymbol, dataType, jsStockIntans) { // 获得股票基础数据
      const read = jsStockIntans.GetStockRead('main', this.UpdateMain) // 获取一个读取数据类,并绑定id和更新数据方法
      const symbol = arySymbol[0]
      const name = read.Get(symbol, jsStock.STOCK_FIELD_NAME.NAME)
      this.JSEnvironment.Name = name
      // let date = read.Get(symbol, jsStock.STOCK_FIELD_NAME.DATE)
      // let time = read.Get(symbol, jsStock.STOCK_FIELD_NAME.TIME)
      const price = read.Get(symbol, jsStock.STOCK_FIELD_NAME.PRICE)
      const riseFallPrice = read.Get(symbol, jsStock.STOCK_FIELD_NAME.RISE_FALL_PRICE)
      const increase = read.Get(symbol, jsStock.STOCK_FIELD_NAME.INCREASE)
      const high = read.Get(symbol, jsStock.STOCK_FIELD_NAME.HIGH)
      const low = read.Get(symbol, jsStock.STOCK_FIELD_NAME.LOW)
      const open = read.Get(symbol, jsStock.STOCK_FIELD_NAME.OPEN)
      const excahngerate = read.Get(symbol, jsStock.STOCK_FIELD_NAME.EXCHANGE_RATE)
      const amount = read.Get(symbol, jsStock.STOCK_FIELD_NAME.AMOUNT)
      const vol = read.Get(symbol, 7)
      const pe = read.Get(symbol, jsStock.STOCK_FIELD_NAME.PE)
      const marketV = read.Get(symbol, jsStock.STOCK_FIELD_NAME.MARKET_VALUE)
      const flowMarketV = read.Get(symbol, jsStock.STOCK_FIELD_NAME.FLOW_MARKET_VALUE)
      const eps = read.Get(symbol, jsStock.STOCK_FIELD_NAME.FINANCE_PERSEARNING)
      const scrollEPS = read.Get(symbol, jsStock.STOCK_FIELD_NAME.FINANCE_EPS)
      const roe = read.Get(symbol, jsStock.STOCK_FIELD_NAME.ROE)
      const pb = read.Get(symbol, jsStock.STOCK_FIELD_NAME.PB)
      const amplitude = read.Get(symbol, jsStock.STOCK_FIELD_NAME.AMPLITUDE)
      const yClose = read.Get(symbol, jsStock.STOCK_FIELD_NAME.YCLOSE)
      const bookRate = read.Get(symbol, jsStock.STOCK_FIELD_NAME.BOOK_RATE) // 委比
      const bookDiffer = read.Get(symbol, jsStock.STOCK_FIELD_NAME.BOOK_DIFFER) // 委差
      const buyData = read.Get(symbol, jsStock.STOCK_FIELD_NAME.BUY5)
      const sellData = read.Get(symbol, jsStock.STOCK_FIELD_NAME.SELL5)
      const dealData = read.Get(symbol, jsStock.STOCK_FIELD_NAME.DEAL)
      this.bookData = {
        BookRate: {
          Text: Number(bookRate).toFixed(2) + '%',
          ClassName: this.setColor(bookRate, 0)
        },
        BookDiffer: {
          Text: bookDiffer,
          ClassName: this.setColor(bookRate, 0)
        }
      }
      this.addClassForData(this.buyData, buyData, yClose, 'Buy')
      this.addClassForData(this.sellData, sellData, yClose, 'Sell')
      this.sellData.reverse()
      this.addClassForData(this.detailData, dealData, yClose, 'Deal')

      this.pageData = new Map()
      this.pageData.set('symbol', this.GlobalSymbol)
      // this.pageData.set('name',name)
      this.pageData.set('price', price)
      this.pageData.set('rise', riseFallPrice)
      this.pageData.set('riseRate', increase)
      this.pageData.set('high', high)
      this.pageData.set('low', low)
      this.pageData.set('open', open)
      this.pageData.set('exchange', excahngerate)
      this.pageData.set('amount', amount)
      this.pageData.set('vol', vol)
      this.pageData.set('pe', pe)
      this.pageData.set('marketV', marketV)
      this.pageData.set('flowMarketV', flowMarketV)
      this.pageData.set('eps', eps)
      this.pageData.set('scrollEPS', scrollEPS)
      this.pageData.set('roe', roe)
      this.pageData.set('pb', pb)
      this.pageData.set('amplitude', amplitude)
      this.baseDataFormat(this.pageData)
      this.baseDataColor(this.pageData, yClose)
      document.title = name
      read.EndRead()
    },
    updateHistoryChart(period) { // 更新k线图
      // 根据百分比获取k线图div的宽度
      const trueWidth = $('.leftChart').width()
      // this.TrueWidth = trueWidth
      $('#kLine').width(Number(trueWidth))
      // $('"'#kLine'"').height(360)
      if (this.JSEnvironment.HistoryChart === null) {
        this.JSEnvironment.HistoryChart = jsChart.jsChartInit(this.$refs.kLine) // 初始化K线图
        this.JSEnvironment.HistoryOption.KLine.Period = period
        this.JSEnvironment.HistoryChart.SetOption(this.JSEnvironment.HistoryOption)
      } else {
        this.JSEnvironment.HistoryChart.ChangePeriod(period)
      }
    },
    hideMenuTwo(index) {
      this.MenuOneIndex = 999 // 下标不相等，隐藏二级菜单
      this.currentDirection = 'icon-xia'
    },
    baseDataFormat(data) {
      const self = this
      data.forEach(function(item, key, mapObj) {
        if (item === undefined) {
          if (key === 'riseRate' || key === 'exchange' || key === 'roe' || key === 'amplitude') {
            item = '--%'
          } else {
            item = '--'
          }
        } else {
          if (key === 'amount' || key === 'marketV' || key === 'flowMarketV' || key === 'vol') {
            item = self.numToCUnit(item)
          } else if (key === 'riseRate' || key === 'exchange' || key === 'roe' || key === 'amplitude') {
            item = Number(item).toFixed(2) + '%'
          } else {
            item = Number(item).toFixed(2)
          }
        }
        data.set(key, item)
      })
    },
    numToCUnit(num) {
      if (num < 100000000) {
        return Number(num / 10000).toFixed(2) + '万'
      } else {
        return Number(num / 100000000).toFixed(2) + '亿'
      }
    },
    CaluChartWidthHeight() { // 计算图形高度
      $('.container').height($(document).height())
      const chartHeight = $(document).height() - $('.topWrap').outerHeight(true) - $('.navBarWrap').outerHeight(true) - $('.kLineSetWrap').outerHeight(true) - $('.indexList').outerHeight(true) - 5
      const chartWidth = $(document).width() - $('.rightData').outerWidth(true) - 2
      console.log('[CaluChartWidthHeight document outerWidth]', $(document).width())
      $('#minuteChartID').width(chartWidth).height(chartHeight)
      $('#kLine').width(chartWidth).height(chartHeight)
      if (this.JSEnvironment.MinuteChart != null) {
        this.JSEnvironment.MinuteChart.OnSize()
      }
      if (this.JSEnvironment.HistoryChart != null) {
        this.JSEnvironment.HistoryChart.OnSize()
      }
    },
    baseDataColor(data, yClose) { // 与昨日收盘价相比，与0比
      this.pageDataColor = {}
      const self = this
      let className = ''
      data.forEach(function(item, key, mayobj) {
        if (item !== undefined) {
          switch (key) {
            case 'exchange':
              item = item.split('%')[0]
              className = self.setColor(item, 0)
              self.pageDataColor.exchangeClass = className
              break
            case 'roe':
              item = item.split('%')[0]
              className = self.setColor(item, 0)
              self.pageDataColor.roeClass = className
              break
            case 'rise':
            case 'riseRate':
              item = item.split('%')[0]
              className = self.setColor(item, 0)
              self.pageDataColor.riseClass = className
              break
            case 'price':
              className = self.setColor(item, yClose)
              self.pageDataColor.priceClass = className
              break
            case 'high':
              className = self.setColor(item, yClose)
              self.pageDataColor.highClass = className
              break
            case 'low':
              className = self.setColor(item, yClose)
              self.pageDataColor.lowClass = className
              break
            case 'open':
              className = self.setColor(item, yClose)
              self.pageDataColor.openClass = className
              break
          }
        }
      })
    },
    setColor(item, yClose) {
      if (item > yClose) {
        return 'upColor'
      } else if (item < yClose) {
        return 'lowColor'
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.LoadEnvironment()
    this.updateMinuteChart(1)
    this.IndexBottomData = this.IndexBottomForMinute
    this.updateHistoryChart(0)
    const self = this
    document.addEventListener('click', (e) => {
      if (!$('#kLineSetWrap').is(e.target) && $('#kLineSetWrap').has(e.target).length === 0) this.MenuOneIndex = 999
    })
    this.CaluChartWidthHeight()
    $(window).resize(function() { // 重新计算尺寸
      self.CaluChartWidthHeight()
    })
  },

  created() {
    console.log('[created jsStock]', jsStock)
    this.JSEnvironment.StockCache = jsStock.JSStockInit()
    const arySymbol = []
    arySymbol.push(this.GlobalSymbol)
    this.UpdateMain(null, arySymbol, null, this.JSEnvironment.StockCache)
    this.JSEnvironment.StockCache.ReqeustData()
  }
}
</script>

<style scoped lang="scss">
  $border: 1px solid #e1ecf2;

  * {
    font: 14px/normal "Microsoft Yahei";
    color: #666;
    padding: 0;
    margin: 0;
  }

  html, body {
    height: 100%;
  }

  a {
    text-decoration: none;
  }

  ul,
  ol {
    list-style: none;
  }

  .clearfix::after {
    content: ' ';
    display: block;
    width: 0;
    height: 0;
    overflow: hidden;
    clear: both;
  }

  .upColor {
    color: #ee1515;
  }

  .lowColor {
    color: #199e00;
  }

  /* .container {
      min-width: 1366px;
  } */

  .topWrap {
    background-color: #eee;
    padding: 15px 2.2% 5px 1.5%;
    height: 47px;
  }

  .topWrap .stockInfo,
  .topWrap .priceInfo,
  .topWrap .otherInfo {
    float: left;
  }

  .topWrap .otherInfo div {
    line-height: 1;
  }

  .topWrap .otherInfo div:nth-of-type(2) {
    margin-bottom: 9px;
  }

  .topWrap .otherInfo span {
    margin-left: 20px;
  }

  .topWrap .stockInfo {
    width: 11%;
    /*w:146*/
    box-sizing: border-box;
    padding-left: 0.3%;
    padding-bottom: 12px;
    height: 18px;

    .codeInfo {
      position: relative;
      height: 24px;
      z-index: 333;

      .code {
        font-size: 18px;
        line-height: 1;
        color: #333;
        margin-right: 15px;
      }

      .icon-bianji {
        color: #0e1d2d;
        font-size: 18px;
        cursor: pointer;
      }

      .editSymbol {
        height: 24px;
        width: 94px;
        box-sizing: border-box;
        padding-left: 5px;
        padding-top: 2px;
        border: 1px solid #999;
        background-color: #fff;
        position: absolute;
        top: 0;
        left: 0;

        input {
          border: none;
          width: 67px;
        }

        .icon-close {
          font-size: 14px;
        }
      }

      .symbolList {
        position: absolute;
        top: 24px;
        left: 0;
        width: 169px;
        border: 1px solid #999;
        background-color: #fff;

        > li {
          padding: 0 8px;
          line-height: 24px;
          cursor: pointer;

          .symbol {
            margin-right: 10px;
          }
        }

        > li:hover {
          background-color: #0e1d2d;

          > span {
            color: #fff;
          }
        }
      }
    }
  }

  .stockInfo .stockName {
    font-size: 20px;
    line-height: 1;
    color: #333;
    margin-bottom: 4px;
  }

  .topWrap .priceInfo {
    width: 9.8%;
    /*w:134*/
  }

  .priceInfo .priceCurrentNum {
    font-size: 18px;
  }

  .priceInfo .priceCurrent {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .priceInfo .priceCurrent .riseNum {
    flex-grow: 1;
  }

  .priceInfo .priceCurrent .risePrecent {
    flex-grow: 2;
  }

  .topWrap .otherInfo {
    width: 75.2%;
  }

  .topWrap .otherInfo ul {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .topWrap .otherInfo li {
    flex-grow: 1;
  }

  .navBarWrap {
    height: 36px;
    background-color: #0e1d2d;
    padding-left: 36px;
    padding-right: 30px;
  }

  .navBarWrap .item {
    color: #fff;
    display: inline-block;
    font-size: 14px;
    line-height: 1;
    padding: 4px 12px;
    margin-top: 8px;
    margin-right: 26px;
    border-radius: 10px;
  }

  .navBarWrap .item.active {
    color: #0e1d2d;
    background-color: #fff;
  }

  .kLineSetWrap {
    height: 32px;
    line-height: 32px;
    padding-left: 20px;
    border-bottom: 1px solid #d9d9d9;
    position: relative;
    z-index: 999;

    > .item {
      display: inline-block;
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      padding-top: 6px;
      position: relative;
      margin-right: 15px;
      box-sizing: border-box;

      .menuOne {
        border: 1px solid;
        border-color: transparent;
        border-bottom: none;
        display: inline-block;
        width: 100%;
        height: 26px;
        vertical-align: top;
        padding: 0 14px 6px 14px;
        box-sizing: border-box;
      }

      .menuOne:hover,
      .menuOne.light {
        border-color: #d9d9d9;

        > span {
          color: #0e1d2d;
        }
      }

      .menuTwo {
        position: absolute;
        background-color: #fff;
        top: 32px;
        left: 0;
        border: 1px solid #d9d9d9;
        border-top: none;
        box-sizing: border-box;
        width: 100%;

        > li {
          padding: 0 12px;
          line-height: 32px;
        }

        > li:hover,
        > li.active {
          color: #0e1d2d;
        }
      }
    }

    > .item:nth-child(1) {
      .menuOne {
        padding: 0 10px;
      }
    }

    > .item:nth-child(7) {
      .menuOne {
        padding: 0 30px;
      }
    }

    .iconfont {
      font-size: 13px;
    }
  }

  .indexList {
    width: 100%;
    height: 32px;
    display: flex;
    flex-direction: row;
    background-color: #1f2026;
  }

  .indexList span {
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    flex-grow: 1;
    color: #5a657e;
  }

  .indexList span.active {
    color: #efbb53;
  }

  .leftChart {
    /* width: 80.75%; */
    float: left;
    padding-top: 5px;
  }

  .rightData {
    float: left;
    width: 208px;
    margin-top: 25px;
    margin-left: 10px;
    margin-right: 10px;
    border: $border;

    .firstLine {
      line-height: 39px;
      border-bottom: $border;
      padding-left: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      > span {
        margin-right: 15px;
        line-height: 39px;
      }

      > span:nth-of-type(2) {
        margin-right: 0;
      }
    }

    .buyFive,
    .sellFive {
      border-bottom: $border;
      padding: 3px 0;

      > li {
        line-height: 24px;

        > span {
          display: inline-block;
        }

        > span:nth-of-type(1) {
          width: 20%;
          box-sizing: border-box;
          padding-left: 10px;
        }

        > span:nth-of-type(2) {
          width: 35%;
        }

        > span:nth-of-type(3) {
          width: 35%;
        }
      }
    }

    .detailList {
      padding-left: 10px;
      padding: 7px 0;

      > li {
        line-height: 26px;

        > span {
          display: inline-block;
        }

        > span:nth-of-type(1) {
          width: 32%;
          box-sizing: border-box;
          padding-left: 10px;
        }

        > span:nth-of-type(2) {
          width: 28%;
        }

        > span:nth-of-type(3) {
          width: 32%;
        }
      }
    }
  }
  .el-input > .el-input__inner {
    height: 25px;
  }
</style>
