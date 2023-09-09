<template>
  <el-card>
    <el-row style="margin-top: 20px">
      <el-col :span="12" :offset="4">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="110px"
          class="demo-formData"
        >
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-autocomplete
              v-model="formData.address"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%"
              @select="addressSelect"
            ></el-autocomplete>
            <span>当前城市:{{ city.name }}</span>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model.number="formData.phone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="店铺简介" prop="description">
            <el-input
              v-model="formData.description"
              placeholder="请介绍你的店铺,让顾客更加了解我们"
            ></el-input>
          </el-form-item>
          <el-form-item label="店铺标语" prop="promotion_info">
            <el-input
              v-model="formData.promotion_info"
              placeholder="店铺高峰期或者店铺的宣传标语"
            ></el-input>
          </el-form-item>
          <el-form-item label="店铺分类">
            <el-cascader
              :options="categoryOptions"
              v-model="selectedCategory"
              change-on-select
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { cityGuess, addShop, searchplace } from "../api/getData.js";
import env from "../config/env.js";
import { Plus } from "@element-plus/icons-vue";

export default {
  components: {
    Plus,
  },
  data() {
    return {
      city: {},
      formData: {
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        description: "",
        phone: "",
        promotion_info: "", //高峰期标语
        float_delivery_fee: 5, //配送费
        float_minimum_order_amount: 20, //起配价
        is_premium: true, //品牌保证
        delivery_mode: true, //配送方式，默认官方配送方式
        new: true,
        bao: true,
        zhun: true,
        piao: true,
        startTime: "",
        endTime: "",
        image_path: "",
        business_license_image: "", //营业资格证照
        catering_service_license_image: "", //食品安全
      },
      rules: {
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { type: "number", message: "电话号码必须是数字" },
        ],
      },
      categoryOptions: [],
      selectedCategory: ["快餐便当", "简餐"],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.city = await cityGuess("guess");
        // const categories=
      } catch (err) {
        console.log(err);
      }
    },
    addressSelect(address) {
      this.formData.latitude = address.latitude;
      this.formData.longitude = address.longitude;
    },
    async querySearchAsync(querySting, cb) {
      if (querySting) {
        try {
          const cityList = await searchplace(this.city.id, querySting);
          if (cityList instanceof Array) {
            cityList.map((item) => {
              item.value = item.address;
              return item;
            });
            cb(cityList);
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
</style>