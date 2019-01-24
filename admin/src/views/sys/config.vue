<template>
     <Layout class="menu-layout">
        <div class="search" >
           <Input search  style="width:200px; margin-right:10px" placeholder="参数名" v-model="search"/>
        <Button type="success" @click= "showModal=true,ModalTitle='添加参数配置'" >新增</Button>
        </div>
        <Table @on-selection-change="(selection)=>selectList=selection" :columns="columns" :data="data"  stripe :loading=" tableLoading"></Table>
        <div class="div">
              <Button type="error" @click="deleteMany">批量删除</Button>
            <Page :total="20" :current.sync="currPage"/>
          </div>
          <Modal v-model="showModal" :title=" ModalTitle" @on-ok="request " :loading=" Modalloading">
              <Form >
                  <FormItem label="参数名" >
                      <Input v-model="form.paramKey"/>
                  </FormItem>
                    <FormItem label="参数值">
                      <Input v-model="form.paramValue"/>
                  </FormItem>
                    <FormItem label="备注" >
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
            this.getconfigList()
        },
        methods: {
            deleteMany(){    //批量删除方法
                const deleteList=this.selectList.map((item)=>item.id)
                console.log(deleteList)
                if(deleteList.length===0){
                   return this.$Notice.error({
                        title:"批量删除",
                        desc:'请选择批量删除的数据',
                    })
                }
                    this.$Modal.confirm({
                       title:"批量删除",
                       content:'你正在批量删除用户，确认删除吗？',
                       loading:true,
                       onOk:() =>{
                           http.post("/sys/config/delete",deleteList).then(({data})=>{
                               if(data.code===0){
                                   this.$Notice.success({
                                       title:'操作成功',
                                       desc:'批量删除成功'
                                   })
                                   this.getconfigList()
                               }else {
                                   this.$Notice.error({
                                       title:'操作失败',
                                       desc:data.msg
                                   })
                                   
                               }
                               this.$Modal.remove()
                           })
                       }
                   })
                
            },
            request(){
                this.Modalloading=true
                 this.tableLoading=true
                if(this.ModalTitle==="添加参数配置"){
                     http.post('/sys/config/save',this.form).then(({data})=>{
                     console.log(data)
                     const {code,msg}=data
                     if(code===0){
                          this.getconfigList()
                     }else{
                          this.$Message.error({
                          content: msg
            });
                     }
                 })
                }else if(this.ModalTitle==='修改参数配置'){
                     http.post('/sys/config/update',this.form).then(({data})=>{
                    
                     const {code,msg}=data
                     if(code===0){
                          this.getconfigList()
                     }else{
                          this.$Message.error({
                          content: msg
            });
                     }
                 })
                }
                  this.tableLoading = false;
                  this.Modalloading=false
                     this.form={
                          id:0,
                        paramKey:"",
                        paramValue:'',
                        remark:""
                     }
            },
          getconfigList(){
              this.tableLoading=true;
              http.get('/sys/config/list',{
                  params:{
                        page:this.currPage,
                          limit:this.limit,
                          sidx:'id',
                          order:'asc',
                          key:this.search
                  }
              }).then(({data}) =>{
                  console.log(data)
                  const {code,page,msg}=data
                  if(code===0){
                     const {currPage,list,pageSize,totalCount,totalPage}=page
                           this.currPage=currPage,
                           this.data=list,
                           this.pageSize=pageSize,
                           this.totalCount=totalCount,
                           this.totalPage=totalPage
                  }else if(code===500){
                      this.$Message.error({
                            content: msg
            });
                  }
                  this.tableLoading=false
              })
          }
        },
        data() {
            return {
                selectList:"",  //批量删除的数据
                 Modalloading:false,//模态框加载
                search:"", //搜索关键字
                form:{
                   id: 0,
                    paramKey: "",
                    paramValue: "",
                    remark: ""
                },
                  totalPage:1,
               totalCount: 1,
               currPage: 1,  //当前页码
                limit:8,   
                tableLoading:false, //table加载状态
                ModalTitle:"",
                showModal:false,
                columns:[
                    {
                         type: 'selection',
                         width: 60,
                        align: 'center'
                    },
                     {
                        title: 'ID',
                         align: 'center',
                        key: 'id',
                        sortable: true
                    },
                    {
                        title: '参数名',
                         align: 'center',
                        key: ' paramKey'
                    },
                    {
                        title: '参数值',
                         align: 'center',
                        key: ' paramValue'
                    },
                    {
                        title: '备注',
                         align: 'center',
                        key: 'remark'
                    },
                     {
                        title: '操作',
                        align: 'center',
                        render:(h,params)=>{
                            console.log(params)
                           return h ('div',[
                               h('Button',{
                                   props:{
                                         size: "small",
                                         type: "primary"
                                   },
                                    on:{
                                        click:()=>{
                                             this.showModal=true
                                           this.ModalTitle='修改参数配置'
                                          const {id,paramKey,remark,paramValue}=params.row
                                          this.form={
                                               id,
                                                paramKey,
                                                paramValue,
                                                remark,
                                          }
                                        }
                                    },
                                   style:{
                                       marginRight:'10px'
                                   },
                               },'修改'),
                                 h('Button',{
                                   props:{
                                         size: "small",
                                         type: "error"
                                   },
                                                   on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: `你正在删除用户,<b>${
                          params.row.id
                        }</b>是否确认删除？`,
                        onOk: () => {
                          http
                            .post("/sys/config/delete", [params.row.id])
                            .then(({ data }) => {
                              if (data.code === 0) {
                                this.$Notice.success({
                                  title: "操作成功",
                                  desc: `用户：${params.row.id}已删除`
                                });
                                this.getconfigList();
                              } else {
                                this.$Notice.error({
                                  title: "操作失败",
                                  desc: `用户：${params.row.id}删除失败`
                                });
                              }
                            });
                        }
                      });
                    }
                  }
                               },'删除')
                           ])
                         }
                    },
                ],
                data:[]
                
            }
        },
         watch:{
           search(v){
               this.getconfigList()
           },
           currPage(){
               this.getconfigList()
           }
        },
    }
</script>

<style scoped>
.menu-layout{
    position: absolute;
    margin: 10px ;
    width: 95%;
    height: 100%;
    padding: 10px;
 
    
}
.menu-layout .search{
    padding: 15px  0;

}
.div{
    display: flex;
    justify-content: space-between;
    padding:10px 0
}
</style>