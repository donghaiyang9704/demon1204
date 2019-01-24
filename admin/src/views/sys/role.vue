<template>
    <Layout class="menu-layout">
          <div class="search" >
        <Input search  style="width:200px; margin-right:10px" placeholder="角色名" v-model="search"/>
        <Button type="success" @click= "showModel=true,modalTitle='新增角色'">新增</Button>
          </div> 
          <Table  @on-selection-change="(selection)=> selectList=selection"    :columns="colums" :data="data"  stripe :loading="tableLoading" ></Table> 
          <div class="div">
              <Button type="error" @click="deleteMany">批量删除</Button>
            <Page :total="200" :current.sync="currPage"/>
          </div>
          <Modal v-model="showModel" :title="modalTitle" @on-ok="request" :loading=" Modalloading">
              <Form >
                  <FormItem label="名称">
                      <Input v-model="form.roleName"/>
                  </FormItem>
                  <FormItem label="备注">
                      <Input v-model="form.remark"/>
                  </FormItem>
                  <FormItem label="状态">
                     <iSwitch :true-value='1'/>
                  </FormItem>
              </Form>
          </Modal>
    </Layout>
</template>

<script>
import http from "@/views/until/http";
    export default {
         created() {
           this.getRoleList();
               },

        methods: {        //批量删除方法
            deleteMany(){
                   const delelList = this.selectList.map((item) =>item.roleId)
                   if(delelList.length===0){
                       return this.$Notice.error({
                           title:"操作有误",
                           desc:"请选择要删除的用户",
                       })
                   }
                   this.$Modal.confirm({
                       title:"批量删除",
                       content:'你正在批量删除用户，确认删除吗？',
                       loading:true,
                       onOk:() =>{
                           http.post("/sys/role/delete",delelList).then(({data})=>{
                               if(data.code===0){
                                   this.$Notice.success({
                                       title:'操作成功',
                                       desc:'批量删除成功'
                                   })
                                   this.getRoleList()
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
                if(this.modalTitle==="新增角色"){
                     http.post('/sys/role/save',this.form).then(({data})=>{
                     console.log(data)
                     const {code,msg}=data
                     if(code===0){
                          this.getRoleList()
                     }else{
                          this.$Message.error({
                          content: msg
            });
                     }
                 })
                }else if(this.modalTitle==='修改角色'){
                     http.post('/sys/role/update',this.form).then(({data})=>{
                    
                     const {code,msg}=data
                     if(code===0){
                          this.getRoleList()
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
                         roleId: 0,
                        roleName: "",
                       remark: "",
                       menuIdList: [
    
                               ]
                     }
            },
            getRoleList(){
                this.tableLoading=true;
                http.get('/sys/role/list',{
                    params:{
                          page:this.currPage,
                          limit:this.limit,
                          sidx:'roleId',
                          order:'asc',
                          roleName:this.search
                    }
                }).then(({data})=>{
                    console.log(data)
                     const {page,code,msg}= data
                     if(code===0){
                         const {currPage,list,pageSize,totalCount,totalPage}=page
                          this.data=list
                          this.limit=pageSize
                          this.currPage=currPage
                          this. totalCount=totalCount
                           this.totalPage=totalPage
                     }else if(code===500){
                         this.$Message.error({
                            content: msg
            });
                     }
                   this.tableLoading=false;
                     this.form={
                           roleId: 0,
                           roleName: "",
                           remark: "",
                           menuIdList: [
    
                               ]
                     }
                })
            }
        },
        data() {
            return {
                selectList:'',
                modalTitle:"",
                tableLoading:false,
                search:"", //搜索内容
                Modalloading:false,
                 form :{
                    roleId: 0,
                    roleName: "",
                    remark: "",
                    menuIdList: [
    
                               ]
                },
                showModel:false, //模态框的显示
                totalPage:1,
               totalCount: 1,
               currPage: 1,  //当前页码
                limit:8,   
                colums:[         //表头数据
                    {
                         type: 'selection',
                         width: 60,
                        align: 'center'
                    },
                    {
                        title: 'Id',
                        key: 'roleId',
                         align: "center",
                         sortable: true
                    },
                    {
                        title: '角色名称',
                         align: "center",
                        key: 'roleName'
                    },
                    
                    {
                        title: '备注',
                         align: "center",
                        key: 'remark'
                    },
                    {
                        title: '创建时间',
                         align: "center",
                        key: 'createTime',
                        sortable: true
                    },
                    {
                        title: '操作',
                         align: "center",
                         render:(h,params)=>{
                             console.log(params)
                             return h("div",[
                                 h("Button",{
                                     props:{
                                         size: "small",
                                         type: "primary"
                                     },
                                    on:{
                                        click:()=>{
                                             this.showModel=true
                                           this.modalTitle='修改角色'
                                          const {roleId,roleName,remark,}=params.row
                                          this.form={
                                               roleId,
                                              roleName,
                                              remark,
                                              menuIdList: [
    
                                                       ]
                                          }
                                        }
                                    },
                                     style:{
                                        marginRight:'8px'
                                     }
                                 },"修改"),
                                  h("Button",{
                                        props:{
                                         size: "small",
                                         type: "error"
                                     },
                                     on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: `你正在删除用户,<b>${
                          params.row.roleName
                        }</b>是否确认删除？`,
                        onOk: () => {
                          http
                            .post("/sys/role/delete", [params.row.roleId])
                            .then(({ data }) => {
                              if (data.code === 0) {
                                this.$Notice.success({
                                  title: "操作成功",
                                  desc: `用户：${params.row.roleName}已删除`
                                });
                                this.getRoleList();
                              } else {
                                this.$Notice.error({
                                  title: "操作失败",
                                  desc: `用户：${params.row.roleName}删除失败`
                                });
                              }
                            });
                        }
                      });
                    }
                  }
                                  },"删除"),
                             ])
                         }
                      
                    },

                ],
                data:[],
            }
        },
       watch:{
           search(){
             this.getRoleList();
           },
          currPage(){
              this.getRoleList();
           }
       }
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