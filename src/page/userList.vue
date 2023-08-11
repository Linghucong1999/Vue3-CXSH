<template>
  <div class="userList_container">
    <el-card>
      <el-form :model="ruleForm" :inline="true" ref="ruleFormRef">
        <el-form-item label="用户姓名: " prop="name">
          <el-input placeholder="用户姓名" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="注册城市: " prop="city">
          <city-cascader ref="allCity"></city-cascader>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import CityCascader from "../components/common/CityCascader.vue";

export default {
  components: { CityCascader },
  data() {
    return {
      ruleForm: {
        name: "",
        city: "",
        date: "",
      },
      tableData: [
        {
          registe_time: "2023-07-20",
          username: "高启强",
          city: "京海市旧厂街201街道",
        },
        {
          registe_time: "2023-07-28",
          username: "高启盛",
          city: "京海市旧厂街201街道",
        },
        {
          registe_time: "2023-08-10",
          username: "唐小虎",
          city: "京海市旧厂街201街道",
        },
        {
          registe_time: "2023-07-20",
          username: "唐小龙",
          city: "京海市旧厂街201街道",
        },
        {
          registe_time: "2023-07-10",
          username: "安欣",
          city: "京海市公安局",
        },
      ],
      currentRow: null,
      offset: 0,
      limit: 20,
      currentPage: 1,
    };
  },
};
</script>
<style lang="scss" scoped>
</style>