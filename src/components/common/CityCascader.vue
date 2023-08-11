<template>
  <div class="warp">
    <el-cascader
      v-model="cityData"
      :options="option"
      :props="{ expandTrigger: 'hover' }"
      @change="cityDataFrom"
    ></el-cascader>
  </div>
</template>

<script>
import { getFindCity, getLowerCity } from "../../api/getData";
export default {
  data() {
    return {
      cityForm: [],
      provincialCity: [], //省级市
      prefectureLevelCity: [], //地级市
      lowerCity: [],
      option: [],
      cityData: [], //省级市数据选择，后期获取定位需用
    };
  },
  methods: {
    async initData() {
      let res = await getFindCity();
      this.cityForm = res.resault;
      await this.classification();
    },
    async classification() {
      if (this.cityForm.length !== 0) {
        [this.provincialCity, this.prefectureLevelCity, this.lowerCity] =
          this.cityForm;
      }
      await this.groupcity();
    },
    async groupcity() {
      const optionMap = new Map();
      await Promise.all([
        this.provincialCity.forEach((province) => {
          const optionValue = {
            value: province.name,
            label: province.fullname,
            children: [],
          };
          optionMap.set(province.id.substring(0, 2), optionValue);
        }),

        this.prefectureLevelCity.forEach((city) => {
          const provinceId = city.id.substring(0, 2);
          if (optionMap.has(provinceId)) {
            const provinceOption = optionMap.get(provinceId);
            const optionValue = {
              id: city.id,
              value: city.name,
              label: city.fullname,
              children: [],
            };
            provinceOption.children.push(optionValue);
          }
        }),
        this.lowerCity.forEach((lowercity, index) => {
          const cityId = lowercity.id.substring(0, 2);
          if (optionMap.has(cityId)) {
            const lowerValue = optionMap.get(cityId);
            lowerValue.children.forEach((item) => {
              if (this.isString(item.id, lowercity.id, 4)) {
                const optionValue = {
                  value: lowercity.fullname,
                  label: lowercity.fullname,
                };
                item.children.push(optionValue);
              }
            });
          }
        }),
      ]);
      this.option = Array.from(optionMap.values());
    },
    isString(a, b, num) {
      if (a.substring(0, num) === b.substring(0, num)) {
        return true;
      } else {
        return false;
      }
    },
    cityDataFrom(value) {
      //对列表进行筛选显示，后续写，API没有写完
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
<style lang="scss" scoped>
</style>