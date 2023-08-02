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

## 模块化设计
**Navhead:**(Head and footer not listed)

![侧边导航](/public/NavLeft.png)!

## &#x1F3A6;工具类
新增了一些公用方法，用于处理时间，千百分位数字的处理，位于`utils`

## &#x1F349; 更新Echarts图表，数据更加直观
将组件全部分开来，尽量将核心代码控制在300行左右，将方法分开写，控制好代码量。在首页的Echarts图表，基本都是一行一个新的目录，避免造成拥挤的局面，后续维护也可以快速维护

## 为什么存在view和page两个文件
因为写多了uniapp，习惯的将page当目录页，问题不大，打包的时候去掉就行了，还有**static**文件没有用的记得！