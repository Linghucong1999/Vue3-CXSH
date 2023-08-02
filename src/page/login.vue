<template>
  <div class="main">
    <!-- 登录页面 -->
    <div class="container a-container" id="a-container" ref="aContainer">
      <el-form
        class="form"
        id="a-form"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
      >
        <h2 class="form_title title">欢迎回来</h2>

        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            :prefix-icon="User"
            class="form__input"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="loginForm.password"
            :prefix-icon="Lock"
            class="form__input"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('loginForm')"
            class="form__button button submit"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 注册选项暂时不用,但是还是先写好,免得到时候需要 -->
    <div class="container b-container" id="b-container" ref="bContainer">
      <el-form
        class="form"
        id="b-form"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
      >
        <h2 class="form_title title">注册管理员账号</h2>

        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            :prefix-icon="User"
            class="form__input"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            type="text"
            placeholder="邮箱或电话"
            :prefix-icon="Iphone"
            class="form__input"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="loginForm.password"
            :prefix-icon="Lock"
            class="form__input"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('loginForm')"
            class="form__button button submit"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="switch" id="switch-cnt" ref="switchCnt">
      <div class="switch__circle" ref="switchCircleOne"></div>
      <div class="switch__circle switch__circle--t" ref="switchCircleTwo"></div>

      <div class="switch__container" id="switch-c1" ref="switchC1">
        <h2 class="switch__title title">厨鲜生后台管理系统</h2>
        <p class="switch__description description">
          如果未曾登录过会自动注册一个账号,并不需要注册
        </p>
        <button
          class="switch__button button switch-btn"
          @click="changForm"
          ref="switchBtn"
        >
          注册
        </button>
      </div>

      <div class="switch__container is-hidden" id="switch-c2" ref="switchC2">
        <h2 class="switch__title title">VUE3+Element-plus</h2>
        <p class="switch__description description">
          不商用,注册页面只是摆设,说不定以后会用到,注册个大概页面
        </p>
        <button
          class="switch__button button switch-btn"
          @click="changForm"
          ref="switchBtn"
        >
          登录
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { User, Lock, Iphone } from "@element-plus/icons-vue";
import { login, getAdminInfo } from "@/api/getData.js";
import { mapActions, mapState } from "vuex";
import { ref } from "@vue/reactivity";

export default {
  setup() {
    const switchCnt = ref(null);
    const switchC1 = ref(null);
    const switchC2 = ref(null);
    // const switchCircle = ref(null);
    const switchCircleOne = ref(null);
    const switchCircleTwo = ref(null);
    const switchBtn = ref([]);
    const aContainer = ref(null);
    const bContainer = ref(null);

    const changForm = () => {
      switchCnt.value.classList.add("is-gx");
      setTimeout(() => {
        switchCnt.value.classList.remove("is-gx");
      });

      switchCnt.value.classList.toggle("is-txr");
      switchCircleOne.value.classList.toggle("is-txr");
      switchCircleTwo.value.classList.toggle("is-txr");

      switchC1.value.classList.toggle("is-hidden");
      switchC2.value.classList.toggle("is-hidden");
      aContainer.value.classList.toggle("is-txl");
      bContainer.value.classList.toggle("is-txl");
      bContainer.value.classList.toggle("is-z200");
    };

    return {
      User,
      Lock,
      Iphone,
      switchCnt,
      switchC1,
      switchC2,
      switchCircleOne,
      switchCircleTwo,
      switchBtn,
      aContainer,
      bContainer,
      changForm,
    };
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        type: [], //记住密码选项
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },

  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await login({
            user_name: this.loginForm.username,
            password: this.loginForm.password,
          });
          if (res.status == 1) {
            this.$message({
              type: "success",
              message: "登录成功",
            });
            this.$router.push("manage");
          } else {
            this.$message({
              type: "error",
              message: res.message,
              duration: 3000,
            });
          }
        } else {
          this.$message({
            type: "error",
            title: "错误",
            message: "请输入正确的用户名密码",
            duration: 3000,
          });
          return false;
        }
      });
    },
    checkLocalStroe() {
      const adminDatas = localStorage.getItem("adminData");
      const adminInfo = JSON.parse(adminDatas);
      if (adminInfo.expiration && Date.now() > adminInfo.expiration) {
        localStorage.removeItem("adminData");
      } else {
        this.$message({
          type: "success",
          message: "检测到您之前已经登录过,将自动登录",
        });
        this.$router.push("manage");
      }
    },
  },
  mounted() {
    if (localStorage.getItem("adminData")) {
      this.checkLocalStroe();
    }
  },
};
</script>
<style scoped lang="scss">
$bg: #edf2f0;

$neu-1: #ecf0f3;
$neu-2: #d1d9e6;

$white: #f9f9f9;
$gray: #a0a5a8;
$black: #181818;

$purple: #4b40e2;

$transition: 1.25s;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $neu-1;
  color: $gray;
  font-family: Avenir, helvetica neue, Arial, Helvetica, sans-serif;
}
.main {
  position: relative;
  width: 1000px;
  min-width: 1000px;
  height: 600px;
  min-height: 600px;
  margin: 5vh 17vw;
  background-color: $neu-1;
  box-shadow: 10px 10px 10px $neu-2, -10px -10px 10px $white;
  border-radius: 12px;
  overflow: hidden;
  @media (max-width: 1200px) {
    transform: scale(0.9);
  }
  @media (max-width: 1000px) {
    transform: scale(0.65);
  }
  @media (max-width: 800px) {
    transform: scale(0.45);
  }
  @media (max-width: 600px) {
    transform: scale(0.4);
  }
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  width: 600px;
  height: 100%;
  padding: 25px;
  background-color: $neu-1;
  transition: $transition;
}
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__input {
    width: 350px;
    height: 40px;
    margin: 15px 0;
    font-size: 13px;
    letter-spacing: 0.15px;
    border: none;
    outline: none;
    background-color: $neu-1;
    transition: 0.25s ease;
    border-radius: 8px;
    box-shadow: inset 2px 2px 4px $neu-2, inset -2px -2px 4px $white;
    &:focus {
      box-shadow: inset 4px 4px 4px $neu-2, inset -4px -4px 4px $white;
    }
  }
}

.title {
  font-size: 20px;
  font-weight: 700;
  line-height: 3;
  color: $black;
}
.button {
  width: 180px;
  height: 50px;
  border-radius: 25px;
  margin-top: 50px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1.15px;
  background-color: $purple;
  color: $white;
  box-shadow: 8px 8px 16px $neu-2, -8px -8px 16px $white;
  border: none;
  outline: none;
}

.a-container {
  z-index: 100;
  left: calc(100% - 600px);
}

.b-container {
  left: calc(100% - 600px);
  z-index: 0;
}
.description {
  font-size: 14px;
  letter-spacing: 0.25px;
  text-align: center;
  line-height: 1.6;
}
.switch {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 400px;
  padding: 50px;
  z-index: 200;
  transition: $transition;
  background-color: $neu-1;
  overflow: hidden;

  box-shadow: 4px 4px 10px $neu-2, -4px -4px 10px $white;

  &__circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background-color: $neu-1;
    box-shadow: inset 8px 8px 12px $neu-2, inset -8px -8px 12px $white;
    bottom: -60%;
    left: -60%;
    transition: $transition;

    &--t {
      top: -30%;
      left: 60%;
      width: 300px;
      height: 300px;
    }
  }

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    width: 400px;
    padding: 50px 55px;
    transition: $transition;
  }

  &__button {
    cursor: pointer;
    &:hover {
      box-shadow: 6px 6px 10px $neu-2, -6px -6px 10px $white;
      transform: scale(0.985);
      transition: 0.25s;
    }
    &:active,
    &:focus {
      box-shadow: 2px 2px 6px $neu-2, -2px -2px 6px $white;
      transform: scale(0.97);
      transition: 0.25s;
    }
  }
}

/** */
.is-txr {
  left: calc(100% - 400px);
  transition: $transition;
  transform-origin: left;
}
.is-hidden {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  transition: $transition;
}
.is-txl {
  left: 0;
  transition: $transition;
  transform-origin: right;
}
.is-z200 {
  z-index: 200;
  transition: $transition;
}
.is-gx {
  animation: is-gx $transition;
}
@keyframes is-gx {
  0%,
  10%,
  100% {
    width: 400px;
  }
  30%,
  50% {
    width: 500px;
  }
}
</style>
