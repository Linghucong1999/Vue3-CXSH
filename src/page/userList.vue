<template>
  <div class="userList_container">
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
          <el-button type="primary" @click="onReset('ruleForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table_container">
      <el-table :data="tableData" highlight-current-row>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column
          prop="registe_time"
          label="注册日期"
          width="220"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="220"
        ></el-table-column>
        <el-table-column prop="city" label="注册地址"></el-table-column>
      </el-table>
      <div class="Pageination">
        <el-pagination
          @size-change="hanleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          background
          layout="->, total, prev, pager, next, jumper"
          :total="count"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import CityCascader from "../components/common/CityCascader.vue";
import { getUserCount, getUserList, conditionGetUser } from "../api/getData";
import { ElMessage, dayjs } from "element-plus";
export default {
  components: { CityCascader },
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
      currentPage: 1,
      count: 0,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const countData = await getUserCount();
        if (countData.status === 1) {
          this.count = countData.count;
        } else {
          throw new Error("获取数据失败");
        }
        this.getUsers();
      } catch (err) {
        ElMessage.error("获取数据失败");
      }
    },
    hanleSizeChange(val) {
      // console.log(val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getUsers();
    },
    async getUsers() {
      const users = await getUserList({
        offset: this.offset,
        limit: this.limit,
      });
      this.tableData = [];
      users.forEach((item) => {
        const table = {};
        table.registe_time = item.registe_time;
        table.username = item.username;
        table.city = item.city;
        this.tableData.push(table);
      });
    },
    async onSubmitcon(form) {
      const cityData = this.$refs["allCity"].cityData;
      if (cityData.length !== 0 && this.ruleForm.date !== null) {
        this.tableData = [];
        const time = dayjs(this.ruleForm.date).format("YYYY-MM-DD");
        let citySelect = null;
        if (["香港", "澳门"].includes(cityData[0])) {
          citySelect = cityData[0];
        } else {
          citySelect = cityData[1];
        }
        const table = {
          username: this.ruleForm.name,
          city: citySelect,
          registe_time: time,
          limit: this.limit,
          offset: this.offset,
        };
        const users = await conditionGetUser(table);
        if (users.status === 1) {
          users.user.forEach((item) => {
            const data = {};
            data.registe_time = item.registe_time;
            data.username = item.username;
            data.city = item.city;
            this.tableData.push(data);
          });
          this.count = users.user.length;
        } else {
          this.count = 0;
          ElMessage.warning("这段时间,这段地区,查无此人");
        }
      } else if (
        this.ruleForm.name &&
        cityData.length === 0 &&
        this.ruleForm.date === ""
      ) {
        this.tableData = [];
        const table = { username: this.ruleForm.name };
        const users = await conditionGetUser(table);
        if (users.status === 1) {
          this.tableData.push({
            registe_time: users.user.registe_time,
            username: users.user.username,
            city: users.user.city,
          });
          this.count = 1;
        } else {
          this.count = 0;
          ElMessage.warning("查无此人");
        }
      } else {
        ElMessage.warning("请选择查询的城市和时间,或者只选择用户名也可以");
      }
    },
    onReset(from) {
      this.$refs[from].resetFields();
      this.$refs.allCity.onReset();
      this.initData();
    },
  },
};
</script>
<style lang="scss" scoped>
.userList_container {
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