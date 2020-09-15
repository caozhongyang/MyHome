<template>
  <div style="margin-top: 1rem;width: 100%">
    <div style="width: 100%;display: flex;margin-top: 20px;flex-direction: column;align-items: center;">
      <el-select v-model="keyword" filterable placeholder="请输入内容" style="width: 50vw;margin-top: 15px;" clearable @change="remoteMethod">
        <el-option
          v-for="item in options"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
    </div>
    <el-row>
      <el-col :span="22" :offset="1">
        <div v-if="keyword === ''" v-html="content" />
        <div v-else>
          <iframe name="iframe2" :src="html" class="el-col el-col-22 el-col-offset-1" style="margin-top: 20px;height: 60vh;" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getArticleDetail } from '@/api/remote-search'
import cm_data from './data.json'
const preurl = 'http://10.168.1.135/dc/md/'
export default {
  name: 'Linux',
  data() {
    return {
      keyword: '',
      doc: '',
      content: '',
      options: [],
      html: ''
    }
  },
  watch: {
    keyword() {
      this.remoteMethod()
    }
  },
  mounted() {
    this.remoteMethod()
    this.initCM()
  },
  methods: {
    remoteMethod() {
      const me = this
      if (this.keyword === '') {
        getArticleDetail(21).then(res => {
          me.content = res.data.content
        })
      } else {
        me.content = ''
        console.log(this.keyword)
        me.html = preurl + this.keyword + '.md'
      }
    },
    initCM() {
      const dic = cm_data
      const options = []
      for (const item in dic) {
        console.log(item)
        const obj = {}
        obj['key'] = item
        obj['label'] = `${item}: ${dic[item]['d']}`
        options.push(obj)
      }
      this.options = options
    }
  }
}
</script>

<style scoped>

</style>
