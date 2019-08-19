// import { createBrowserHistory } from 'history';
import axios from 'axios';
// const history = createBrowserHistory();

// 新建一个请求拦截器
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    var token = window.localStorage.getItem("token");
    // var token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJaT1JLLi4uREFUQSIsInN1YiI6IjIiLCJuaWNrbmFtZSI6IlpPUktEQVRBIiwiZXhwIjoxNTM1OTY2OTYzLCJpYXQiOjE1MzU5MzgxNjMsImp0aSI6IjJiM2RkMWYwLWUwN2UtNDQyYy1iZmJiLTJjZTcwNjY2MzJmZiIsInVzZXJuYW1lIjoiWk9SSyJ9.bHqK0rgyUOBN4_3EdElNPyzyJvXfgXG7HNOiuNr_dzQ';
    if (token) {
        config.headers.common['token'] = token;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// 新建一个响应拦截器
axios.interceptors.response.use(function (response) {
    // Do something with response data
    //token 过期处理
    if ((response.data.code === -1 && response.data.msg === 'access token is empty') || response.data.code === 40002) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        window.localStorage.removeItem("userNameCn");
        window.localStorage.removeItem("deptNameCn");
        window.localStorage.removeItem("isAdmin");
        console.log(window.myReact);
        let historyUrl = window.localStorage.getItem('historyUrl');
        if (!historyUrl) {
            window.localStorage.setItem('historyUrl', window.myReact.location.pathname + window.myReact.location.search);
        }
        response.data.msg = '登录过期，请重新登录';
        window.myReact.history.replace('/login');
        // window.location.hash = 'login';
    }
    return response;

}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});