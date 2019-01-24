<template>
    <Layout>
        <Content>
            <img src="@/img/1.jpg" class="content"/>
        </Content>
        <Sider class="sider" :width="400">
            <Layout class="form">
                <Form ref="from" :model="from" :rules="fromRul">
                    <FormItem>
                        <h2>管理系统登录</h2>
                    </FormItem>
                      <FormItem prop="username">
                          <Input v-model="from.username" prefix="md-person"  clearable />
                    </FormItem>
                     <FormItem prop="password">
                         <Input v-model="from.password" type="password" prefix="md-lock" clearable />
                    </FormItem>
                     <FormItem prop="captcha">
                         <Layout class="cap">
                              <Input v-model="from.captcha" prefix="md-images" clearable/>
                          <img :src="'/api/captcha.jpg?uuid='+ from.uuid" @click="changeUuid"/>     
                         </Layout>

                    </FormItem>
                     <FormItem>
                          <Button :loading="loading" type="primary" long @click="login">登录</Button>
                    </FormItem>
                </Form>
            </Layout>

        </Sider>
    </Layout>

</template>

<script>
  import http from "@/views/until/http"
  import uuid from "uuid"
    export default {
        data() {
            return {
                from:{
                    username: "",
                    password: "",
                    captcha: "",
                    uuid: uuid()
                },
                loading:false ,
                //写表单限制规则
                fromRul:{
                   username:[
                       {max:10, min:3, message:'长度必须3-10位', trigger: 'blur'}
                   ],
                   password:[
                       {max:10, min:3, message:'密码必须6-10位', trigger: 'blur'}
                   ],
                   captcha:[
                          {max:5, min:5, message:'必须5位', trigger: 'blur'}
                   ],
                  
                }
            }
        },
        methods: {
            //点击改变uuid
            changeUuid(){
                  this.from.uuid=uuid()
            },
             async login(){
          
        //    await   axios.post('http://localhost:8080/api//sys/login')
            //   .then(res => {
            //       console.log(res)
            //   })
            //   .catch(err => {
            //       console.log(err)
            //   })
            // const data = await http.post('/sys/login',this.from)
            // console.log(data)
          
            const valild = await this.$refs['from'].validate()
            console.log(valild)
            if(valild){
                this.loading =true
                 const result = await http.post('/sys/login',this.from)
                    const {code,msg,token} = result.data
                    if(code===500){
                       this.$Message.error({
                           content:msg
                       })
                       this.from.uuid=uuid() //登录错误刷新验证码
                    } else if (code===0){
                        localStorage.setItem('token',token)
                       this.$router.replace('list')
                    }
                    this.loading = false
            }
           }
            
        }
    }
</script>

<style scoped>
.content{
    width: 100%;
    height: 99%;
     
}
.sider{
    background: white;
    border-left: 1px solid #ddd;
}
.form{
    height: 100%;
    padding: 0 30px;
   justify-content: center;
}
.cap{
    display: flex;
    flex-direction: row;
}
.cap input {
    width: 150px;
}
.cap img{
    width: 140px;
    height: 32px;
}
</style>