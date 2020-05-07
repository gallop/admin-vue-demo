import request from '@/utils/request'

export function listStorage(query) {
  return request({
    url: '/storage/list',
    method: 'get',
    params: query
  })
}

export function createStorage(data) {
  return request({
    url: '/storage/create',
    method: 'post',
    data
  })
}

export function updateStorage(data) {
  return request({
    url: '/storage/update',
    method: 'post',
    data
  })
}

export function deleteStorage(data) {
  return request({
    url: '/storage/delete',
    method: 'post',
    data
  })
}
export function fetchPic(query) {
  return request({
    url: `/storage/fetch/${query}`,
    method: 'get'
  })
}

const uploadPath = process.env.VUE_APP_BASE_API + '/storage/create'
export { uploadPath }
