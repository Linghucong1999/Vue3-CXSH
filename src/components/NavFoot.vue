<template>
  <div class="footer">
    <div class="footer-container">
      <footer class="footer-layout">
        <div class="footer-layout-link">
          <a href="/#" target="_blank">个人主页</a>
          <a href="https://github.com/Linghucong1999" target="_blank">GitHub</a>
          <a href="https://github.com/Linghucong1999/Vue3-CXSH" target="_blank"
            >项目地址</a
          >
        </div>
        <div class="footer-layout-copyright">
          Create&nbsp;&nbsp; ©&nbsp; 2023&nbsp;Linghucong1999
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { UserFilled } from "@element-plus/icons-vue";
export default {
  components: {
    UserFilled,
  },
};
</script>
<style lang="scss" scoped>
.footer {
  position: relative;

  .footer-container {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    z-index: 100;

    .footer-layout {
      margin: 48px 0 24px;
      padding: 0 16px;
      text-align: center;

      .footer-layout-link {
        margin-bottom: 8px;
        a {
          color: rgba(0, 0, 0, 0.45);
          font-weight: bold;
          transition: all 0.3s ease-in-out;
        }
        a:not(:last-child) {
          margin-right: 40px;
        }
        a:hover {
          color: #409eff;
        }
      }

      .footer-layout-copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }
}
</style>