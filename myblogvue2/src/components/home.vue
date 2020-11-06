<template>
  <div>
    <div class="navBox">
      <div class="w1230">
        <div class="nav-left">
          <ul class="clearfix">
            <li>
              <router-link :to="'/'">
                首页&nbsp;<i class="iconfont">&#xe602;</i>
                <span class="iconfont"></span>
              </router-link>
            </li>
            <li id="classification">
              <a> 分类专栏&nbsp;<i class="iconfont">&#xe658;</i> </a>
              <ul id="classificationList" v-if="atypes.length == 0">
                <li>没有分类</li>
              </ul>
              <ul id="classificationList" v-else>
                <li v-for="atype in atypes" :key="atype">
                  <a href="" @click="gotoArticleClass($event, atype)">
                    {{ atype }}
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="" @click="gotoArticleConsole($event)">
                管理博客&nbsp;<i class="iconfont">&#xe6dc;</i>
              </a>
            </li>
            <li @click="notSupport">
              <router-link :to="'#'">留言板</router-link>
            </li>
            <li @click="notSupport">
              <router-link :to="'#'">关于博主</router-link>
            </li>
          </ul>
        </div>
        <div class="nav-right">
          <ul v-if="token" class="clearfix">
            <li>
              <router-link
                :to="{
                  name: 'writing',
                  params: {
                    uid: user.uid,
                    aLastId,
                    isdraft: true,
                    ainfo: null,
                  },
                }"
                >写博客</router-link
              >
            </li>
            <li @click="logout">
              <router-link
                :to="{
                  name: 'home',
                }"
              >
                退出
              </router-link>
            </li>
          </ul>
          <ul v-else class="clearfix">
            <li>
              <router-link
                :to="{
                  name: 'login',
                }"
              >
                登录
              </router-link>
            </li>
            <li @click="notSupport">
              <router-link :to="''">注册</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="welcome">Hi，{{ user.uname }}</div>
    <div class="main w1230 clearfix">
      <div class="main-left">
        <router-view></router-view>
      </div>
      <div class="main-right">
        <div class="attention floatUp">
          <span>
            <img src="../assets/images/gb1.jpg" alt="图片不见了" />
          </span>
          <strong style="line-height: 30px">Contact Site Owner</strong>
          <div class="iconfont">
            <p>
              <el-link :underline="false">&#xe6e4;</el-link>
              <el-link :underline="false">&#xe63e;</el-link>
              <el-link :underline="false">&#xe60f;</el-link>
            </p>
            <p>
              <el-link
                href="https://blog.csdn.net/dark_cy"
                target="_blank"
                :underline="false"
                >&#xe600;</el-link
              >
              <el-link :underline="false">&#xe603;</el-link>
              <el-link :underline="false">&#xe600;</el-link>
              <el-link :underline="false">&#xe600;</el-link>
            </p>
          </div>
        </div>
        <div class="like-me floatUp" @click="addLikenum">
          <span>要留下你来过的痕迹吗？</span>
          <p>
            <span class="iconfont">&#xe607;</span>
            &nbsp;&nbsp;{{ likenum }}
          </p>
        </div>
        <div class="newComments floatUp">
          <span class="label">最新评论<i></i></span>
          <ul>
            <li v-if="newCommentList.length == 0">
              还没有评论哦，快来做第一人吧
            </li>
            <!--  -->
            <li v-for="comment in newCommentList" :key="comment.creationtime">
              <p>
                <router-link
                  :to="{
                    name: 'articleInfo',
                    params: {},
                    query: { id: comment.aid },
                  }"
                >
                  {{ comment.atitle }}
                </router-link>
              </p>
              <p>
                <a class="disabled">{{ comment.observerName + "：" }}</a>
                <span>{{ comment.content }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      user: {
        uid: 1,
        uname: "June",
      },
      articleList: [],
      atypes: [],
      newCommentList: [],
      aLastId: 1,
      likenum: 0,
      token: window.localStorage.getItem("sessiontoken"),
    };
  },
  methods: {
    getArticleAll() {
      this.$http({
        url: `/?uid=${this.user.uid}`,
        method: "get",
      }).then((backdata) => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.articleList = data;
          if (data.length > 0) {
            this.aLastId = data[data.length - 1].aid;
          }
        } else {
          this.$message.error("博客数据获取失败:" + meta.msg);
        }
      });
    },
    getAtypes() {
      this.$http({
        url: `/atypes?uid=${this.user.uid}`,
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
    getNewComments() {
      this.$http({
        url: `newComments?uid=${this.user.uid}`, // + this.uid,
        method: "get",
      }).then((backdata) => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.newCommentList = data;
        } else {
          this.$message.error("最新评论获取失败");
        }
      });
    },
    getLikeNum() {
      this.$http({
        url: `/likenum?uid=${this.user.uid}`,
        method: "get",
      }).then((backdata) => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.likenum = data.likenum;
        }
      });
    },
    addLikenum() {
      this.$http({
        url: `/likenum?uid=${this.user.uid}&n=${this.likenum + 1}`,
        method: "put",
      }).then((backdata) => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.likenum = data.likenum;
        }
      });
    },
    logout() {
      window.localStorage.removeItem("sessiontoken");
      window.sessionStorage.removeItem("user");
      this.$message({
        type: "success",
        message: "退出成功",
      });
      this.$router.push({
        path: "/",
      });
    },
    notSupport() {
      alert("暂不支持该功能");
    },
    init() {
      let loginUser = JSON.parse(window.sessionStorage.getItem("user"));
      if (loginUser) {
        this.user = loginUser;
      }
    },
    gotoArticleClass(event, atype) {
      event.preventDefault();
      this.loginAuth(
        function (mythis) {
          mythis.$router.push({
            name: "articleClass",
            query: { atype },
          });
        },
        function (mythis) {
          mythis.$message.error("请登录");
        }
      );
      return false;
    },
    gotoArticleConsole(event) {
      event.preventDefault();
      this.loginAuth(
        function (mythis) {
          mythis.$router.push({
            name: "articleConsole",
          });
        },
        function (mythis) {
          mythis.$message.error("请登录");
        }
      );
    },
    // 登录验证
    loginAuth(callbackTrue, callbackFalse) {
      // 成功的回调和失败的回调
      let value = this.$http({
        url: "loginAuth",
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("sessiontoken"),
        },
      }).then((backdata) => {
        if (backdata.data.meta.status == 200) {
          callbackTrue(this);
        } else {
          callbackFalse(this);
        }
      });
    },
  },
  mounted() {
    this.init();
    this.getAtypes();
    this.getArticleAll();
    this.getLikeNum();
    this.getNewComments();
  },
};
</script>

<!-- "scoped" 表示 style 仅作用于此组件 -->
<style scoped>
.navBox {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 18px;
}
.navBox .nav-left {
  float: left;
}
.navBox ul.clearfix > li {
  float: left;
  height: 40px;
}
.navBox ul.clearfix > li > a {
  display: block;
  width: inherit;
  height: inherit;
  padding: 0 10px;
  color: #fff;
  line-height: 40px;
  text-align: center;
}
.navBox ul.clearfix > li:hover {
  background-color: #8efafa;
}
.navBox ul.clearfix > li:hover > a {
  color: #000;
}
#classificationList {
  width: 113.5px;
  display: none;
}
#classificationList li {
  padding: 0 5px;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  width: inherit;
  float: left;
  color: #ff0036;
  border-bottom: 1px solid #333;
  background-color: rgba(0, 0, 0, 0.5);
}
#classificationList li a {
  display: block;
  width: 104px;
  text-align: left;
  color: #ffffff;
}
#classificationList li:hover {
  background-color: #8efafa;
}
#classificationList li:hover a {
  color: #333;
}
#classification:hover #classificationList {
  display: block;
}

.navBox .nav-right {
  float: right;
}

.welcome {
  width: 500px;
  height: 200px;
  margin: 135px auto;
  font-size: 100px;
  font-weight: 900;
  line-height: 200px;
  text-align: center;
  color: #6077fc;
  /* background-color: #fff; */
}
.motto {
  width: 70%;
  margin: 0 auto;
  padding: 40px 0;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
  border-radius: 5px;
}
.avatar {
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: lawngreen;
}
.motto h3 {
  margin-top: 20px;
  font-weight: 400;
}
.main-left {
  float: left;
  width: 800px;
}

.main-right {
  width: 400px;
  float: right;
}
.attention {
  margin-top: 40px;
  width: 100%;
  height: 400px;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  text-align: center;
}
.attention span {
  display: block;
  width: 100%;
  height: 230px;
  overflow: hidden;
}
.attention span img {
  width: inherit;
  height: inherit;
}

.attention p .el-link {
  display: inline-block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  border-radius: 50%;
  background-color: #e5e5e5;
  transition: all 0.3s ease-in;
}
.attention p .el-link:hover {
  background-color: #f16a2b;
  color: #fff;
}
.like-me {
  margin-top: 20px;
  width: 100%;
  max-height: 200px;
  padding: 20px 15px;
  background-color: #fff;
  border-radius: 5px;
  text-align: center;
  color: #fd2050;
  font-size: 14px;
  line-height: 25px;
  /* 鼠标变小手 */
  cursor: pointer;
}
.like-me p {
  font-size: 30px;
  line-height: 40px;
}
.newComments {
  position: relative;
  width: 100%;
  margin-top: 20px;
  padding: 80px 10px 15px;
  background-color: #fff;
  border-radius: 5px;
}
.newComments li {
  color: #333;
  font-size: 14px;
  padding: 10px 5px;
  border-bottom: 1px solid #a0ccf5;
}
.newComments li p {
  white-space: nowrap;
  overflow: hidden;
  /* 省略号 */
  text-overflow: ellipsis;
}
.newComments li:last-child {
  border: none;
}
.newComments li .disabled {
  color: #333;
}
</style>
