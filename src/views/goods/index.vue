<template>
  <div style="margin-top: 1rem;width: 100%">
    <div style="width: 100%;display: flex;margin-top: 20px;flex-direction: column;align-items: center;">
      <el-input placeholder="请输入内容" v-model="keyword" @keyup.enter.native="remoteMethod" class="input-with-select" style="width: 50vw;margin-top: 15px;">
        <el-button slot="append" icon="el-icon-search" @click="remoteMethod"></el-button>
      </el-input>
      <div>
        <span style="line-height: 36px;color: gray;text-align: center;margin-top: 20px;"><em>点击商品查看历史价格</em></span>
      </div>
    </div>
    <div style="margin: auto;width: 96%;margin-top: 20px;">
      <el-col :xs="12" :sm="12" :lg="6" v-for="it in goodslist" :key="it.id">
        <div style="display: flex;justify-content: space-between; min-height: 400px;" :gutter="16" @click="showhistory(it)">
          <div style="height: 98%;width: 96%;display: flex;flex-direction: column;justify-content: space-between;font-size: 0.8rem">
            <img border="0" :src="it.img" width="100%">
            <div class="flex-item goods-name" style="font: 12px/150% tahoma,arial,Microsoft YaHei,Hiragino Sans GB;'\u5b8b\u4f53',sans-serif;">
              <p class="goods-name">
                {{it.name}}
              </p>
            </div>
            <div class="flex-item" style="color: #e4393c">
              ¥<em>{{it.price}}</em>
            </div>
            <div class="flex-item" style="color: #005aa0">
              <em>{{it.shop}}</em>
            </div>
            <div class="flex-item">
              <em>{{it.source == 'JD' ? '京东' : '天猫'}}</em>
            </div>
          </div>
        </div>
      </el-col>
    </div>
    <div class="components-container">
      <el-dialog :visible.sync="dialogTableVisible" :title="title">
        <LineChart :chart-data="charData"></LineChart>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { searchGoods, searchHistory } from '@/api/remote-search'
import LineChart from '@/views/goods/components/LineChart'
export default {
  components: { LineChart },
  name: 'Analyze',
  data() {
    return {
      options: [],
      keyword: 'adidas',
      goodslist: [],
      charData: [],
      title: '历史价格',
      dialogTableVisible: false
    }
  },
  mounted() {
    this.remoteMethod()
  },
  methods: {
    remoteMethod() {
      const me = this
      searchGoods({
        index: 'goods',
        'template': 'goods_template',
        'params': {
          keyword: this.keyword,
          from: 0,
          size: 100
        }
      }).then(response => {
        me.goodslist = response.data
      })
    },
    showhistory(obj) {
      const me = this
      const detail = 'https:' + obj.detail
      searchHistory(detail).then(res => {
        me.charData = res.data
        me.dialogTableVisible = true
        me.title = obj.name
      })
    }
  }
}
</script>

<style scoped>
  .flex-item {
    margin-bottom: 6px;
  }
  .goods-name {
    text-overflow: ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
</style>
