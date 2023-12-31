<template>
  <div class="shoplist_container">
    <!-- 搜索模块 -->
    <el-card>
      <el-form :model="ruleForm" :inline="true" ref="ruleFormRef">
        <el-form-item label="店铺名称" prop="name">
          <el-autocomplete v-model="ruleForm.name" placeholder="店铺名称" @select="nameSelect"
            :fetch-suggestions="querySelectName"></el-autocomplete>
          <!-- <el-input v-model="ruleForm.name" placeholder="店铺名称"></el-input> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onReset('ruleFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表模块 -->
    <el-card class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称:">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺地址:">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺介绍:">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID:">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="联系电话:">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="评分:">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="销售量:">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="分类:">
                <span>{{ props.row.category }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="name"></el-table-column>
        <el-table-column label="店铺介绍" prop="description"></el-table-column>
        <el-table-column label="操作" width="400">
          <template #default="scope">
            <el-button size="small" @click="handleEadit(scope.$index, scope.row)">编辑店铺</el-button>
            <el-button type="success" size="small" @click="addFood(scope.$index, scope.row)">编辑食品</el-button>
            <el-button type="success" size="small" @click="showListOrder(scope.$index, scope.row)">查看订单</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除店铺</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="Pagination">
        <el-pagination :total="count" :current-page="currentPage" :page-size="20" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" layout="->, total, prev, pager, next, jumper"></el-pagination>
      </div>

      <!-- 弹出编辑模块 -->
      <el-dialog title="修改店铺信息" v-model="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="店铺名称" label-width="100px">
            <el-input v-model="selectTable.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" label-width="100px">
            <el-autocomplete v-model="address.address" placeholder="请输入地址" style="width: 100%" @select="addressSelect"
              :fetch-suggestions="querySearchAsync"></el-autocomplete>
            <span>当前城市:{{ city.name }}</span>
          </el-form-item>
          <el-form-item label="店铺介绍" label-width="100px">
            <el-input v-model="selectTable.description" placeholder="你的店铺简介"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="selectTable.phone" placeholder="联系电话"></el-input>
          </el-form-item>
          <el-form-item label="店铺分类" label-width="100px">
            <el-cascader :options="categoryOptions" v-model="selectCategory"></el-cascader>
          </el-form-item>
          <el-form-item label="商铺图片" label-width="100px">
            <el-upload :action="baseUrl + '/v1/addimg/shop'" class="avatar-uploader" :show-file-list="true"
              :on-success="handleShopAvatarScucess" :before-upload="beforeAvatarUpload" :limit="1"
              :on-exceed="handleExceed" :on-remove="handleRemove" list-type="picture-card" :on-preview="handlePreview">
              <el-icon>
                <Plus></Plus>
              </el-icon>
            </el-upload>
            <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar-img" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <slot name="footer">
            <el-button type="warning" @click="dialogFormVisible = false">取消</el-button>
            <el-button type="success" @click="updeteShop">确定</el-button>
          </slot>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import env from "./../config/env";
import {
  cityGuess,
  getRestaurants,
  getRestaurantCount,
  foodCategory,
  deleteRestaurant,
  searchplace,
  deleteImg,
  updataShop,
  getRestaurantDetail,
  searchShop,
  getRestaurantNameDetail,
} from "../api/getData.js";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { getCurrentInstance, reactive, watch } from "vue";

export default {
  components: {
    Plus,
  },
  data() {
    return {
      ruleForm: {
        name: "",
      },
      baseUrl: env.baseUrl,
      baseImgPath: env.baseImgPath,
      tableData: [],
      city: {},
      count: 0,
      offset: 0,
      limit: 20,
      selecthot: "guess",
      selectTable: {},
      dialogFormVisible: false,
      selectCategory: [],
      categoryOptions: [],
      currentPage: 1,
      address: {},
      dialogVisible: false,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    //数据初始化
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
    //获取店铺信息
    async getResturants() {
      const { latitude, longitude } = this.city;
      const restaurant = await getRestaurants({
        latitude,
        longitude,
        offset: this.offset,
        limit: this.limit,
      });
      let tempData = [];
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
        tempData.push(tableDataobj);
      });
      this.tableData = reactive(tempData);
    },
    //获取特定的店铺
    async getRestaurantData(id) {
      const res = await getRestaurantDetail(id);
      const tableDataobj = {
        name: res.name,
        address: res.address,
        description: res.description,
        id: res.id,
        phone: res.phone,
        rating: res.rating,
        recent_order_num: res.recent_order_num,
        category: res.category,
        image_path: res.image_path,
      };
      this.tableData.map((item, index) => {
        if (item.id === id) {
          item = tableDataobj;
        }
      });
    },
    //获取食品种类
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
    //编辑店铺
    handleEadit(index, row) {
      this.selectTable = row;
      this.address.address = row.address;
      this.dialogFormVisible = true;
      this.selectCategory = row.category.split("/");
      if (!this.categoryOptions.length) {
        this.getCategory();
      }
    },
    //添加食品种类
    addFood(index, row) {
      this.$router.push({ path: "addGoods", query: { restaurant_id: row.id } });
    },
    showListOrder(index, row) {
      this.$router.push({ path: 'orderList', query: { restaurant_id: row.id } });
    },
    //删除店铺
    async handleDelete(index, row) {
      try {
        const res = await deleteRestaurant(row.id);
        if (res.status === 1) {
          ElMessage.success("删除店铺成功");
          this.tableData.splice(index, 1);
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        ElMessage.warning(err.message);
      }
    },
    async onSubmit() {
      let newshop = await getRestaurantNameDetail(this.ruleForm.name);
      let res = newshop.restaurantNmae;
      if (newshop.status === 1) {
        this.tableData = [];
        const tableDataobj = {
          name: res.name,
          address: res.address,
          description: res.description,
          id: res.id,
          phone: res.phone,
          rating: res.rating,
          recent_order_num: res.recent_order_num,
          category: res.category,
          image_path: res.image_path,
        };
        this.tableData.push(tableDataobj);
        this.count = 1;
      } else {
        ElMessage.error("数据出错，请尽快联系超级管理员");
      }
    },
    onReset(form) {
      this.$refs[form].resetFields();
      this.ruleForm.name = "";
      this.initData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getResturants();
    },
    handleSizeChange(val) {
      console.log("每页" + val + "条");
    },
    addressSelect(value) {
      const { address, latitude, longitude } = value;
      this.address = { address, latitude, longitude };
    },
    //搜索框地址查询
    async querySearchAsync(querystring, cb) {
      if (querystring) {
        try {
          const cityList = await searchplace(this.city.id, querystring);
          if (cityList instanceof Array) {
            cityList.map((item) => {
              item.value = item.address;
              return item;
            });
            cb(cityList);
          }
        } catch (err) {
          ElMessage.warning("地址查询失败");
        }
      }
    },
    //搜索完店铺进行赋值
    async nameSelect(value) {
      this.ruleForm.name = value.name;
    },
    //搜索店铺
    async querySelectName(querystring, cb) {
      if (querystring) {
        let res = await searchShop(querystring);
        if (res.shopname instanceof Array) {
          res.shopname.forEach((item) => {
            item.value = item.name;
            return item;
          });
          cb(res.shopname);
        } else {
          cb("没有这个店铺");
        }
      }
    },

    async handleRemove(files) {
      // console.log(files);
      const filedata = { imgname: this.selectTable.image_path };
      const res = await deleteImg(filedata);
      if (res.status === 1) {
        this.selectTable.image_path = "";
        ElMessage.success(res.message);
      }
    },

    handleExceed(files) {
      ElMessage.warning("只能上传一张图片");
    },

    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isRightType) {
        ElMessage.error("上传的图片只能是png格式或者jpg格式");
      }
      if (!isLt2M) {
        ElMessage.error("上传的头像大小不能超过2兆");
      }
      return isRightType && isLt2M;
    },
    handleShopAvatarScucess(res, file) {
      if (res.status === 1) {
        this.selectTable.image_path = res.image_path;
      } else {
        ElMessage.error("上传店铺头像失败");
      }
    },
    handlePreview(files) {
      this.dialogImageUrl = this.baseImgPath + this.selectTable.image_path;
      this.dialogVisible = true;
    },
    //更新店铺
    async updeteShop() {
      try {
        Object.assign(this.selectTable, this.address);
        this.selectTable.category = this.selectCategory.join("/");
        const res = await updataShop(this.selectTable);
        if (res.status === 1) {
          await this.getRestaurantData(this.selectTable.id);
          // this.tableData=[];
          // await this.getResturants();
          ElMessage.success("更新店铺成功");
          this.dialogFormVisible = false;
        } else {
          ElMessage.error(res.message);
        }
      } catch (err) {
        console.log("更新店铺", err);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.shoplist_container {
  .el-form-item {
    margin-right: 15px;
    margin-bottom: 0;
  }

  .table_container {
    margin-top: 20px;

    .Pagination {
      margin-top: 20px;
    }
  }
}

.demo-table-expand {
  margin-left: 60px;
}

// .demo-table-expand label{
//   width: 90px;
//   color:#99a9bf;
// }
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.table_container {
  padding: 10px;
}

.avatar-img {
  margin-left: 20px;
  display: inline-block;
}
</style>