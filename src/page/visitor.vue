<template>
    <div class="center-main" v-loading="loading">
        <div id="main"></div>
    </div>
</template>
<script>
import { getUserCity } from '../api/getData';
import chinaMap from '@/assets/js/Map/china.json';
export default {
    data() {
        return {
            ROOT_PATH: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
            cityData: [],
            loading: true,
            tatolPopulation: 0,
        }
    },
    created() {
        this.getChinaCity();
    },
    mounted() {
        this.getMapJson();
    },
    methods: {
        async getMapJson() {

            let mapCharts = this.$echarts.init(document.querySelector('#main'));
            this.$echarts.registerMap('china', chinaMap)

            let res = await getUserCity();
            if (res.status === 0) {
                this.$message.warring(res.message);
                return;
            }
            let option = {
                // geo: {
                //     zoom:1.2,
                //     map:'china',
                // },
                title: {
                    text: '用户分布',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: params => {
                        return `${params.name}<br/>${params.value ? params.value.toLocaleString() : '-'} (人)<br/>
                        全国用户占比：${params.value ? (params.value / this.tatolPopulation * 100).toFixed(2) : '-'}%`    //toLocaleString()千位分割符函数
                    }
                },
                visualMap: {
                    min: 0,
                    max: 50000,
                    text: ['密度高', '密度底'],
                    realtime: false,
                    calculated: true,
                },
                series: [{
                    name: '厨鲜生用户全国分布图',
                    type: 'map',
                    map: 'china',
                    data: this.cityData,
                    zoom: 1.2,

                }]
            }
            mapCharts.setOption(option);
            this.loading = false;


        },
        async getChinaCity() {
            const cityNames = chinaMap.features.map(item => item.properties.name);
            cityNames.forEach(item => {
                this.cityData.push({
                    name: item,
                    value: Math.floor(Math.random() * 90699),
                })
            })

            this.cityData.forEach(item => {
                this.tatolPopulation += item.value;
            })
        },
    }
}

</script>
<style lang="scss" scoped>
.center-main {
    display: flex;
    justify-content: center;
    background-color: #fff;

    #main {
        width: 500px;
        height: 500px;
        padding: 20px;
    }
}
</style>