<template>
    <Layout class="menu-layout">
         <div class="search">
             <Input search style="width:200px; margin-right:10px" placeholder="bean名称" v-model="search"/>
             <Button type="success" style="margin-right:10px" @click= "model=true,modelTitle='新建任务'">新建任务</Button>
              <Button type="info">任务日志</Button>
         </div>
         <Table :columns="colums" :data="data" stripe border :loading=" tableloading"></Table>
         <div class="div">
              <div>
                  <Button type="primary" style="margin-right:2px" >批量立即运行</Button>
                  <Button type="success" style="margin-right:2px" >批量恢复</Button>
                  <Button type="error" style="margin-right:2px" >批量删除</Button>
                  <Button type="warning" style="margin-right:2px" >批量停止</Button>
              </div>
              
         </div>
         <Modal v-model="model" :title="modelTitle"  @on-ok="request">
             <Form >
                 <FormItem label="bean名称">
                     <Input v-model="form.beanName" />
                 </FormItem>
                 <FormItem label="方法名称">
                     <Input v-model="form.methodName" />
                 </FormItem>
                 <FormItem label="cron表达式" >
                     <Input v-model="form.cronExpression"/>
                 </FormItem>
                 <FormItem label="状态" >
                     <iSwitch :true-value='1' :false-value='0' v-model="form.status"/>
                 </FormItem>
                 <FormItem label="参数" >
                     <Input  v-model="form.params" />
                 </FormItem>
                 <FormItem label="备注"  >
                     <Input v-model="form.remark"/>
                 </FormItem>
             </Form>
         </Modal>
    </Layout>
</template>

<script>
import http from "@/views/until/http";
    export default {
        created () {
            this.getSchedu()
        },
        watch:{
            search(){
                this.getSchedu()
            }
        },
        methods: {
            request(){
                 this.tableloading=true
                 http.post('/sys/schedule/save',this.form).then(({data})=>{
                      if(data.code===0){
                              this.getSchedu()
                      }else if(data.code===500){
                          this.$Message.error({
                            content: data.msg
                           });
                      }
                      this.tableloading=false
                 })
            },
            getSchedu(){
                this.tableloading=true
                http.get('/sys/schedule/list',{
                    params:{
                         page: this.currPage,
                        limit: this.limit,
                        sidx: "jobId",
                        order: "asc",
                        beanName: this.search
                    }
                }).then(({data})=>{
                    console.log(data)
                   const {msg,code,page}=data
                   if(code===0){
                       const {currPage,list,pageSize,totalCount,totalPage}=page 
                        this.data=list
                          this.limit=pageSize
                          this.currPage=currPage
                          this. totalCount=totalCount
                           this.totalPage=totalPage
                   }
                   else if(code===500){
                        this.$Message.error({
                            content: msg
            });
                   }
                   this.tableloading=false
                })
            }
        },
        data() {
            return {
                tableloading:false,
                form:{
                     jobId: 0,
                    beanName: "",
                    methodName: "",
                    params: "",
                    cronExpression: "",
                    status:0,
                    remark: "",
                     createTime: "2019-01-16T06:31:59.072Z"
                },
                modelTitle:'', //模态框的标题
                model:false,//模态框显示与隐藏
                search:'', //搜索的数据
                 limit: 6,
                totalCount: 1, //用户总数
                totalPage: 1, //页码总数
                currPage: 1, //当前页码
                colums:[
                     {
                         type: 'selection',
                         width: 60,
                        align: 'center'
                    },
                    {
                        title: 'Id',
                          align: 'center',
                        key: 'jobId'
                    },
                     {
                        title: 'bean名称',
                         align: "center",
                        key: 'beanName'
                        
                    },
                     {
                        title: '方法名称',
                           align: "center",
                        key: 'jobId'
                    },
                     {
                        title: '参数',
                           align: "center",
                        key: 'params'
                    },
                     {
                        title: 'cron表达式',
                           align: "center",
                        key: 'cronExpression'
                    },
                     {
                        title: '备注',
                           align: "center",
                        key: 'remark'
                    },
                     {
                        title: '状态',
                           align: "center",
                        key: 'status',
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
                        title: '操作',
                         align: "center",
                        render:(h,params)=>{
                            return h('div',[
                                h('Button',{
                                    props:{
                                       type:"primary", 
                                       size:'small',
                                       
                                    },
                                    style:{
                                        marginRight:'10px',
                                    }
                                },'运行'),
                                  h('Button',{
                                    props:{
                                       type:"info", 
                                       size:'small',
                                    }
                                },'修改'),
                                  h('Button',{
                                    props:{
                                       type:"success", 
                                       size:'small',
                                    }
                                },'恢复'),
                                  h('Button',{
                                    props:{
                                       type:"warning", 
                                       size:'small',
                                    }
                                },'停止'),
                                  h('Button',{
                                    props:{
                                       type:"error", 
                                       size:'small',
                                    }
                                },'删除')
                            ])
                        }
                    },
                ],
                data:[],
            }
        },
    }
</script>

<style scoped>
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
.div{
    display: flex;
    justify-content: space-between;
    padding:10px 0
}

</style>