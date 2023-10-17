<template>
  <div class="head-container">
    <el-icon class="head-icon" @click="toggle">
      <Expand v-show="isCollapse === true"></Expand>
      <Fold v-show="isCollapse === false"></Fold>
    </el-icon>

    <el-icon class="head-icon" @click="refresh">
      <RefreshRight></RefreshRight>
    </el-icon>
    <el-breadcrumb separator="/" class="breadlist">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">
        {{ item }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown class="head-right" @command="handleCommand">
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
import { singout, getAdminInfo } from "@/api/getData.js";
import { mapActions, mapState } from "vuex";
import { Expand, Fold, RefreshRight } from "@element-plus/icons-vue";

export default {
  data() {
    return {
      baseImgPath: env.baseImgPath,
      isCollapse: false,
      adminInfo: {
        user_name: "Admin",
        avatar: "default.jpg",
      },
    };
  },
  components: {
    Expand,
    Fold,
    RefreshRight,
  },
  methods: {
    async handleCommand(command) {
      if (command == "home") {
        this.$router.push("/manage");
      } else if (command == "singout") {
        try {
          const res = await singout();
          if (res.status === 1) {
            localStorage.removeItem("adminData");
            this.$message({
              type: "success",
              message: "退出成功",
            });
            this.$router.push("/");
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        } catch (err) {
          this.$message({
            type: "error",
            message: "退出失败请重试",
          });
        }
      }
    },

    toggle() {
      this.isCollapse = !this.isCollapse;
      this.$emit("clickCollapse", this.isCollapse);
    },

    refresh() {
      window.location.reload();
    },
    async getAdminDatas() {
      const res = await getAdminInfo();
      if (res.status===0) {
        this.$message({
          type: "error",
          message: "获取用户信息失败，请重新登录！",
        });
        this.$router.push("/");
      } else {
        this.adminInfo = res.data;
        const time = Date.now() + 12 * 60 * 60 * 1000;
        this.adminInfo["expiration"] = time;

        localStorage.setItem("adminData", JSON.stringify(this.adminInfo));
      }
    },
  },
  beforeMount() {
    if (
      localStorage.getItem("adminData") &&
      Date.now() <= JSON.parse(localStorage.getItem("adminData")).expiration
    ) {
      this.adminInfo = JSON.parse(localStorage.getItem("adminData"));
    } else {
      localStorage.removeItem("adminData");
      this.getAdminDatas();
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