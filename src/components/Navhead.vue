<template>
  <div class="head-container">
    <el-icon class="head-icon">
      <Expand v-show="isCollapse === true"></Expand>
      <Fold v-show="isCollapse === false"></Fold>
    </el-icon>
    <el-icon class="head-icon">
      <RefreshRight></RefreshRight>
    </el-icon>
    <el-breadcrumb separator="/" class="breadlist">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">
        {{ item }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown class="head-right">
      <div class="user">
        <span class="avatar avatar-samll">
          <img
            :src="baseImgPath + adminInfo.avatar"
            class="avatar-img"
            alt="头像"
          />
        </span>
        <span class="user-name">{{ adminInfo.user_name }}</span>
      </div>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="home">首页</el-dropdown-item>
          <el-dropdown-item command="singout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import env from "@/config/env.js";
import { singout } from "@/api/getData.js";
import { mapActions, mapState } from "vuex";
import { Expand, Fold, RefreshRight } from "@element-plus/icons-vue";

export default {
  data() {
    return {
      baseImgPath: env.baseImgPath,
      isCollapse: false,
    };
  },
  components: {
    Expand,
    Fold,
    RefreshRight,
  },
  methods: {
    ...mapActions(["getAdminData"]),
  },
  computed: {
    ...mapState(["adminInfo"]),
  },
  created() {
    if (!this.adminInfo.id) {
      this.getAdminData();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/style/mixin.scss";

.head-container {
  width: 100%;
  height: 64px;
  line-height: 64px;
  background-color: #fff;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: all 0.2s ease-in-out;
  z-index: 3;
  display: block;
  .head-icon {
    padding: 0 12px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
  .breadlist {
    display: inline-block;
    margin-left: 6px;
  }
  .el-tooltip__trigger {
    outline: none;
  }

  .head-right {
    float: right;
    cursor: pointer;

    .user {
      width: 100px;
      @include ellipsis;
      height: 64px;
      line-height: 64px;
      display: inline-block;
      .avatar {
        display: inline-block;
        text-align: center;
        background: #ccc;
        color: #fff;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        vertical-align: middle;
        width: 32px;
        height: 32px;
        line-height: 32px;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      // .avatar-samll {
      //   width: 24px;
      //   height: 24px;
      //   line-height: 24px;
      //   border-radius: 50%;
      // }
      .user-name {
        margin-left: 12px;
      }
    }
  }
}
</style>