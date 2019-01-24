<template>
  <Layout class="menu-layout">
    <div class="search">
      <Input search style="width:200px; margin-right:10px" placeholder="用户名" v-model="search"/>
      <Button type="success" @click="showModal=true,modalData='新增用户'" v-model="search">新增</Button>
    </div>
    <Table
      border
      :columns="columns"
      :data="data"
      :loading="tableLoading"
      @on-selection-change="(selection)=>selectList=selection"
    />
    <Modal v-model=" showModal" :title="modalData" @on-ok="request" :loading=" Modalloading">
      <Form>
        <Form-item label="账号">
          <Input v-model="form.username"/>
        </Form-item>
        <Form-item label="密码">
          <Input v-model="form.password"/>
        </Form-item>
        <Form-item label="邮箱">
          <Input v-model="form.email"/>
        </Form-item>
        <Form-item label="手机号">
          <Input v-model="form.mobile"/>
        </Form-item>
        <Form-item label="状态">
          <iSwitch v-model="form.status" :true-value="1" :false-value="0"/>
        </Form-item>
      </Form>
    </Modal>

    <div class="div">
      <Button type="error" @click="deleteMany">批量删除</Button>
      <Page :total="20" :current.sync="currPage"/>
    </div>
  </Layout>
</template>

<script>
import http from "@/views/until/http";
export default {
  created() {
    this.getUserlist();
  },
  data() {
    return {
      selectList: [], //多选数据
      tableLoading: false, //表格加载状态
      modalData: "", //模态框标题
      search: "", //搜索内容
      columns: [
        //表格列
        {
          type: "selection",
          align: "center",
          width: 50
        },
        {
          title: "Id",
          align: "center",
          width: 150,
          sortable: true,
          key: "userId"
        },
        {
          title: "用户名",
          align: "center",
          key: "username"
        },
        {
          title: "邮箱",
          align: "center",
          key: "email"
        },
        {
          title: "手机",
          align: "center",
          key: "mobile"
        },
        {
          title: "状态",
          align: "center",
          key: "status",
          render: (h, params) => {
            return h(
              "iSwitch",
              {
                props: {
                  value: params.row.status,
                  "true-value": 1,
                  "false-value": 0
                }
              },
              [
                h(
                  "span",
                  {
                    slot: "open"
                  },
                  "启"
                ),
                h(
                  "span",
                  {
                    slot: "close"
                  },
                  "禁"
                )
              ]
            );
          }
        },
        {
          title: "创建时间",
          align: "center",
          sortable: true,
          key: "createTime"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.showModal = true;
                      this.modalData = "修改用户";
                      const {
                        userId,
                        username,
                        password,
                        email,
                        mobile,
                        status,
                        roleIdList
                      } = params.row;
                      this.form = {
                        userId,
                        username,
                        password: "",
                        email,
                        mobile,
                        status,
                        roleIdList
                      };
                    }
                  },
                  style: {
                    marginRight: "6px"
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    type: "error"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: `你正在删除用户,<b>${
                          params.row.username
                        }</b>是否确认删除？`,
                        onOk: () => {
                          http
                            .post("/sys/user/delete", [params.row.userId])
                            .then(({ data }) => {
                              if (data.code === 0) {
                                this.$Notice.success({
                                  title: "操作成功",
                                  desc: `用户：${params.row.username}已删除`
                                });
                                this.getUserlist();
                              } else {
                                this.$Notice.error({
                                  title: "操作失败",
                                  desc: `用户：${params.row.username}删除失败`
                                });
                              }
                            });
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: [], //表格数据
      limit: 6,
      totalCount: 1, //用户总数
      totalPage: 1, //页码总数
      currPage: 1, //当前页码
      showModal: false, //是否显示添加的窗口
      Modalloading: false, //模态框加载的loading
      form: {
        //增加成员的数据
        userId: 0,
        username: "",
        password: "",
        email: "",
        mobile: "",
        status: 1,
        roleIdList: []
      }
    };
  },
  watch: {
    search() {
      this.getUserlist();
    },
    currPage() {
      this.getUserlist();
    }
  },
  methods: {
    //批量删除方法
    deleteMany() {
      const deletetList = this.selectList.map(item => item.userId);
      if (deletetList.length === 0) {
        return this.$$Notice.error({
          title: "批量删除",
          desc: "请选择要删除的用户"
        });
      }
      this.$Modal.confirm({
        title: "批量删除",
        content: "你正在删除多个用户，确认删除吗？",
        loading: true,
        onOk: () => {
          http.post("/sys/user/delete", deletetList).then(({ data }) => {
            if (data.code === 0) {
              this.$Notice.success({
                title: "批量操作成功",
                desc: `用户已删除`
              });
              this.getUserlist();
            } else {
              this.$Notice.error({
                title: "操作失败",
                desc: `删除失败`
              });
            }
            this.$Modal.remove()
          });
        }
      });
    },
    getUserlist() {
      this.tableLoading = true;
      http
        .get("/sys/user/list", {
          params: {
            page: this.currPage,
            limit: this.limit,
            sidx: "userId",
            order: "asc",
            username: this.search
          }
        })
        .then(({ data }) => {
          const { code, msg, page } = data;
          console.log(page);
          if (code === 0) {
            const { list, pageSize, totalCount, totalPage, currPage } = page;
            (this.data = list),
              (this.limit = pageSize),
              (this.totalCount = totalCount),
              (this.totalPage = totalPage),
              (this.currPage = currPage);
          } else if (code === 500) {
            this.$Message.error({
              content: msg
            });
          }
          this.tableLoading = false;
        });
    },
    request() {
      this.Modalloading = true;
      if (this.modalData === "新增用户") {
        http.post("/sys/user/save", this.form).then(({ data }) => {
          const { code, msg } = data;
          if (code === 0) {
            this.getUserlist();
          } else {
            this.$Message.error({
              content: msg
            });
          }
        });
      } else if (this.modalData === "修改用户") {
        http.post("/sys/user/update", this.form).then(({ data }) => {
          const { code, msg } = data;
          if (code === 0) {
            this.getUserlist();
          } else {
            this.$Message.error({
              content: msg
            });
          }
        });
      }
      //清空管理员状态
      this.Modalloading = false;
      this.form = {
        userId: 0,
        username: "",
        password: "",
        email: "",
        mobile: "",
        status: 1,
        roleIdList: []
      };
    }
  }
};
</script>

<style>
.menu-layout {
  position: absolute;
  margin: 10px;
  width: 95%;
  height: 100%;
  padding: 10px;
}
.menu-layout .search {
  padding: 15px 0;
}
.div {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
</style>