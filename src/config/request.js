import axios from "axios";
import env from "./env";
import { ElMessage } from "element-plus";

const ERR = '数据异常'

export default function request(url, data = {}, type = 'GET') {
    return new Promise((resolve,reject)=>{
        //执行异步ajax
        let promise;
        type=type.toUpperCase();
        url=env.baseUrl+url;
        if(type==='GET'){
            //准备 url query 参数数据
            let dataStr=''
            Object.keys(data).forEach(key=>{
                dataStr+=key+'='+data[key]+'&';
            })
            if(dataStr!==''){
                dataStr=dataStr.substring(0,dataStr.lastIndexOf('&'));
                url=url+'?'+dataStr;
            }

            //发送get请求
            promise=axios.get(url);
        }else{
            promise=axios.post(url,data);
        }

        promise.then((response)=>{
            //成功就调用resolve
            resolve(response.data);
        }).catch((err)=>{
            ElMessage.error(ERR);
            reject(err);
        })
    })
}