import axios from 'axios';

var http = {};
http.install = function (Vue) {
    var axios_obj = axios.create({
        // 设置默
        baseURL: 'http://127.0.0.1:8888/',

    });
    Vue.prototype.$http = axios_obj;
}

export default http;