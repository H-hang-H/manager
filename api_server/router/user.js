const express=require('express')
const router=express.Router()

//引入路由处理模块
const userrouter=require('../router_hander/user')

//引入验证表单数据的中间件
const expressjoi=require('@escook/express-joi')
//导入需要验证的对象
const {reg_login_schema}=require('../schema/user')

//注册用户，使用中间件进行验证
router.post('/register',expressjoi(reg_login_schema),userrouter.register)
//登录，用同一个校验规则
router.post('/login',expressjoi(reg_login_schema),userrouter.login)

//将模块暴露出去
module.exports=router