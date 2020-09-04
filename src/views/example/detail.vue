<template>
  <div style="width: 96vm;height:100vh;background-color: #efefef;overflow: auto;padding-top: 3vh;">
    <el-row>
      <el-col :span="24" style="text-align: center">
        <h1>
          {{article.title}}
        </h1>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11" :offset="1" class="abstract"><em>{{article.contentShort}}</em></el-col>
    </el-row>
    <el-row>
      <el-col :span="22" :offset="1">
        <div v-html="article.content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const dic = {
  server: '服务端',
  arithmetic: '算法',
  data: '数据',
  safe: '安全',
  project: '项目'
}
import { getArticleDetail } from '@/api/remote-search'
export default {
  name: 'Detail',
  data() {
    return {
      id: this.$route.query.id,
      article: {
        title: '',
        contentShort: '',
        content: ''
      }
    }
  },
  filters: {
    parseType(type) {
      return dic[type]
    }
  },
  created() {
  },
  watch: {
    id() {
      this.initArticle()
    }
  },
  methods: {
    initArticle() {
      const me = this
      const id = this.$route.query.id
      getArticleDetail(id).then(res => {
        me.article = res.data
      })
    }
  },
  mounted() {
    this.initArticle()
  }
}
</script>

<style scoped>
h1 {
  color: #07b;
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
.tag {
  float: left;
  padding: 3px 8px;
  height: 22px;
  line-height: 22px;
  color: greenyellow;
  border-radius: 8px;
}
.abstract {
  color: palevioletred;
  padding-top: 2vh;
}
.abstract:before {
  content: '摘要: ';
}
.conetent {
  padding-top: 3vh;
}
</style>
