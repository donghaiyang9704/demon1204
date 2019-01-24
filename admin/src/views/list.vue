<template>
   <Layout>
       <Sider collapsible  v-model="isCollapsed">
           <div class="logo">
               <h2>后台管理系统</h2>
           </div>
           <Menu  theme="dark" width="auto">
               <Submenu name="" v-for="item in menu" :key="item.menuid" >
                    <template slot="title">
                        <Icon type="ios-paper" />
                        {{item.name}}
                    </template>
                    <MenuItem  name=""  :to="'/list/'+ child.url"  v-for="child in item.children" :key="child.menuid" >{{child.name}}
                    </MenuItem>
                   
                     </Submenu>
           </Menu>
       </Sider>
       <Layout>
           <Header class="header">
              <div>
                   <Button @click=" isCollapsed= ! isCollapsed">
                   <Icon type="md-menu"></Icon>
                   </Button>
              </div>
               <Dropdown @on-click="dropclick">
                   <Icon type="md-person" :size=18></Icon>
                   用户：{{user.username}}
                   <Icon type="ios-arrow-down"></Icon>
                   <DropdownMenu slot="list"  >
                <DropdownItem name="changePsword">修改密码</DropdownItem>
                <DropdownItem name="exit">安全退出</DropdownItem>   
                 </DropdownMenu>
               </Dropdown>
               
           </Header>
           <Content class="content">
              <router-view></router-view>
           </Content>
       </Layout>
   </Layout>

</template>
<script>
 import http from "@/views/until/http"
    export default {
         data () {
            return {
                isCollapsed: false,
                user:{},
                menulist:[],
                
            };
        },
        beforeCreate() {
            http.get('/sys/user/info').then((res =>{
                const {code,user} =res.data
                if(code===0){
                    this.user=user
                }
            }))
            http.get('/sys/menu/list').then((res =>{
                this.menulist=res.data
            }))
        },

        methods: {
            dropclick(name){
                 if(name==="exit"){
                     console.log(name)
                     this.$router.push('/login')
                     localStorage.removeItem('token')
                 }
            }
        },
        computed: {
            menu(){
                    function deep(arr, parentId) {
            if (!Array.isArray(arr)) return
            return arr.filter((k) => {
            if (k.parentId === parentId){
                k.children = deep(arr, k.menuId)
                return true
            }
            })
        }
                 return deep(this.menulist,0)
            }
        }
    }
</script>

<style scoped>
.header{
    background: #fff;
    border-bottom: 1px solid #ddd;
    padding: 0 10px;
    display: flex;
    justify-content: space-between
}
.logo{
    height: 64px;
    line-height: 64px;
    background: #fff;
    padding: 0 10px;
}
.content{
    display: flex;
    position: relative;
    overflow: hidden;
}

</style>