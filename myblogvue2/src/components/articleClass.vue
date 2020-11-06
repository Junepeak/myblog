<template>
  <div class="mainBox">
    <ul v-if="articleList.length == 0">
      <li style="line-height：30px;font-size:20px; color:#ff0036;">
        还没有发表过任何文章
      </li>
    </ul>
    <ul v-else>
      <li v-for="item in articleList" :key="item.aid">
        <div class="main-item">
          <p class="article-title">
            <router-link
              :to="{
                name: 'articleInfo',
                params: { item },
                query: { id: item.aid },
              }"
              >{{ item.atitle }}</router-link
            >
          </p>
          <el-row :gutter="20">
            <el-col :span="19">
              <p class="item-info">
                <span>原创</span>
                <span>{{ item.creationtime_first }}</span>
                <span class="el-icon-view">&nbsp;{{ item.views }} </span>
                <span class="el-icon-chat-line-round"
                  >&nbsp;{{ item.comments }}</span
                >
                <span
                  ><i class="iconfont">&#xe60b;</i>&nbsp;{{ item.likes }}</span
                >
              </p>
            </el-col>
            <el-col :span="5">
              <el-button type="text">
                <router-link
                  :to="{
                    name: 'articleInfo',
                    params: { item },
                    query: { id: item.aid },
                  }"
                >
                  查看
                </router-link>
              </el-button>
              <el-button
                type="text"
                class="delbtn"
                @click="delArticle(item.uid, item.aid, false)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      articleList: [],
      atype: "", // 值从 home 传入
      user: { uid: 1, uname: "June" }, // 值从 sessionStorage 获取
    };
  },
  methods: {
    getArticleAll() {
      this.$http({
        url: `/articleClass?uid=${this.user.uid}&atype=${this.atype}`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("sessiontoken"),
        },
      }).then((backdata) => {
        // console.log(backdata.data);
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.articleList = data;
        } else {
          if (meta.msg == "无效的 token") {
            this.$message.error("请登录");
          } else {
            this.$message.error("博客数据获取失败:" + meta.msg);
          }
          this.$router.push({
            path: "/",
          });
        }
      });
    },
    delArticle(uid, aid, isdraft) {
      if (confirm("确认删除吗")) {
        this.$http({
          url: `/delarticle?aid=${aid}&isdraft=${isdraft}`,
          method: "delete",
          headers: {
            Authorization: window.localStorage.getItem("sessiontoken"),
          },
        }).then((backdata) => {
          let { data, meta } = backdata.data;
          if (meta.status == 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            if (isdraft) {
              this.getDraftAll();
            } else {
              this.getArticleAll();
            }
          } else {
            this.$message.error("删除失败：" + meta.msg);
          }
        });
      }
    },
    init() {
      let loginUser = JSON.parse(window.sessionStorage.getItem("user"));
      if (loginUser) {
        this.user = loginUser;
      } else {
      }
      this.atype = this.$route.query.atype;
    },
  },
  mounted() {
    this.init();
    this.getArticleAll();
  },
};
</script>
<style scoped>
.mainBox {
  margin-top: 40px;
  padding: 0 20px;
  background-color: #fff;
}
ul li {
  position: relative;
  width: 100%;
  padding: 20px 20px 0px;
  border-radius: 5px;
}
ul li:last-child .main-item {
  border: none;
}

.main-item {
  border-bottom: 1px solid #e5e5e5;
}
.main-item .article-title a {
  font-size: 21px;
  color: #333;
}
.main-item .item-info {
  font-size: 14px;
  margin: 7.5px 0;
}
.item-info span {
  margin-right: 20px;
}
.el-button a {
  color: #409eff;
}
.delbtn {
  color: #ca0c16;
}
.item-description {
  margin-top: 50px;
  text-align: left;
  font-size: 14px;
  /* 首行缩进两个汉字 */
  text-indent: 2em;
}
.item-img img {
  width: 100%;
  max-height: 300px;
}
.label {
  top: 90px;
}
</style>