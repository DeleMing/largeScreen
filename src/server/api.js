import axios from "axios";
var CancelToken = axios.CancelToken;
let baseUrl = window.baseUrl;
let cancelAjaxText = '中断请求';
export let cancel;
// export var source = CancelToken.source();
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function httpGet(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: baseUrl + url,
      params: params,
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    }).then(response => {
      response.data.timeStamp = new Date(response.headers.date).getTime();
      if (response.message === cancelAjaxText) {
        response.data.msg = cancelAjaxText;
        resolve(response.data);
      } else {
        resolve(response.data);
      }
    }).catch(err => {
      reject(err)
    });
    // axios.get(url, {
    //   params: params
    // })
    //   .then(response => {
    //     resolve(response.data);
    //   })
    //   .catch(err => {
    //     reject(err)
    //   })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function httpPost(url, data = {}) {
  return new Promise((resolve, reject) => {
    // axios.post(url, data)
    //   .then(response => {
    //     resolve(response.data);
    //   }, err => {
    //     reject(err)
    //   })
    axios({
      method: 'post',
      url: baseUrl + url + '?t=' + new Date().getTime(),
      data: data,
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    }).then(response => {
      if (response.message === cancelAjaxText) {
        response.data.msg = cancelAjaxText;
        resolve(response.data);
      } else {
        resolve(response.data);
      }
    }).catch(err => {
      reject(err)
    });
  })
}