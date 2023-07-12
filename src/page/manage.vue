<template>
  <div class="manage-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <nav-left :isCollapse="isCollapse"></nav-left>
    </div>

    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <nav-head @clickCollapse="showCollapse"></nav-head>
      <div class="wrapper">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <nav-foot></nav-foot>
      </div>
    </div>
    <el-backtop :right="100" :bottom="100"></el-backtop>
  </div>
</template>

<script>
import NavHead from "../components/Navhead.vue";
import NavFoot from "../components/NavFoot.vue";
import NavLeft from "../components/NavLeft.vue";
export default {
  components: {
    NavHead,
    NavFoot,
    NavLeft,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    showCollapse(isShow) {
      this.isCollapse = isShow;
    },
  },
};
</script>

<style lang="scss" scoped>
.manage-layout {
  position: relative;

  .nav-side {
    position: fixed;
    width: 240px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    transition: all 0.5s ease-in-out;

    //合并
    &.fold {
      width: 64px;
    }

    //展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 240px;
    transition: all 0.5s ease-in-out;

    //合并
    &.fold {
      margin-left: 64px;
    }

    //展开
    &.unfold {
      margin-left: 200px;
    }
  }
}

.wrapper {
  background-color: #eef0f3;
  height: calc(100% - 64px);
  padding: 20px;
}
</style>
