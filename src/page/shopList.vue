<template>
  <div class="shoplist_container">
    <!-- 搜索模块 -->
    <el-card>
      <el-form :model="ruleForm" :inline="true" ref="ruleFormRef">
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="店铺名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onReset('ruleFormRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表模块 -->
    <el-card class="table_container">
      <el-table :data="tableData">
        <el-table-column label=""></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import env from "./../config/env";
import { cityGuess, getRestaurants } from "../api/getData.js";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      ruleForm: {
        name: "",
      },
      tableData: [],
    };
  },
  methods: {
    onSubmit() {},
    onReset(form) {},
  },
};
</script>
<style lang="scss" scoped>
</style>