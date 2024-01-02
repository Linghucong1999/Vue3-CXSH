<template>
    <div>
        <div id="main" style="height:600px;width:500px"></div>
    </div>
</template>
<script>
import { getUserCity } from '../api/getData';
import chinaMap from '@/assets/js/Map/china.json';
export default {
    data() {
        return {
            ROOT_PATH: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
            option: {
                geo: {
                    map: 'china',
                    
                },
                
            }
        }
    },
    mounted() {
        this.getMapJson();
    },
    methods: {
        async getMapJson() {
            this.$echarts.registerMap('china', chinaMap)
            let mapCharts = this.$echarts.init(document.getElementById('main'));
            mapCharts.setOption(this.option)
        }
    }
}

</script>
<style lang="scss" scoped></style>