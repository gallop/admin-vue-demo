/* eslint-disable */
require('script-loader!file-saver')
import axios from 'axios'
import {getToken, TokenKey} from '@/utils/auth'

const getDownloadFile = url => {
  // headers: {'X-msdemo-Admin-Token': getToken()},
  return new Promise((resolve, reject) => {
    axios({
      headers: {'X-msdemo-Admin-Token': getToken()},
      method: 'get',
      url,
      responseType: 'arraybuffer'
    }).then(data => {
      // console.log('data---=:'+JSON.stringify(data))
      resolve(data.data)
    }).catch(error => {
      console.log("getFile-err:" + error.toString())
      reject(error.toString())
    })
  })
}
const getPicFile = url => {
  return new Promise((resolve, reject) => {
    axios({
      headers: {
        'X-msdemo-Admin-Token': getToken(),
        'Access-Control-Allow-Origin': '*'
      },
      method: 'get',
      url,
      responseType: 'arraybuffer'
    }).then(data => {
      let respData = 'data:image/jpg;base64,' + btoa(new Uint8Array(data.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), ''))
      resolve(respData)
    }).catch(error => {
      console.log("getFile-err:" + error.toString())
      reject(error.toString())
    })
  })
}

/**
 * 下载文件用
 * @param url
 * @param fileName
 */
export function downloadFile(url, fileName) {
  getDownloadFile(url).then(data => {
    // console.log('url:'+url)
    saveAs(new Blob([data], {
      type: "application/octet-stream"
    }), fileName)
  })
}

/**
 * 获取图片base64 数据，用于页面直接用base64数据显示图片
 * @param key
 * @returns {Promise<unknown>}
 */
export function getPicture(key) {
  let url = `/storage/fetch/${key}`
  url = process.env.VUE_APP_BASE_API + url
  return  getPicFile(url)
}
