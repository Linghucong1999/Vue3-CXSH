<template>
  <el-card>
    <el-form :model="ruleForm" :inline="true" ref="ruleForm">
      <el-form-item label="用户姓名: " prop="name">
        <el-input placeholder="用户姓名" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="注册城市: " prop="city">
        <city-cascader ref="allCity"></city-cascader>
      </el-form-item>
      <el-form-item label="注册日期：" prop="date">
        <el-date-picker
          v-model="ruleForm.date"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitcon('ruleForm')"
          >查询</el-button
        >
        <el-button type="primary" @click="onReset('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <div class="adminlist_container">
    <el-card class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          prop="user_name"
          label="姓名"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="creat_time"
          label="注册时间"
          width="220"
        ></el-table-column>
        <el-table-column prop="city" label="地址" width="180"></el-table-column>
        <el-table-column prop="admin" label="权限"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="Pageination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="->, total, prev, pager, next, jumper"
          :total="count"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import CityCascader from "../components/common/CityCascader.vue";
import { adminList, adminCount, conditionGetAdmin } from "../api/getData";
import { ElMessage, dayjs } from "element-plus";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        city: "",
        date: "",
      },
      tableData: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
    };
  },
  components: {
    CityCascader,
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const countData = await adminCount();
        if (countData.status === 1) {
          this.count = countData.count;
        } else {
          throw new Error("获取数据失败");
        }
        this.getAdmin();
      } catch (err) {
        ElMessage.error(err.message);
      }
    },
    async getAdmin() {
      try {
        const limitOf = { offset: this.offset, limit: this.limit };
        const res = await adminList(limitOf);
        if (res.status === 1) {
          this.tableData = [];
          res.data.forEach((item) => {
            const tableItem = {
              admin: item.admin,
              city: item.city,
              creat_time: item.creat_time,
              user_name: item.user_name,
            };
            this.tableData.push(tableItem);
          });
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        ElMessage.error(err.message);
      }
    },
    handleSizeChange(val) {
      //page-size发生改变时触发此函数
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getAdmin();
    },
    async onSubmitcon(form) {
      const cityData = this.$refs["allCity"].cityData;
      if (
        cityData.length !== 0 ||
        this.ruleForm.date !== "" ||
        this.ruleForm.name !== ""
      ) {
        this.tableData = [];
        let time = "";
        if (this.ruleForm.date !== "") {
          time = dayjs(this.ruleForm.date).format("YYYY-MM-DD");
        }
        let citySelect = null;
        if (["香港", "澳门"].includes(cityData[0])) {
          citySelect = cityData[0];
        } else {
          citySelect = cityData[1];
        }
        const table = {
          user_name: this.ruleForm.name,
          city: citySelect===undefined?'':citySelect,
          registe_time: time,
          limit: this.limit,
          offset: this.offset,
        };
        const users = await conditionGetAdmin(table);
        if (users.status === 1) {
          users.user.forEach((item) => {
            const data = {};
            data.creat_time = item.creat_time;
            data.user_name = item.user_name;
            data.city = item.city;
            this.tableData.push(data);
          });
          this.count = users.user.length;
        } else {
          this.count = 0;
          ElMessage.warning(users.message);
        }
      } else {
        ElMessage.warning("请选择查询的城市和时间,或者只选择管理员名也可以");
      }
    },
    onReset(form){
      this.$refs[form].resetFields();
      this.$refs.allCity.onReset();
      this.initData();
    }
  },
};
</script>
<style lang="scss" scoped>
.adminlist_container {
  position: relative;
  .el-form-item {
    margin-right: 15px;
    margin-bottom: 0;
  }
  .table_container{
    margin-top: 20px;
    .Pageination{
      margin-top: 20px;
    }
  }
}
</style>