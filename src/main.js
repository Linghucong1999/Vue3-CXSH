import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as echarts from 'echarts'

const app = createApp(App)
app.config.productionTip = false
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(echarts)


app.mount('#app')
app.config.globalProperties.$echarts=echarts