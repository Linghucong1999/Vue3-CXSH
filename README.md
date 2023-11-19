- [vue3-elm-admin](#vue3-elm-admin)
  - [项目clone下来记得](#项目clone下来记得)
    - [项目运行](#项目运行)
    - [根目录下的public提交说明错误](#根目录下的public提交说明错误)
  - [🎦工具类](#工具类)
  - [🍉 更新Echarts图表，数据更加直观](#-更新echarts图表数据更加直观)
  - [为什么存在view和page两个文件](#为什么存在view和page两个文件)
  - [🍎 这次我对element-plus的级联选择器二次封装](#-这次我对element-plus的级联选择器二次封装)
  - [🍎 新增输入字段可以输出相对应的地址（仅限所在IP区域的地址出现）](#-新增输入字段可以输出相对应的地址仅限所在ip区域的地址出现)
  - [🍎 对于提交From表单的验证规则，用户未填写，前端如何处理？](#-对于提交from表单的验证规则用户未填写前端如何处理)
    - [前言](#前言)
    - [正言](#正言)
  - [🍎 对原生的Fetch封装成类axios](#-对原生的fetch封装成类axios)
    - [⚡️ axios简介](#️-axios简介)
    - [✍️ 封装过程](#️-封装过程)
  - [⚡️强制缓存的坑](#️强制缓存的坑)
    - [✍️ 解决方案](#️-解决方案)
  - [✍️心血来潮，小写一个防抖函数](#️心血来潮小写一个防抖函数)

# vue3-elm-admin

厨生鲜后台管理系统


## 项目clone下来记得

```sh
npm install
```

### 项目运行

```sh
npm run dev
```


### 根目录下的public提交说明错误
public公共文件，导航图标



## &#x1F3A6;工具类
新增了一些公用方法，用于处理时间，千百分位数字的处理，位于`utils`

## &#x1F349; 更新Echarts图表，数据更加直观
将组件全部分开来，尽量将核心代码控制在300行左右，将方法分开写，控制好代码量。在首页的Echarts图表，基本都是一行一个新的目录，避免造成拥挤的局面，后续维护也可以快速维护

## 为什么存在view和page两个文件
因为写多了uniapp，习惯的将page当目录页，问题不大，打包的时候去掉就行了，还有**static**文件没有用的记得！

## &#x1F34E; 这次我对element-plus的级联选择器二次封装

在大多数对```element-plus```的二次封装的城市选择器，大多都是臃肿不堪，他们把省级市等全封装在一个Json表中，这无疑当`npm i`的时候，为文件增加了许多负担，而我在后端封装好响应的接口，因为使用的是腾讯地图API，一下子就放回给前端6000条数据，非常庞大，前端如何处理才会让数据渲染的时候而不造成页面卡顿；

## &#x1F34E; 新增输入字段可以输出相对应的地址（仅限所在IP区域的地址出现）
前端输入相关的关键字，后端进行处理请求，然后向腾讯API进行请求，获取相对应的地址数据，由服务器放回给前端，前端可以对数据进行清洗再显示给用户知晓，也可以不清洗，直接返回；

## &#x1F34E; 对于提交From表单的验证规则，用户未填写，前端如何处理？

### 前言
我们在使用`element-plus`的`Form`表单验证的时候，虽然已经定义过了`rules`,然后我们通过规则验证去判断用户是否填了必填选项，然后我们进行一定的逻辑处理，相关的的逻辑处理都是提示。但是如果必填选项太多了，老是跳提示框真的很烦，让用户体验感非常差，所以就有了另一种解法——**表单跳转**

### 正言
```Vue3
          <el-form-item label="店铺名称" prop="name" id="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address" id="address">
            <el-autocomplete v-model="formData.address"></el-autocomplete>
            <span>当前城市:{{ city.name }}</span>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" id="phone">
            <el-input v-model.number="formData.phone" maxlength="11"></el-input>
          </el-form-item
          
          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')"
              >立即创建</el-button
            >
          </el-form-item>
```

开始定义方法（*先明确我这里的表单的ref="formData"*）
```JavaScript
submitForm(formName) {
      const form=this.$refs[formName];
      const valid = form.validate();
      valid.then().catch(err=>{
        let elementId=[];
        for(let value of Object.entries(err)){
          elementId.push(form.$el.querySelector(`#${value[0]}`));
        }
        elementId[0].scrollIntoView({behavior:'smooth',block:'start'});
      })
    }
```
```JavaScript
const form=this.$refs[formName]  //简单抽离
```
下面拿到Promise状态，如果必填选项没有填写，就好reject状态
```JavaScript
const valid = form.validate(); //简单抽离
```
捕捉到的err就是规则定义中的字段，我们只需要拿到其中的字段就可以通过`querySelector`拿到其中的`Element`，然后我们使用`scrollIntoView`进行跳转，就可以定位到了未填写的字段了
```JavaScript
valid.then().catch(err=>{ 
    let elementId=[];  
    for(let value of Object.entries(err)){
        elementId.push(form.$el.querySelector(`#${value[0]}`)); 
    } 
    elementId[0].scrollIntoView({behavior:'smooth',block:'start'});
})
```

## &#x1F34E; 对原生的Fetch封装成类axios
哈哈哈哈，标题够吓人的了，其实就是简单的封装判断用什么请求头而已；
### &#x26A1;&#xFE0F; axios简介
&#8195;&#8195;`Axios`是基于`XMLHttpRequest`的一个库。它可以用在浏览器和nodejs中，同时支持promise和回调的方式调用api接口。
### &#x270D;&#xFE0F; 封装过程
直接判断表单数据是否是FormData，是的话就设置请求头为`multipart/form-data`,不是的话就设置成`application/json`;
```javascript
if (window.fetch && method === 'fetch') {
        let requestConfig = {
            credentials: 'include',
            method: type,
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
            cache: 'force-cache'
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
    }else{
        //...省略部分代码
    }
```

## &#x26A1;&#xFE0F;强制缓存的坑
本来封装好的fetch，在请求头设置`cache: 'force-cache'`，结果发现，强缓浏览器会选择本地缓存进行请求，而不是发出请求，导致一些新数据会无法及时更新到当前页面；
### &#x270D;&#xFE0F; 解决方案
在请求头设置`cache: 'default'`，这样fetch会根据浏览器的缓存机制判断当前的网页是否进行缓存；
```javascript
if (window.fetch && method === 'fetch') {
        let requestConfig = {
            credentials: 'include',
            method: type,
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
            cache: 'default'
        }
}
```
## &#x270D;&#xFE0F;心血来潮，小写一个防抖函数

```JavaScript
async querySearch(queryString, cb) {
      clearTimeout(this.timer); //清除计时器
      if (queryString) {  //搜索字段
        this.timer = setTimeout(async () => { //创建计时器
          let res = await searchFood(queryString);  //向服务器发送请求
          if (res.foodname instanceof Array) {
            res.foodname.forEach((item) => {
              item.value = item.name;
              return item;
            });
            cb(res.foodname);
          } else {
            res.foodname.value = "搜索失败";
            cb(res.foodname);
          }
        }, 500);  //定500ms
      }
    },
```

       