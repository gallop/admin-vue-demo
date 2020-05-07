import request from '@/utils/request'

export function changePassword(data) {
  return request({
    url: '/adminUser/password',
    method: 'post',
    data
  })
}
