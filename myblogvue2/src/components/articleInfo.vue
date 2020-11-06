<template>
  <div>
    <div class="ainfo-mian">
      <div>
        <div class="article-head">
          <h6>{{ item.atitle }}</h6>
          <span class="label" v-if="item.atype">{{ item.atype }}<i></i></span>
          <p class="articl-info">
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
        </div>
        <div
          v-html="item.content_html"
          class="article-content markdown-body"
        ></div>
      </div>
    </div>
    <div class="toolbox">
      <el-row>
        <el-button type="info" @click="addLikes" v-if="likeState">
          <i class="iconfont" style="color: #ff0036">&#xe60b;</i>&nbsp;已赞
          {{ articleLikes }}
        </el-button>
        <el-button type="info" @click="addLikes" v-else>
          <i class="iconfont">&#xe60b;</i>&nbsp;点赞 {{ articleLikes }}
        </el-button>
        <el-button type="info" @click="gotowirtecomment">
          <i class="iconfont">&#xe60c;</i>&nbsp;评论
        </el-button>
      </el-row>
    </div>
    <div class="commentsBox">
      <el-form>
        <label class="commentLabel" for="wirtecomment">编辑评论</label>
        <el-input
          v-model="commentItemObj.content"
          type="textarea"
          :placeholder="commentPrompt"
          id="wirtecomment"
        />
      </el-form>
      <button type="submit" id="submitComment" @click="submitComment">
        发表评论
      </button>
      <div class="commentListBox">
        <ul
          class="commentList"
          v-for="parentItem in commentList"
          :key="parentItem.cid"
        >
          <li class="parentComment clearfix">
            <div class="floatLeft">
              <a href="javascript:void(0)" class="disabled">
                <img :src="parentItem.observerAvatar" alt="头像" />
              </a>
            </div>
            <p>
              <a href="javascript:void(0)" class="disabled">
                {{ parentItem.observerName + "：" }}
              </a>
              <span>
                {{ parentItem.content }}
              </span>
              <span class="time">{{ parentItem.creationtime }}</span>
              <el-link
                @click="replyComment(parentItem)"
                type="info"
                :underline="false"
                icon="el-icon-edit"
              >
                回复&nbsp;
              </el-link>
              <el-link
                @click="openPrompt(parentItem)"
                type="info"
                :underline="false"
                icon="el-icon-delete"
              >
                删除
              </el-link>
            </p>
            <div class="floatRight" style="display: none">点赞</div>
          </li>
          <li class="replayBox">
            <ul>
              <li
                v-for="childItem in parentItem.childs"
                :key="childItem.cid"
                class="clearfix"
              >
                <div class="floatLeft">
                  <a href="javascript:void(0)" class="disabled">
                    <img :src="childItem.observerAvatar" alt="头像" />
                  </a>
                </div>
                <p>
                  <a href="javascript:void(0)" class="disabled">
                    {{ childItem.observerName }}
                  </a>
                  <i>回复</i>
                  <a
                    href="javascript:void(0)"
                    class="disabled"
                    v-if="childItem.toUName"
                  >
                    {{ childItem.toUName }}
                  </a>
                  <span>
                    {{ "：" + childItem.content }}
                  </span>
                  <span class="time">{{ childItem.creationtime }}</span>
                  <el-link
                    @click="replyComment(childItem)"
                    type="info"
                    :underline="false"
                    icon="el-icon-edit"
                  >
                    回复&nbsp;
                  </el-link>
                  <el-link
                    @click="openPrompt(childItem)"
                    type="info"
                    :underline="false"
                    icon="el-icon-delete"
                  >
                    删除
                  </el-link>
                </p>
                <div class="floatRight" style="display: none">点赞</div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 解决方法：利用不会被销毁 query 参数重新获取相关数据
      item: {
        // 为了不报错，提前声明
        uid: undefined,
        aid: undefined,
        atitle: "",
        summary: "",
        content_value: "",
        content_html: "",
        creationtime_first: undefined,
        creationtime_last: undefined,
        atype: "",
        likes: undefined,
        comments: undefined,
        views: undefined,
        astate: 1,
      },
      articleLikes: undefined,
      likeState: false,
      commentList: [],
      commentItemObj: {},
      nextCid: undefined,
      commentPrompt: "说点什么呢...",
    };
  },
  methods: {
    // 为本文点赞
    addLikes() {
      this.likeState = !this.likeState;
      if (this.likeState) {
        this.articleLikes += 1;
      } else if (this.articleLikes > 0) {
        this.articleLikes -= 1;
      }
      this.$http({
        url: `putlikes?uid=${this.item.uid}&aid=${this.item.aid}&articleLikes=${this.articleLikes}`,
        method: "put",
      }).then((backdata) => {
        // console.log("点赞反馈：", backdata.data);
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          console.log("点赞成功");
        } else {
          console.log("点赞失败");
        }
      });
    },
    // 获取本文的所有评论
    getComments() {
      this.$http({
        url: `/comment?uid=${this.item.uid}&aid=${this.item.aid}`,
        method: "get",
      }).then((backdata) => {
        // console.log("获取本文评论反馈：", backdata.data);
        let { data, meta } = backdata.data;
        // console.log("获取本文评论反馈：", data);
        if (meta.status == 200) {
          this.commentList = data.commentList;
          this.nextCid = data.nextCid;
          this.item.comments = data.commentnum;
        } else {
          this.$message.error("评论数据获取失败");
        }
      });
    },
    // 使评论编辑框获得焦点
    gotowirtecomment() {
      $("#wirtecomment").focus();
    },
    // 提交评论
    submitComment() {
      if (this.commentItemObj.content == "") {
        // console.log("要说点什么才能发表哦");
        $("#submitComment").text("要说点什么才能发表哦...");
        setTimeout(() => {
          $("#submitComment").text("发表评论");
        }, 1000);
        return;
      }
      this.commentItemObj.uid = this.item.uid;
      this.commentItemObj.aid = this.item.aid;
      this.commentItemObj.cid = this.nextCid;
      this.commentItemObj.atitle = this.item.atitle;

      // 上面的三个可以写在初始化里面
      this.commentItemObj.observerName = "游客";
      // 以后需要设置 observer 的内容

      this.commentItemObj.creationtime = Date.now();
      this.$http({
        url: "/comment",
        method: "post",
        data: {
          commentItemObj: this.commentItemObj,
          commentnum: this.item.comments + 1,
        },
      }).then((backdata) => {
        let { data, meta } = backdata.data;
        // console.log(data);
        if (meta.status == 200) {
          this.getComments();
          this.commentItemObjInit();
          this.commentPrompt = "说点什么呢...";
        } else {
          this.$message.error("评论发表失败：" + meta.msg);
        }
      });
    },
    // 回复评论
    replyComment(toComment) {
      this.commentItemObj.toCid = toComment.cid;
      if (toComment.parentCid == 0) {
        this.commentItemObj.parentCid = toComment.cid;
      } else {
        this.commentItemObj.parentCid = toComment.parentCid;
      }
      if (this.commentItemObj.parentCid != 0) {
        this.commentItemObj.toUName = toComment.observerName;
      }
      this.commentPrompt = `回复：${toComment.observerName}`;
      this.gotowirtecomment();
    },
    // 删除评论
    // 删除规则：一条评论被删除，那么该评论的子评论，以及回复该评论的评论都会被删除（不可恢复）
    delComment(comment) {
      let { aid, cid } = comment;
      this.$http({
        url: `deleteComment?aid=${aid}&cid=${cid}&commentnum=${
          this.item.comments - 1
        }`,
        method: "delete",
        headers: {
          Authorization: window.localStorage.getItem("sessiontoken"),
        },
      }).then((backdata) => {
        let meta = backdata.data.meta;
        if (meta.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getComments();
        } else if (meta.msg == "无效的 token") {
          this.$message.error("请登录");
        } else {
          this.$message.error("删除失败:" + meta.msg);
        }
      });
    },
    // 评论删除提示框
    openPrompt(comment) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delComment(comment);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 初始化评论对象
    commentItemObjInit() {
      this.commentItemObj = {
        uid: undefined, // 本文所属用的 id
        aid: undefined,
        cid: undefined,
        atitle: this.item.atitle,
        content: "",
        creationtime: undefined,
        agreenum: 0, // 该评论的点赞数
        parentCid: 0, // 默认评论于文章(表示评论的上下层级)
        toCid: 0, // 默认为评论于文章（表示文章的横向层级）
        toUName: "",
        observerName: "",
        observerId: undefined, // 暂时用不到
        observerAvatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png", // 游客随机分配头像，暂时只用固定头像
        observerHome: "", // 游客为 空(用不到，还没实现多用户模式)
      };
    },
    // 增加浏览量
    addViews() {
      this.$http({
        url: "addviews",
        method: "put",
        data: {
          uid: this.item.uid,
          aid: this.item.aid,
          views: this.item.views + 1,
        },
      }).then((backdata) => {
        let meta = backdata.data.meta;
        if (meta.status == 200) {
          // console.log("浏览量增加成功");
          this.item.views += 1;
        } else {
          console.log("浏览量增加失败");
        }
      });
    },
    // 事件绑定
    eventInit() {
      let wc = $("#wirtecomment");
      wc.on("focus", () => {
        wc.css("box-shadow", "0 0 10px #409eff");
      });
      wc.on("blur", () => {
        wc.css("box-shadow", "none");
        if (this.commentItemObj.content == "") {
          this.commentPrompt = "说点什么呢...";
          this.commentItemObjInit();
        }
      });
    },
    init() {
      if (!this.$route.params.item) {
        this.$http({
          url: `articleInfo?id=${this.$route.query.id}`,
          method: "get",
        }).then((backdata) => {
          let { data, meta } = backdata.data;
          // console.log(data);
          if (meta.status == 200) {
            this.item = data;
            this.addViews();
            this.articleLikes = this.item.likes;
            this.getComments();
          } else {
            this.$message.error("文章数据获取失败:" + meta.msg);
          }
        });
      } else {
        this.item = this.$route.params.item;
        // 放在外面会出错，下面两句
        this.addViews();
        this.articleLikes = this.item.likes;
        this.getComments();
      }
      this.commentItemObjInit();
    },
  },
  mounted() {
    this.init();
    this.eventInit();
  },
};
</script>

<style scoped>
.ainfo-mian {
  position: relative;
  width: inherit;
  margin-top: 40px;
  padding: 20px 15px;
  background-color: #fff;
  color: #333;
}
.label {
  top: 100px;
}

.article-head {
  text-align: center;
}
.article-head h6 {
  font-size: 24px;
}
.article-head .articl-info {
  font-size: 14px;
  margin-top: 10px;
}
.article-content {
  margin-top: 60px;
  font-size: 16px;
}
.article-content p {
  text-indent: 2em;
}
/* --------------------- */
.toolbox {
  height: 40px;
  background-color: #e5e5e5;
}
.toolbox .el-row {
  float: right;
}
.toolbox .el-button {
  color: #777;
  background-color: #e5e5e5;
  border-color: transparent;
}
.toolbox .el-button:hover {
  color: #fff;
  background-color: #93c7d4;
}
.toolbox .el-button a:hover {
  color: #fff;
  background-color: #93c7d4;
}
/* --------------------------------- */
.commentsBox {
  padding: 10px;
  margin-top: 10px;
  background-color: #fff;
}
.commentLabel {
  display: block;
  margin: 10px 0 10px 2px;
  font-size: 18px;
  font-weight: 700;
  width: 90px;
}
.commentsBox #submitComment {
  margin: 10px auto 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: #fff;
  background-color: #409eff;
  border-radius: 3px;
}
.commentList {
  margin-top: 20px;
  font-size: 14px;
}
.commentList li .floatRight {
  width: 50px;
}
.commentList li .floatLeft img {
  height: 24px;
  width: 24px;
  border-radius: 50%;
}

.commentList li p {
  float: left;
  width: 86%;
  color: #333;
  margin-left: 10px;
  /* background-color: rgb(250, 148, 148); */
}
.commentList li i {
  font-size: 12px;
  color: #999;
}

.parentComment {
  line-height: 22px;
}
.replayBox {
  margin-top: 10px;
  margin-left: 35px;
  line-height: 22px;
  border-left: 1px solid #e5e5e5;
}
.replayBox p {
  width: 635px;
}
.disabled {
  color: #5c99b1;
}

.time {
  margin: 0 10px;
  color: #999;
  font-size: 12px;
}

.el-link.el-link--info {
  color: #5c99b1;
  font-size: 13px;
}
.el-link.el-link--info:hover {
  color: #a1c1eb;
}
</style>