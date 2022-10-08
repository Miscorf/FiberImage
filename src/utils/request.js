
import axios from 'axios'
 //let baseURL = 'http://192.168.232.128:9006/'

let baseURL = 'http://localhost:9088/'
const instance = axios.create({
    baseURL,
    timeout : 600
})

// 请求拦截
instance.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject( error );
    }
);

// 响应拦截
instance.interceptors.response.use( res => {
    if ( res.status == 200 ){
        return res;
    } else {
        return Promise.reject( res.data.msg );
    }
});

// 自定义适配器 ， 适配uniapp语法
// axios.defaults.adapter = function( config ) {
//     return new Promise( ( resolve , reject ) => {
//         let settle = require('axios/lib/core/settle');
//         let buildURL = require('axios/lib/helpers/buildURL');
//         uni.request({
//             method : config.method.toUpperCase(),
//             url : config.baseURL + buildURL( config.url , config.params , config.paramsSerializer ),
//             header : config.headers,
//             data : config.data,
//             dataType : config.dataType,
//             responseType : config.responseType,
//             sslVerify : config.sslVerify,
//             complete : function complete( response ) {
//                 response = {
//                     data : response.data,
//                     status : response.statusCode,
//                     errMsg : response.errMsg,
//                     header : response.header,
//                     config : config
//                 };
//             settle( resolve , reject , response );
//             },
//         });
//     })
// }

export default instance