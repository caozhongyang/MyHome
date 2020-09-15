<template>
  <div class="app-container">
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80px;">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文件名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120px;">
        <template slot-scope="scope">
          <a :href="'http://10.168.1.135/dc/pdf/' + scope.row.name" target="_blank">
            <el-button type="primary" size="small" icon="el-icon-edit">
              查看
            </el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getDocList" />
  </div>
</template>

<script>
const dic = {
  '/pdf/server': 'SERVER',
  '/pdf/make_money': 'MAKE_MONEY'
}
import { getPdfList } from '@/api/remote-search'
import Pagination from '@/components/Pagination'
export default {
  name: 'PDF',
  components: { Pagination },
  data() {
    return {
      list: [],
      listQuery: {
        page: 1,
        limit: 20,
        type: dic[this.$route.fullPath]
      },
      total: 0
    }
  },
  created() {
  },
  mounted() {
    this.getDocList()
  },
  methods: {
    getDocList() {
      const me = this
      getPdfList(this.listQuery).then(res => {
        me.list = res.data.records
        me.total = res.data.total
      })
    }
  }
}
</script>

<style scoped>

</style>
