<template>
  <div
    class="main-div"
    style="display: flex; justify-content: center; align-items: center"
  >
    <el-form
      status-icon
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      label-position="top"
      class="demo-ruleForm myForm"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="account">
        <el-input
          type="text"
          v-model="form.account"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input
          type="password"
          v-model="form.pwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="login-btn" type="primary" @click="loginClick"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      form: {
        account: "",
        pwd: "",
      },
      rules: {
        account: [{ required: true, message: "请输入用户名", trugger: "blur" }],

        pwd: [
          { required: true, message: "请输入密码", trugger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    loginClick() {
      this.$refs.form.validate((res) => {
        if (!res) {
          this.$message.error("表单数据不合法：用户名或密码格式有误");
          return;
        }
        this.$http({
          url: "login",
          method: "post",
          data: this.form,
        }).then((backdata) => {
          let { data, meta } = backdata.data;
          if (meta.status == 200) {
            window.localStorage.setItem("sessiontoken", data.token);
            // 保存用户信息
            window.sessionStorage.setItem(
              "user",
              JSON.stringify({
                uid: data.uid,
                uname: data.uname,
              })
            );
            this.$message({
              message: "恭喜你，登陆成功",
              type: "success",
            });
            this.$router.push({ path: "/" });
          } else {
            this.$message.error("登录失败：" + meta.msg);
          }
        });
      });
    },
  },
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  width: inherit;
  height: inherit;
}
.main-div {
  height: 100%;
  background-color: #324152;
}
h2 {
  margin-bottom: 20px;
}
.myForm {
  width: 500px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
}
.login-btn {
  width: 100%;
}
</style>