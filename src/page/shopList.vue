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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="销售量">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="name"></el-table-column>
        <el-table-column label="店铺介绍" prop="description"></el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEadit(scope.$index, scope.row)"
              >编辑店铺</el-button
            >
            <el-button
              type="success"
              size="small"
              @click="addFood(scope.$index, scope.row)"
              >编辑食品</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.$index, scope.row)"
              >删除店铺</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="Pagination">
        <el-pagination
          :total="count"
          :current-page="currentPage"
          :page-size="20"
          @current-change="handleCurrentChange"
          layout="->, total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import env from "./../config/env";
import {
  cityGuess,
  getRestaurants,
  getRestaurantCount,
  getCategory,
  foodCategory,
  deleteRestaurant,
} from "../api/getData.js";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      ruleForm: {
        name: "",
      },
      tableData: [],
      city: {},
      count: 0,
      offset: 0,
      limit: 20,
      selecthot: "guess",
      selectTable: {},
      address: {},
      dialogFormVisible: false,
      selectCategory: [],
      categoryOptions: [],
      currentPage: 1,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        //默认guess 火爆城市hot
        this.city = await cityGuess("guess");

        const countData = await getRestaurantCount();
        if (countData.status === 1) {
          this.count = countData.count;
        } else {
          throw new Error("获取数据失败");
        }
        this.getResturants();
      } catch (err) {
        ElMessage.warning(err.message);
      }
    },
    async getResturants() {
      const { latitude, longitude } = this.city;
      const restaurant = await getRestaurants({
        latitude,
        longitude,
        offset: this.offset,
        limit: this.limit,
      });
      this.tableData = [];
      restaurant.forEach((item) => {
        const tableDataobj = {};
        tableDataobj.name = item.name;
        tableDataobj.address = item.address;
        tableDataobj.description = item.description;
        tableDataobj.id = item.id;
        tableDataobj.phone = item.phone;
        tableDataobj.rating = item.rating;
        tableDataobj.recent_order_num = item.recent_order_num;
        tableDataobj.category = item.category;
        tableDataobj.image_path = item.image_path;
        this.tableData.push(tableDataobj);
      });
    },
    async getCategory() {
      try {
        const categories = await foodCategory();
        categories.forEach((item) => {
          if (item.sub_categories.length) {
            const addnew = {
              value: item.name,
              label: item.name,
              children: [],
            };
            item.sub_categories.forEach((subitem, index) => {
              if (index === 0) {
                return;
              }
              addnew.children.push({
                value: subitem.name,
                label: subitem.name,
              });
            });
            this.categoryOptions.push(addnew);
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    handleEadit(index, row) {
      this.selectTable = row;
      this.address.address = row.address;
      this.dialogFormVisible = true;
      this.selectCategory = row.category.split("/");
      if (!this.categoryOptions.length) {
        this.getCategory();
      }
    },
    addFood(index, row) {
      this.$router.push({ path: "addGoods", query: { restaurant_id: row.id } });
    },
    handleDelete(index, row) {},
    onSubmit() {},
    onReset(form) {},
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getResturants();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>