<template>
  <el-card>
    <el-row style="margin-top: 20px">
      <el-col :span="16" :offset="4">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="110px"
          class="demo-formData"
        >
          <el-form-item label="店铺名称" prop="name" id="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address" id="address">
            <el-autocomplete
              v-model="formData.address"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%"
              @select="addressSelect"
            ></el-autocomplete>
            <span>当前城市:{{ city.name }}</span>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" id="phone">
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
          <el-form-item label="店铺特点" style="white-space: nowrap">
            <span>品牌保障</span>
            <el-switch
              v-model="formData.is_premium"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            ></el-switch>
            <span>厨鲜生快送</span>
            <el-switch
              v-model="formData.delivery_mode"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            ></el-switch>
            <span>新开店铺</span>
            <el-switch
              v-model="formData.new"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            ></el-switch>
          </el-form-item>
          <el-form-item style="white-space: nowrap">
            <span>官方保障</span>
            <el-switch
              v-model="formData.bao"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            ></el-switch>
            <span>准时送达</span>
            <el-switch
              v-model="formData.zhun"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            ></el-switch>
            <span>开发票</span>
            <el-switch
              v-model="formData.piao"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            ></el-switch>
          </el-form-item>
          <el-form-item label="配送费" prop="float_delivery_fee">
            <el-input-number
              v-model="formData.float_delivery_fee"
              :min="0"
              :max="50"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="起送价" prop="float_minimum_order_amount">
            <el-input-number
              v-model="formData.float_minimum_order_amount"
              :min="0"
              :max="500"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="营业时间" style="white-space: nowrap">
            <el-time-select
              v-model="formData.startTime"
              placeholder="开店时间"
              start="05:30"
              step="00:15"
              end="23:00"
            ></el-time-select>
            <el-time-select
              v-model="formData.endTime"
              placeholder="关店时间"
              start="05:30"
              step="00:15"
              end="23:30"
              :min-time="formData.startTime"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="上传店铺头像">
            <el-upload
              :action="baseUrl + '/v1/addimg/shop'"
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
          <el-form-item label="上传营业执照">
            <el-upload
              :action="baseUrl + '/v1/addimg/shop'"
              class="avatar-uploader"
              :show-file-list="true"
              :on-success="handleBusinessAvatarSucess"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleBusinessRemove"
              list-type="picture-card"
              :on-preview="handleBusinessPreview"
            >
              <el-icon class="avatar-uploader-icon"><Plus></Plus></el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="上传餐饮服务许可证">
            <el-upload
              :action="baseUrl + '/v1/addimg/shop'"
              class="avatar-uploader"
              :show-file-list="true"
              :on-success="handleServiceAvatarSucess"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleServiceRemove"
              list-type="picture-card"
              :on-preview="handleBusinessPreview"
            >
              <el-icon class="avatar-uploader-icon"><Plus></Plus></el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="优惠活动">
            <el-select
              v-model="activityValue"
              :placeholder="activityValue"
              @change="selectActivity"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-tag type="info"
              >满减优惠(满30减5,满60减15)是必有选项,不用另选,如果商户有自己的满减的优惠,可自己填写</el-tag>
          </el-form-item> -->
          <el-table :data="activities" :row-class-name="tbaleRowClassName">
            <el-table-column
              label="活动标题"
              prop="icon_name"
              align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              label="活动名称"
              prop="name"
              align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              label="活动详情"
              prop="description"
              align="center"
            ></el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')"
              >立即创建</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { cityGuess, addShop, searchplace, deleteImg } from "../api/getData.js";
import env from "../config/env.js";
import { Plus, ZoomIn } from "@element-plus/icons-vue";
import { ElMessage, genFileId } from "element-plus";
import { ref } from "@vue/reactivity";

export default {
  components: {
    Plus,
    ZoomIn,
  },
  setup() {
    const dialogVisible = ref(false);
    const dialogImageUrl = ref();
    return {
      dialogVisible,
      dialogImageUrl,
    };
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
        image_path: "", //店铺头像
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
      baseUrl: env.baseUrl,
      baseImgPath: env.baseImgPath,
      activityValue: "满减优惠",
      options: [
        {
          value: "满减优惠",
          lable: "满减优惠",
        },
        {
          value: "优惠大酬宾",
          lable: "优惠大酬宾",
        },
        {
          value: "新用户立减",
          lable: "新用户立减",
        },
        {
          value: "进店领优惠劵",
          lable: "进店领优惠劵",
        },
      ],
      activities: [
        {
          icon_name: "减",
          name: "满减优惠",
          description: "满30减5，满60减15",
        },
      ],
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
    handleShopAvatarScucess(res, file) {
      if (res.status === 1) {
        this.formData.image_path = res.image_path;
      } else {
        ElMessage.error("上传店铺头像失败");
      }
    },
    handleBusinessAvatarSucess(res, file) {
      if (res.status === 1) {
        this.formData.business_license_image = res.image_path;
      } else {
        ElMessage.error("上传店铺营业资格证失败");
      }
    },
    handleServiceAvatarSucess(res, file) {
      if (res.status === 1) {
        this.formData.catering_service_license_image = res.image_path;
      } else {
        ElMessage.error("上传餐饮服务许可证失败");
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
        ElMessage.error("上传的头像大小不能超过2兆");
      }
      return isRightType && isLt2M;
    },
    handleExceed(files) {
      ElMessage.warning("只能上传一张图片");
      // this.upload.clearFiles();
      // const file=files[0];
      // file.uid=genFileId();
      // this.upload.handleStart(file);
      // console.log(file);
    },
    async handleRemove(files) {
      // console.log(files);
      const filedata = { imgname: this.formData.image_path };
      const res = await deleteImg(filedata);
      if (res.status === 1) {
        ElMessage.success(res.message);
      }
    },
    async handleBusinessRemove(files) {
      const filedata = { imgname: this.formData.business_license_image };
      const res = await deleteImg(filedata);
      if (res.status === 1) {
        ElMessage.success(res.message);
      }
    },
    async handleServiceRemove(files) {
      const filedata = {
        imgname: this.formData.catering_service_license_image,
      };
      const res = await deleteImg(filedata);
      if (res.status === 1) {
        ElMessage.success(res.message);
      }
    },
    handlePreview(files) {
      this.dialogImageUrl = this.baseImgPath + this.formData.image_path;
      this.dialogVisible = true;
    },
    handleBusinessPreview(files) {
      this.dialogImageUrl =
        this.baseImgPath + this.formData.business_license_image;
      this.dialogVisible = true;
    },
    handleServicePreview(files) {
      this.dialogImageUrl = this.formData.catering_service_license_image;
      this.dialogVisible = true;
    },
    selectActivity() {
      this.$prompt("请输入活动详情", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (value === null) {
            this.$message({
              type: "info",
              message: "请输入活动详情",
            });
            return;
          }
          let newObj = {};
          switch (this.activityValue) {
            case "满减优惠":
              newObj = {
                icon_name: "减",
                name: "满减优惠",
                description: value,
              };
              break;
            case "优惠大酬宾":
              newObj = {
                icon_name: "特",
                name: "优惠大酬宾",
                description: value,
              };
              break;
            case "新用户立减":
              newObj = {
                icon_name: "新",
                name: "新用户立减",
                description: value,
              };
              break;
            case "进店领券":
              newObj = {
                icon_name: "领",
                name: "进店领券",
                description: value,
              };
              break;
          }
          if (
            this.activities.length !== 0 &&
            this.activities[0].icon_name === newObj.icon_name
          ) {
            this.activities.splice(0, 1, newObj);
          } else {
            this.activities.push(newObj);
          }

          // console.log(this.activities);
        })
        .catch((err) => {
          ElMessage.warning("取消输入");
        });
    },
    tbaleRowClassName(row, index) {},
    handleDelete(index) {
      this.activities.splice(index, 1);
      // console.log(this.activities);
    },
    async submitForm(formName) {
      const form=this.$refs[formName]
      const valid = form.validate();
      valid.then(
        console.log(this.formData)
      ).catch(err=>{
        let elementId=[];
        for(let value of Object.entries(err)){
          elementId.push(form.$el.querySelector(`#${value[0]}`));
        }
        elementId[0].scrollIntoView({behavior:'smooth',block:'start'});
      })
    },
  },
};
</script>
<style scoped lang="scss">
</style>