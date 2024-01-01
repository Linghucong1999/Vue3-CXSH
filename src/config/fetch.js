import env from './env.js';
export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
    type = type.toUpperCase();
    url = url.startsWith('https') || url.startsWith('http') ? url : env.baseUrl + url
    // url = env.baseUrl + url;
    if (type === 'GET') {
        let dataStr = ''; //数据拼接
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        })
        if (dataStr !== '') {
            dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    }

    if (window.fetch && method === 'fetch') {
        let requestConfig = {
            credentials: 'include',
            method: type,
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
            // cache: 'force-cache',
            cache: 'default',
        }

        if (type === 'POST') {
            if (data instanceof FormData) {
                //如果请求体是FormData对象，则设置请求头为multipart/form-data
                requestConfig.headers['Content-Type'] = 'multipart/form-data';
                requestConfig.body = data;
            } else {
                requestConfig.headers['Content-Type'] = 'application/json';
                requestConfig.body = JSON.stringify(data);
            }
        }
        try {
            const response = await fetch(url, requestConfig);
            const responseJson = await response.json();
            return responseJson;
        } catch (err) {
            throw new Error(err);
        }
    }
    else {
        return new Promise((resolve, reject) => {
            let requestObj;
            if (window.XMLHttpRequest) {
                requestObj = new XMLHttpRequest();
            } else {
                requestObj = new ActiveXObject;
            }

            let sendData = '';
            if (type === 'POST') {
                if (data instanceof FormData) {
                    //如果请求体是FormData对象，则设置请求头为multipart/form-data
                    requestConfig.headers['Content-Type'] = 'multipart/form-data';
                    requestConfig.body = data;
                } else {
                    requestConfig.headers['Content-Type'] = 'application/json';
                    requestConfig.body = JSON.stringify(data);
                }

            } else {
                requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                sendData = JSON.stringify(data);
            }

            requestObj.open(type, url, true);

            requestObj.send(sendData);

            requestObj.onreadystatechange = () => {
                if (requestObj.readyState === 4) {
                    if (requestObj.status === 200) {
                        let obj = requestObj.response;
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj);
                    } else {
                        reject(requestObj);
                    }
                }
            }
        })
    }
}