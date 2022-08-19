//个人中心模块
//初始化路由
const express = require('express')
const router = express.Router()
//引入数据验证模块
const expressJoi = require('@escook/express-joi')
//引入规则判断
const {update_userinfo_schema, update_avatar_schema, update_password_schema} = require('../schema/user')
//引入路由处理模块
const userinfo_handle = require('../router_hander/userinfo')

//获取用户信息
router.get('/userinfo', userinfo_handle.getuserinfo)
//修改用户信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handle.updateuserinfo)
//重置密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handle.updatepassword)
//改头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handle.updateavatar)
//暴露此模块
module.exports = router
