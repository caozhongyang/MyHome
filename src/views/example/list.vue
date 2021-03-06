<template>
  <div class="app-container">
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="发布日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | parseType }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="重要程度">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | parseType }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <router-link :to="'/example/detail?id='+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit?id='+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
        </template>
      </el-table-column>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-table>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'

const dic = {
  server: '服务端',
  web: '前端',
  arithmetic: '算法',
  data: '数据',
  safe: '安全',
  project: '项目',
  other: '其它',
  published: '有效',
  deactive: '失效'
}
import { getArticleList } from '@/api/remote-search'
import { parseTime } from '@/utils'
export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    parseType(type) {
      return dic[type]
    },
    parseTime(time, format) {
      parseTime(time, format)
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        type: dic[this.$route.fullPath]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const me = this
      getArticleList(this.listQuery).then(res => {
        me.list = res.data.records
        me.total = res.data.total
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
