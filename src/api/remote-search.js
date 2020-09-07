import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: 'http://www.baidu.com/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}

export function searchGoods(data) {
  return request({
    url: 'http://10.168.1.135:8080/tc/search/template',
    method: 'post',
    data
  })
}

export function searchHistory(url) {
  return request({
    url: 'http://10.168.1.135:8080/tc/search/history',
    method: 'get',
    params: {
      url: url
    }
  })
}

export function getPdfList(data) {
  return request({
    url: 'http://10.168.1.135:8080/tc/attachement/getPdfList',
    method: 'post',
    data
  })
}

export function createArticle(data) {
  return request({
    url: 'http://10.168.1.135:8080/tc/article/createArticle',
    method: 'post',
    data
  })
}

export function getArticleList(data) {
  return request({
    url: 'http://10.168.1.135:8080/tc/article/getArticleList',
    method: 'post',
    data
  })
}

export function getArticleDetail(id) {
  return request({
    url: 'http://10.168.1.135:8080/tc/article/getArticleDetail',
    method: 'get',
    params: {
      id: id
    }
  })
}
