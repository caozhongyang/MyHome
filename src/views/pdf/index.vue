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
          <a :href="'http://tcs/pdf/' + scope.row.name" target="_blank">
            <el-button type="primary" size="small" icon="el-icon-edit">
              查看
            </el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getPdfList } from '@/api/remote-search'
export default {
  name: 'PDF',
  data() {
    return {
      list: []
    }
  },
  mounted() {
    const me = this
    getPdfList().then(res => {
      me.list = res.data
    })
  }
}
</script>

<style scoped>

</style>
