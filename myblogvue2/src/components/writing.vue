<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="2">
        <div class="grid-content bg-purple level-center">
          <router-link :to="{ name: 'articleConsole' }">
            <i class="iconfont">&#xe609;</i> 文章管理
          </router-link>
        </div>
      </el-col>
      <el-col :span="18"
        ><div class="grid-content bg-purple">
          <el-input
            v-model="aDraftInfo.atitle"
            autocomplete="off"
            placeholder="请输入文章标题"
            maxlength="40"
            :show-word-limit="true"
          ></el-input>
        </div>
      </el-col>
      <el-col :span="2"
        ><div
          class="grid-content bg-purple release-btn"
          @click="dialogIsShow = true"
        >
          发布文章
        </div>
      </el-col>
      <el-col :span="2"
        ><div class="grid-content bg-purple iconfont">&#xe64b;</div>
      </el-col>
    </el-row>
    <mavon-editor @save="saveCon" v-model="value" class="wh" id="saveCon" />
    <el-dialog title="发布文章" :visible.sync="dialogIsShow" width="40%">
      <el-form :model="aDraftInfo">
        <el-form-item label="文章摘要">
          <el-input
            v-model="aDraftInfo.summary"
            autocomplete="off"
            type="textarea"
            placeholder="请输入摘要"
            :autosize="{ minRows: 3, maxRows: 6 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select v-model="aDraftInfo.atype" placeholder="请选择活动区域">
            <el-option
              v-for="atype in atypes"
              :key="atype"
              :label="atype"
              :value="atype"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogIsShow = false">取 消</el-button>
        <el-button type="primary" @click="release">发布文章</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import $ from "jquery";
import AppVue from "../App.vue";
export default {
  name: "writing",
  data() {
    return {
      value: "",
      atypes: [],
      dialogIsShow: false,
      aDraftInfo: {
        // 为了不报错
        atitle: "",
      }, // 草稿文章的信息
      beforeRouterData: null,
      todelID: undefined,
    };
  },
  methods: {
    // 保存草稿
    saveCon(value, html) {
      if (this.value == "" || this.aDraftInfo.atitle == "") {
        alert("标题或内容为空，无法保存或发表");
        return;
      }
      // 从写博客进入
      if (this.aDraftInfo.aid == undefined) {
        this.aDraftInfo.aid = Date.now();
      }
      this.aDraftInfo.content_value = value;
      this.aDraftInfo.content_html = html;

      if (!this.beforeRouterData.isdraft) {
        this.aDraftInfo.creationtime_last = Date.now();
      }
      this.$http({
        url: "articleInfo",
        method: "post",
        data: {
          ainfo: this.aDraftInfo,
          isdraft: this.beforeRouterData.isdraft,
          todelID: this.todelID,
        },
        headers: {
          Authorization: window.localStorage.getItem("sessiontoken"),
        },
      }).then((backdata) => {
        let { data, meta } = backdata.data;
        let action = this.beforeRouterData.isdraft ? "保存" : "发表";
        if (meta.status == 200) {
          this.$message({
            message: action + "成功",
            type: "success",
          });
        } else {
          this.$message.error(action + "失败：" + meta.msg);
        }
      });
    },
    // 发布文章
    release() {
      console.log("标题：", this.aDraftInfo.atitle);
      console.log("con：", this.value);
      if (this.value == "" || this.aDraftInfo.atitle == "") {
        alert("标题或内容为空，无法发布");
        return;
      }
      this.dialogIsShow = false;

      if (this.beforeRouterData.isdraft) {
        this.aDraftInfo.creationtime_first = Date.now();
        this.todelID = this.aDraftInfo.aid;
        this.aDraftInfo.aid = this.beforeRouterData.aLastId + 1;
        this.aDraftInfo.astate = 1;
      }
      this.beforeRouterData.isdraft = false;
      $("[title='保存 (ctrl+s)']").click();
      //更好的方案： 可弹出框，选择再写一篇或者返回首页，或者阅读-------------
      setTimeout(() => {
        sessionStorage.removeItem("aData");
        this.$router.push({ path: "/" });
      }, 1000);
    },
    getAtypes() {
      this.$http({
        url: `/atypes?uid=${this.aDraftInfo.uid}`,
        method: "get",
      }).then((backdata) => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.atypes = data;
        } else {
          this.$message.error("博客分类获取失败:" + meta.msg);
        }
      });
    },
    init() {
      if (this.$route.params.isdraft != undefined) {
        this.beforeRouterData = this.$route.params;
        sessionStorage.setItem("aData", JSON.stringify(this.$route.params));
      } else {
        this.beforeRouterData = JSON.parse(sessionStorage.getItem("aData"));
      }
      if (this.beforeRouterData.ainfo == null) {
        // 写一篇新的文章
        this.aDraftInfo = {
          uid: this.beforeRouterData.uid,
          aid: undefined,
          atitle: "",
          summary: "",
          content_value: "",
          content_html: "",
          atype: "",
        };
      } else {
        // 修改草稿或已发表的文章
        this.aDraftInfo = this.beforeRouterData.ainfo;
        this.value = this.aDraftInfo.content_value;
      }
    },
    notSupport() {
      alert("暂不支持该功能");
    },
    loginDetect() {
      if (window.localStorage.getItem("sessiontoken")) {
        this.init();
        this.getAtypes();
      } else {
        this.$message.error("请登录");
        this.$router.push({
          path: "/",
        });
      }
    },
  },
  mounted() {
    // 钩子函数
    this.loginDetect();
    // 在这验证登录不太好，页面会闪动
    // 应该设置点击事件，在跳转页面前验证是否登录
  },
};
</script>
<style scoped>
.main {
  width: 100vw;
  height: 100vh;
}
.el-row {
  height: 8%;
  min-height: 57px;
  margin: 0 !important;
  background-color: #e5e5e5;
}
.el-col {
  height: 100%;
}
.grid-content {
  margin: 9px 0;
  height: 37px;
  line-height: 35px;
  font-size: 16px;
}
.release-btn {
  text-align: center;
  background-color: #f02;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
}
.v-note-wrapper {
  width: 100%;
  height: 92%;
}
</style>