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
          <el-row
            class="add_category_row"
            :class="showAddCategory ? 'showEdit' : ''"
          >
            <div class="add_category">
              <el-form-item label="食品种类" prop="name">
                <el-input
                  v-model="categoryForm.name"
                  placeholder="食品种类名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="种类描述">
                <el-input v-model="categoryForm.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitcategoryForm('categoryForm')"
                  >提交</el-button
                >
              </el-form-item>
            </div>
          </el-row>
          <div class="add_category_button" @click="addCategoryFun">
            <el-icon class="edit_icon" v-if="showAddCategory"
              ><CaretTop></CaretTop
            ></el-icon>
            <el-icon class="edit_icon" v-else default="icon"
              ><CaretBottom></CaretBottom
            ></el-icon>
            <span>添加食品种类</span>
          </div>
        </el-form>

        <!-- 添加食品 -->
        <header class="form_header">添加食品</header>
        <el-form
          :model="foodForm"
          ref="foodForm"
          :rules="foodrules"
          label-width="110px"
          class="form food_form"
        >
          <el-form-item label="食品名称" prop="name">
            <el-input v-model="foodForm.name"></el-input>
          </el-form-item>
          <el-form-item label="食品活动" prop="activity">
            <el-input v-model="foodForm.activity"></el-input>
          </el-form-item>
          <el-form-item label="食品详情" prop="description">
            <el-input v-model="foodForm.description"></el-input>
          </el-form-item>

          <el-form-item label="上传商品图片">
            <el-upload
              :action="baseUrl + '/v1/addimg/food'"
              class="avatar-uploader"
              :show-file-list="true"
              :on-success="handleShopAvatarScucess"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              :on-exceed="handleExceed"
              :on-remove="handleRemove"
              list-type="picture-card"
              :on-preview="handlePreview"
            >
              <el-icon class="avatar-uploader-icon"><Plus></Plus></el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" />
            </el-dialog>
          </el-form-item>

          <el-form-item label="食品特点">
            <el-select
              v-model="foodForm.attributes"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in attributes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="食品规格">
            <el-radio label="one" v-model="foodSpecs" class="radio"
              >单规格</el-radio
            >
            <el-radio label="more" v-model="foodSpecs" class="radio"
              >多规格</el-radio
            >
          </el-form-item>
          <el-row v-if="foodSpecs === 'one'">
            <el-form-item label="包装费">
              <el-input-number
                v-model="foodForm.specs[0].packing_fee"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="价格">
              <el-input-number
                v-model="foodForm.specs[0].price"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
          </el-row>
          <el-row v-else style="overflow: auto; text-align: center">
            <el-button
              type="primary"
              @click="dialogFormVisible = true"
              style="margin-bottom: 10px"
              >添加规格</el-button
            >
            <el-table
              :data="foodForm.specs"
              style="margin-bottom: 20px"
              :row-class-name="tableRowClassName"
            >
              <el-table-column label="规格" prop="specs"></el-table-column>
              <el-table-column
                label="包装费"
                prop="packing_fee"
              ></el-table-column>
              <el-table-column label="价格" prop="price"></el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="danger"
                    size="small"
                    @click="handleDelte(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-row>

          <div class="form-submit">
            <el-button type="primary" @click="addFood('foodForm')" round
              >提交</el-button
            >
          </div>
        </el-form>

        <!-- 跳出弹出框 -->
        <el-dialog title="添加规格" v-model="dialogFormVisible">
          <el-form :model="specsForm" :rules="specsFormrules" ref="specsForm">
            <el-form-item label="规格" label-width="100px" prop="specs">
              <el-input v-model="specsForm.specs"></el-input>
            </el-form-item>
            <el-form-item label="包装费" label-width="100px">
              <el-input-number
                v-model="specsForm.packing_fee"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="价格" label-width="100px">
              <el-input-number
                v-model="specsForm.price"
                :min="0"
                :max="100"
              ></el-input-number>
            </el-form-item>
          </el-form>
          <div class="dialog-footer">
            <slot name="footer">
              <el-button type="danger" @click="dialogFormVisible = false"
                >取消</el-button
              >
              <el-button type="primary" @click="addspecs('specsForm')"
                >确定</el-button
              >
            </slot>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {
  getCategory,
  addCategory,
  deleteImg,
  addFood,
} from "../api/getData.js";
import env from "../config/env.js";
import { Plus, CaretTop, CaretBottom } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
export default {
  components: {
    Plus,
    CaretBottom,
    CaretTop,
  },
  setup() {
    const dialogVisible = ref(false);
    const dialogImageUrl = ref();
    return {
      dialogImageUrl,
      dialogVisible,
    };
  },
  data() {
    return {
      baseUrl: env.baseUrl,
      baseImgPath: env.baseImgPath,
      restaurant_id: 141,
      categoryForm: {
        categoryList: [],
        categorySelect: "",
        name: "",
        description: "",
      },
      showAddCategory: false,
      foodForm: {
        name: "",
        description: "",
        image_path: "",
        activity: "",
        attributes: [],
        specs: [
          {
            specs: "默认",
            packing_fee: 0,
            price: 20,
          },
        ],
      },
      foodrules: {
        name: [
          {
            required: true,
            message: "请输入食品名称",
            trigger: "blur",
          },
        ],
      },
      attributes: [
        {
          value: "新",
          label: "新品",
        },
        {
          value: "招牌",
          label: "招牌",
        },
      ],
      foodSpecs: "one",
      dialogFormVisible: false,
      specsForm: {
        specs: "",
        packing_fee: 0,
        price: 20,
      },
      specsFormrules: {
        specs: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.$route.query.restaurant_id) {
      this.restaurant_id = this.$route.query.restaurant_id;
    } else {
      this.restaurant_id = Math.ceil(Math.random() * 145);
      ElMessageBox.confirm(
        "添加食品需要选择一个商铺,先去选择商铺吗？",
        "Warning",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$router.push("/shopList");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消",
          });
        });
    }
    this.initData();
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
        ElMessage.error(err.message);
      }
    },
    submitcategoryForm(categoryfrom) {
      const form = this.$refs[categoryfrom];
      const valid = form.validate();
      valid
        .then(async () => {
          const params = {
            name: this.categoryForm.name,
            description: this.categoryForm.description,
            restaurant_id: this.restaurant_id,
          };
          const result = await addCategory(params);
          if (result.status === 1) {
            this.categoryForm.name = "";
            this.categoryForm.description = "";
            this.showAddCategory = false;
            const ncategory = result.category.length - 1;
            result.category[ncategory].value = ncategory;
            result.category[ncategory].label = result.category[ncategory].name;
            this.categoryForm.categoryList.push(result.category[ncategory]);
            ElMessage.success("添加成功");
          } else {
            ElMessage.error(result.message);
          }
        })
        .catch((err) => {
          ElMessage.error(err);
        });
    },
    addCategoryFun() {
      this.showAddCategory = !this.showAddCategory;
    },
    handleShopAvatarScucess(res, file) {
      if (res.status === 1) {
        this.foodForm.image_path = res.image_path;
      } else {
        ElMessage.error("上传店铺头像失败");
      }
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
        ElMessage.error("上传的图片大小不能超过2兆");
      }
      return isRightType && isLt2M;
    },
    handleExceed(files) {
      ElMessage.warning("只能上传一张图片");
    },
    async handleRemove(files) {
      const filedata = { imgname: this.foodForm.image_path };
      const res = await deleteImg(filedata);
      if (res.status === 1) {
        ElMessage.success(res.message);
      }
    },
    handlePreview(files) {
      this.dialogImageUrl = this.baseImgPath + this.foodForm.image_path;
      this.dialogVisible = true;
    },
    handleDelte(index) {
      this.foodForm.specs.splice(index, 1);
    },
    async addFood(formname) {
      const form = this.$refs[formname];
      const valid = form.validate();
      valid.then(async () => {
        if (this.selectValue.id === undefined) {
          ElMessage.warning("请选择食品种类");
          return;
        } else {
          const params = {
            ...this.foodForm,
            category_id: this.selectValue.id,
            restaurant_id: this.restaurant_id,
          };

          try {
            const res = await addFood(params);
            if (res.status === 1) {
              ElMessage.success(res.message);
              this.categoryForm.categorySelect = "";
              this.foodForm = {
                name: "",
                description: "",
                image_path: "",
                activity: "",
                attributes: [],
                specs: [
                  {
                    specs: "默认",
                    packing_fee: 0,
                    price: 20,
                  },
                ],
              };
            } else {
              ElMessage.warning(res.message);
            }
          } catch (err) {
            ElMessage.error(err.message);
          }
        }
      });
    },
    addspecs(formname) {
      const form = this.$refs[formname];
      const valid = form.validate();
      valid.then(() => {
        this.foodForm.specs.push(this.specsForm);
        this.specsForm = {
          specs: "",
          packing_fee: 0,
          price: 20,
        };
        this.dialogFormVisible = false;
      });
    },
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if ((index = 3)) {
        return "positive-row";
      }
      return "";
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
@import "./../assets/style/mixin.scss";
.form {
  min-width: 400px;
  margin-bottom: 30px;
  // &:hover {
  //   box-shadow: 0 0 8px 0 rgba(232, 237, 250, 6),
  //     0 2px 4px 0 rgba(232, 237, 250, 5);
  //   border-radius: 6px;
  //   transition: all 400ms;
  // }
}

.food_form {
  padding: 10px 10px 0;
}

.form_header {
  text-align: center;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 900;
}
.category_select {
  padding: 10px 30px 10px 10px;
}
.add_category_row {
  height: 0;
  overflow: hidden;
  transition: all 400ms;
  background: #f9fafc;
}
.showEdit {
  height: 185px;
}
.add_category {
  background: #f9fafc;
  padding: 10px 30px 0px 10px;
  // border: 1px solid #eaeefb;
  // border-top: none;
}
.add_category_button {
  text-align: center;
  line-height: 40px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border: 1px solid #eaeefb;
  border-top: none;
  transition: all 400ms;
  &:hover {
    background: #f9fafc;
    span,
    .edit_icon {
      color: #20a0ff;
    }
  }

  span {
    @include sc(14px, #999);
    transition: all 400ms;
  }

  .edit_icon {
    color: #ccc;
    transition: all 400ms;
  }
}

.form-submit {
  text-align: center;
}
</style>