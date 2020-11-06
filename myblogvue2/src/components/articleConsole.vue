<template>
  <div class="main">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="firstlable" name="first">
        <ul v-if="pagination.total == 0">
          <li style="line-height：30px;font-size:20px; color:#ff0036;">
            还没有发表过任何文章
          </li>
        </ul>
        <ul v-else>
          <li v-for="item in pagination.data" :key="item.aid">
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
                      ><i class="iconfont">&#xe60b;</i>&nbsp;{{
                        item.likes
                      }}</span
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
                  <el-button type="text">
                    <router-link
                      :to="{
                        name: 'writing',
                        params: {
                          uid: item.uid,
                          isdraft: false,
                          ainfo: item,
                        },
                      }"
                    >
                      编辑
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
        <!-- 分页 -->
        <el-pagination
          hide-on-single-page
          @current-change="pageChande"
          layout="total,  prev, pager, next"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          background
          style="margin-left: 28%"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="草稿箱" name="third">
        <ul v-if="this.draftList.length == 0">
          <li style="line-height：30px;font-size:20px; color:#ff0036;">
            草稿箱空空如也{{ this.draftList.length }}
          </li>
        </ul>
        <ul v-else>
          <li v-for="item in this.draftList" :key="item.aid">
            <div class="main-item">
              <p class="article-title">
                <router-link
                  :to="{
                    name: 'writing',
                    params: {
                      uid: item.uid,
                      aLastId,
                      isdraft: true,
                      ainfo: item,
                    },
                  }"
                  >{{ item.atitle }}
                </router-link>
              </p>
              <el-row :gutter="20">
                <el-col :span="20">
                  <p class="item-info">
                    <span style="color: #f57c0a">草稿</span>
                    <span>创建于 {{ item.creationtime_first }}</span>
                  </p>
                </el-col>
                <el-col :span="4">
                  <el-button type="text">
                    <router-link
                      :to="{
                        name: 'writing',
                        params: {
                          uid: item.uid,
                          aLastId,
                          isdraft: true,
                          ainfo: item,
                        },
                      }"
                    >
                      编辑
                    </router-link>
                  </el-button>
                  <el-button
                    type="text"
                    class="delbtn"
                    @click="delArticle(item.uid, item.aid, true)"
                    >删除</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: { uid: 1, uname: "June" },
      firstlable: "已发布",
      activeName: "first",
      articleList: [],
      draftList: [],
      aLastId: 1,
      pagination: {
        data: [], // 显示的数据
        total: undefined, // 总条目数
        pageSize: 6, // 一页的条目数
        currentPage: 1,
      },
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 获取已发布的文章
    getArticleAll() {
      this.$http({
        url: `/?uid=${this.user.uid}`,
        method: "get",
      }).then((backdata) => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.articleList = data;

          this.pagination.total = this.articleList.length;
          if (this.pagination.total > 0) {
            this.aLastId = this.articleList[this.pagination.total - 1].aid;
          }
          this.firstlable = `已发布 (${this.pagination.total})`;

          // 应该设置一下当前页
          if (
            this.pagination.currentPage > this.maxPage &&
            this.pagination.currentPage > 1
          ) {
            this.pagination.currentPage -= 1;
          }
          this.pagination.data = this.articleList.slice(
            this.startIndex,
            this.endIndex
          );
        } else {
          this.$message.error("数据获取失败:" + meta.msg);
        }
      });
    },

    // 获取草稿
    getDraftAll() {
      this.$http({
        url: `/draft?uid=${this.user.uid}`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("sessiontoken"),
        },
      }).then((backdata) => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.draftList = data;
        } else {
          this.$message.error("草稿数据获取失败：" + meta.msg);
        }
      });
    },

    // 分页设置
    pageChande(num) {
      this.pagination.currentPage = num; // num 为当前的页码
      this.pagination.data = this.articleList.slice(
        this.startIndex,
        this.endIndex
      );
    },

    // 删除文章
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

    loginDetect() {
      if (window.localStorage.getItem("sessiontoken")) {
        this.init();
        this.getArticleAll();
        this.getDraftAll();
      } else {
        this.$message.error("请登录");
        this.$router.push({
          path: "/",
        });
      }
    },
    init() {
      let loginUser = JSON.parse(window.sessionStorage.getItem("user"));
      if (loginUser) {
        this.user = loginUser;
      } else {
      }
    },
  },

  // 计算属性的声明
  computed: {
    maxPage: function () {
      return Math.ceil(this.pagination.total / this.pagination.pageSize);
    },
    startIndex: function () {
      return (this.pagination.currentPage - 1) * this.pagination.pageSize;
    },
    endIndex: function () {
      let end =
        (this.pagination.currentPage - 1) * this.pagination.pageSize +
        this.pagination.pageSize;
      return end > this.pagination.total ? this.pagination.total : end;
    },
  },
  mounted() {
    this.loginDetect();
  },
};
</script>
<style scoped>
.main {
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