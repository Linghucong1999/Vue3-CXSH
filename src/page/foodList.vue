<template>
  <div class="foodlist_container">
    <el-card>
      <el-form :model="ruleForm" :inline="true" ref="ruleFormref">
        <el-form-item label="食品名称：" prop="name">
          <!-- <el-input placeholder="食品名称" v-model="ruleForm.name"></el-input> -->
          <el-autocomplete v-model="ruleForm.name" placeholder="食品名称" @select="nameSelect"
            :fetch-suggestions="querySearch"></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onReset('ruleFormref')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table_container">
      <el-table :data="tableData" :expand-row-keys="expandRow" style="width: 100%" :row-key="(row) => row.index"
        @expand-change="expand">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="食品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="餐馆名称">
                <span>{{ props.row.restaurant_name }}</span>
              </el-form-item>
              <el-form-item label="食品 ID">
                <span>{{ props.row.item_id }}</span>
              </el-form-item>
              <el-form-item label="餐馆 ID">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="食品介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="餐馆地址">
                <span>{{ props.row.restaurant_address }}</span>
              </el-form-item>
              <el-form-item label="食品评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="月销量">
                <span>{{ props.row.month_sales }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="食品名称" prop="name"></el-table-column>
        <el-table-column label="食品介绍" prop="description"></el-table-column>
        <el-table-column label="评分" prop="rating"></el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="Pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-size="20" layout="->, total, prev, pager, next, jumper" :total="count"></el-pagination>
      </div>

      <el-dialog title="修改食品信息" v-model="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="食品名称" label-width="100">
            <el-input v-model="selectTable.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="食品介绍" label-width="100">
            <el-input v-model="selectTable.description"></el-input>
          </el-form-item>
          <el-form-item label="食品分类" label-width="100">
            <el-select v-model="selectIndex" :placeholder="selectMenu.label" @change="handleSelect">
              <el-option v-for="item in menuOptions" :label="item.lable" :value="item.index"
                :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="食品图片" label-width="100px">
            <el-upload :action="baseUrl + '/v1/addimg/food'" class="avatar-uploader" :show-file-list="true"
              :on-success="handleShopAvatarScucess" :before-upload="beforeAvatarUpload" :limit="1"
              :on-exceed="handleExceed" :on-remove="handleRemove" list-type="picture-card" :on-preview="handlePreview">
              <el-icon>
                <Plus></Plus>
              </el-icon>
            </el-upload>
            <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar-img" />
          </el-form-item>
        </el-form>
        <el-row style="overflow:auto;text-align:center;">
          <el-table :data="specslist" style="margin-bottom:20px;" :row-class-name="tableRowClassName">
            <el-table-column label="规格" prop="specs"></el-table-column>
            <el-table-column label="包装费" prop="packing_fee"></el-table-column>
            <el-table-column label="价格" prop="price"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="danger" size="small" @click="deleteSpecs(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="specsFormVisible = true" style="margin-bottom:10px;">添加规格</el-button>
        </el-row>
        <div class="dialog-footer">
          <slot name="footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="updataFoodlist">确定</el-button>
          </slot>
        </div>
      </el-dialog>
      <el-dialog title="添加规格" v-model="specsFormVisible">
        <el-form :rules="specsFormrules" :model="specsForm">
          <el-form-item label="规格" label-width="100px" prop="specs">
            <el-input v-model="specsForm.specs" autocomplete="off" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="包装费" label-width="100px">
            <el-input-number v-model="specsForm.packing_fee" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="价格" label-width="100px">
            <el-input-number v-model="specsForm.price" :min="0" :max="10000"></el-input-number>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <slot name="footer">
            <el-button @click="specsFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addspecs">确定</el-button>
          </slot>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import env from "../config/env";
import {
  searchFood,
  getFoods,
  getFoodCount,
  getRestaurantDetail,
  getMenuDetail,
  getMenu,
  deleteFood,
  deleteImg,
  updataFood,
} from "../api/getData";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { beforeAvatar } from "../utils/imgconfig";
export default {
  components: {
    Plus,
  },
  data() {
    return {
      ruleForm: {
        name: "",
      },
      timer: null,
      baseUrl: env.baseUrl,
      baseImgPath: env.baseImgPath,
      restaurant_id: undefined,
      city: {},
      offset: 0,
      limit: 20,
      count: 0,
      tableData: [],
      expandRow: [],
      selectTable: {},
      selectMenu: {},
      menuOptions: [],
      dialogFormVisible: false,
      currentPage: 1,
      selectIndex: null,
      specsFormVisible: false,
      specsFormrules: {
        specs: [
          { required: true, message: '请输入规格', trigger: 'blur' },
        ]
      },
      specsForm: {
        specs: '',
        packing_fee: 0,
        price: 20,
      },
      specslist: []
    };
  },
  created() {
    if (this.$route.query.restaurant_id) {
      this.restaurant_id = this.$router.query.restaurant_id;
    }
    this.initData();
  },
  // computed: {
  //   specslist: function () {
  //     let specs = [];
  //     let specfoodsDetail = this.selectTable.specfoods;
  //     if (specfoodsDetail) {
  //       specfoodsDetail.forEach(item => {
  //         specs.push({
  //           specs: item.specs_name,
  //           packing_fee: item.packing_fee,
  //           price: item.price,
  //         })
  //       })
  //     }
  //     return specs;
  //   },
  // },
  methods: {
    async initData() {
      try {
        const countDatas = await getFoodCount(this.restaurant_id);
        if (countDatas.status === 1) {
          this.count = countDatas.count;
          this.getFoods();
        } else {
          throw new Error("获取数据失败");
        }
      } catch (err) {
        ElMessage.error(err.message);
      }
    },
    async getFoods() {
      const Foods = await getFoods(this.restaurant_id, this.offset, this.limit);
      this.tableData = [];
      Foods.forEach((item, index) => {
        const tableDatas = {};
        tableDatas.name = item.name;
        tableDatas.item_id = item.item_id[0];
        tableDatas.description = item.description;
        tableDatas.rating = item.rating;
        tableDatas.month_sales = item.month_sales;
        tableDatas.restaurant_id = item.restaurant_id;
        tableDatas.category_id = item.category_id;
        tableDatas.image_path = item.image_path;
        tableDatas.specfoods = item.specfoods;
        tableDatas.index = index;
        this.tableData.push(tableDatas);
      });
    },
    nameSelect(value) {
      this.ruleForm.name = value.name;
    },
    //搜索食品
    async querySearch(queryString, cb) {
      clearTimeout(this.timer); //清除计时器
      if (queryString) {
        this.timer = setTimeout(async () => {
          let res = await searchFood(queryString);
          if (res.foodname instanceof Array) {
            res.foodname.forEach((item) => {
              item.value = item.name;
              return item;
            });
            cb(res.foodname);
          } else {
            res.foodname.value = "搜索失败";
            cb(res.foodname);
          }
        }, 500);
      }
    },
    expand(row, status) {
      if (status.length) {
        this.getSelectItemData(row);
      } else {
        const index = this.expandRow.indexOf(row.index);
        this.expandRow.splice(index, 1);
      }
    },
    async getMenuFoods() {
      this.menuOptions = [];
      try {
        const menu = await getMenu({
          restaurant_id: this.selectTable.restaurant_id,
          allMenu: true,
        });
        if (menu.status === 1) {
          menu.menu.forEach((item, index) => {
            this.menuOptions.push({
              lable: item.name,
              value: item.id,
              index,
            });
          });
        } else {
          ElMessage.error(menu.message);
        }
      } catch (err) {
        ElMessage.error(err);
      }
    },
    async getSelectItemData(row, type) {
      const restaurant = await getRestaurantDetail(row.restaurant_id);
      const category = await getMenuDetail(row.category_id);
      this.selectTable = {
        ...row,
        ...{
          restaurant_name: restaurant.name,
          restaurant_address: restaurant.address,
          category_name: category.data.name,
        },
      };

      this.selectMenu = { label: category.data.name, value: row.category_id };
      this.tableData.splice(row.index, 1, { ...this.selectTable });
      this.$nextTick(() => {
        this.expandRow.push(row.index);
      });
      this.updataSpecsList();
      if (type === "edit") {
        this.getMenuFoods();
      }
    },
    handleEdit(row) {
      this.getSelectItemData(row, "edit");
      this.dialogFormVisible = true;
    },
    async handleDelete(index, row) {
      try {
        const res = await deleteFood(row.item_id);
        if (res.status === 1) {
          ElMessage.success(res.message);
          this.tableData.splice(index, 1);
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        ElMessage.error(err.message);
      }
    },
    handleSizeChange(val) { },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getFoods();
    },
    handleSelect(index) {
      this.selectIndex = index;
      this.selectMenu = this.menuOptions[index];
    },

    //图片编辑method
    handleShopAvatarScucess(res, file) {
      if (res.status === 1) {
        this.selectTable.image_path = res.image_path;
      } else {
        ElMessage.error(res.message);
      }
    },
    beforeAvatarUpload(file) {
      return beforeAvatar(file);
    },
    handleExceed(files) {
      ElMessage.warning("只能上传一张图片");
    },
    async handleRemove(files) {
      const filedata = { imgname: this.selectTable.image_path };
      const res = await deleteImg(filedata);
      if (res.status === 1) {
        this.selectTable.image_path = "";
        ElMessage.success(res.message);
      }
    },
    handlePreview(files) {
      this.dialogFormVisible = true;
    },
    //图片编辑结束

    deleteSpecs(index) {
      this.specslist.splice(index, 1);
    },
    tableRowClassName(row, index) {
      if (index === 1) {
        return 'info-row';
      } else if (index === 3) {
        return 'positive-row';
      }
      return "";
    },
    async updataFoodlist() {
      this.dialogFormVisible = false;
      try {
        const subData = { new_category_id: this.selectMenu.value, specs: this.specslist };
        const postData = { ...this.selectTable, ...subData };
        const res = await updataFood(postData);
        if (res.status === 1) {
          ElMessage.success(res.success);
          this.getFoods();
        } else {
          ElMessage.error(res.message);
        }
      } catch (err) {
        ElMessage.error(err);
      }
    },

    //初始化specslist
    updataSpecsList() {
      let specs = [];
      let specfoodsDetail = this.selectTable.specfoods;
      if (specfoodsDetail) {
        specfoodsDetail.forEach(item => {
          specs.push({
            specs: item.specs_name,
            packing_fee: item.packing_fee,
            price: item.price,
          })
        })
      }
      this.specslist = specs;
    },
    addspecs() {
      this.specslist.push({ ...this.specsForm });
      this.specsForm.specs = '';
      this.specsForm.packing_fee = 0;
      this.specsForm.price = 20;
      this.specsFormVisible = false;
    },
  },

};
</script>

<style lang="scss" scoped>
.foodlist_container {
  .el-form-item {
    margin-right: 15px;
  }

  .table_container {
    margin-top: 20px;

    .Pagination {
      margin-top: 20px;
    }
  }
}

.table_container {
  padding: 20px;
}

.demo-table-expand {
  font-size: 0;
}


.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  // margin-left:20px;
  width: 50%;
}

.avatar-img {
  margin-left: 20px;
  display: inline-block;
}
</style>