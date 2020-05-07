import request from '@/utils/request'

export function listAdmin(query) {
  return request({
    url: '/adminUser/list',
    method: 'get',
    params: query
  })
}

export function createAdmin(data) {
  return request({
    url: '/adminUser/create',
    method: 'post',
    data
  })
}

export function readminAdmin(data) {
  return request({
    url: '/adminUser/readmin',
    method: 'get',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/adminUser/update',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/adminUser/delete',
    method: 'post',
    data
  })
}
