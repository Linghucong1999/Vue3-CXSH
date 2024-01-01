<template>
    <div>
        <v-chart></v-chart>
    </div>
</template>
<script>
import { getUserCity } from '../api/getData';
import chinaMap from '@/assets/js/Map';
export default {
    data() {
        return {
            ROOT_PATH: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
        }
    },
    created() {
        this.getMapJson();
    },
    methods: {
        async getMapJson() {
            
        }
    }
}

</script>
<style lang="scss" scoped></style>