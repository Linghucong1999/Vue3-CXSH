<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>
<script>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
export default {
  setup() {
    return {
      ElConfigProvider,
      zhCn,
    };
  },
};
</script>
<style lang="less" scoped>
// @import "./style/common.less";

</style>
