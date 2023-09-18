<template>
  <el-card>
    <el-row>
      <el-col :span="16" :offset="4">
        <header class="form_header">选择食品种类</header>
        <el-form
          :model="categoryForm"
          ref="categoryForm"
          label-width="110px"
          class="form"
        >
          <el-row class="category_select">
            <el-form-item label="食品种类">
              <el-select
                v-model="categoryForm.categorySelect"
                :placeholder="selectValue.label"
                style="width: 100%"
              >
                <el-option
                  v-for="item in categoryForm.categoryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getCategory } from "../api/getData.js";
import env from "../config/env.js";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
export default {
  components: {
    Plus,
  },
  data() {
    return {
      baseUrl: env.baseUrl,
      baseImgPath: env.baseImgPath,
      restaurant_id: 1,
      categoryForm: {
        categoryList: [],
        categorySelect: "",
        name: "",
        description: "",
      },
    };
  },
  created () {
    if(this.$route.query.restaurant_id){
      this.restaurant_id=this.$route.query.restaurant_id;
    }else {
      this.restaurant_id=Math.ceil(Math.random()*10);
      
    }
  },
  methods: {
    async initData() {
      try {
        const result = await getCategory(this.restaurant_id);
        if (result.status === 1) {
          result.category_list.map((item, index) => {
            item.value = index;
            item.label = item.name;
          });
          this.categoryForm.categoryList = result.category_list;
        } else {
          ElMessage.warning(result.message);
        }
      } catch (err) {
        ElMessage.warning(err.message);
      }
    },
  },
  computed: {
    selectValue: function () {
      return (
        this.categoryForm.categoryList[this.categoryForm.categorySelect] || {}
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>