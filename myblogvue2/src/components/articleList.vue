<template>
  <div class="mainBox">
    <ul v-if="aLastId == 1">
      <li style="font-size: 20px">还没有发布过任何文章哦</li>
    </ul>
    <ul v-else>
      <li v-for="item in articleList" :key="item.aid">
        <span class="label" v-if="item.atype">{{ item.atype }}<i></i></span>
        <div class="main-item">
          <h6>{{ item.atitle }}</h6>
          <p class="item-info">
            <span class="el-icon-user" v-if="item.creationtime_last">
              最后发表于&nbsp;{{ item.creationtime_last }}&nbsp;•
            </span>
            <span class="el-icon-user" v-else>
              发表于&nbsp;{{ item.creationtime_first }}&nbsp;•
            </span>
            <span class="el-icon-view">
              &nbsp;{{ item.views }}&nbsp;次围观&nbsp;•
            </span>
            <span class="el-icon-chat-line-round">
              &nbsp;评论&nbsp;{{ item.comments }}&nbsp;条&nbsp;•
            </span>
            <span class="iconfont">&#xe60b;</span>
            <span>&nbsp;{{ item.likes }}&nbsp;点赞&nbsp;</span>
          </p>
          <p class="item-description">{{ item.summary }}</p>
          <p class="item-img"><img src="" alt="" /></p>
          <router-link
            :to="{
              name: 'articleInfo',
              params: { item },
              query: { id: item.aid },
            }"
            >阅读全文</router-link
          >
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
      aLastId: 1,
      user: { uid: 1, uname: "June" },
    };
  },
  methods: {
    getArticleAll() {
      // console.log("home：我获取了博客");
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
    init() {
      let loginUser = JSON.parse(window.sessionStorage.getItem("user"));
      if (loginUser) {
        this.user = loginUser;
      } else {
      }
    },
  },
  mounted() {
    this.init();
    this.getArticleAll();
  },
};
</script>
<style scoped>
ul li {
  position: relative;
  width: 800px;
  margin-top: 40px;
  padding: 20px;
  background-color: #fff000;
  border-radius: 5px;
}

.main-item {
  text-align: center;
}
.main-item h6 {
  font-size: 24px;
}
.main-item .item-info {
  font-size: 12px;
  margin-top: 10px;
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