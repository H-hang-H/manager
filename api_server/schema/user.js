//用户验证规则
const joi=require('joi')
// string() 值为字符串
// alphanum() 只能包含a-z,A-Z,0-9之间的字符
// min(length)最小长度
// max(length)最大长度
// required()必填项
// pattern(正则表达式) 填写正则规则

//用户名验证规则
const username=joi.string().required().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/)
//定义用户名验证规则
const password=joi.string().pattern(/^[\S]{6,12}$/).required()
//将规则暴露挂载
exports.reg_login_schema={
//    对req.body进行验证
    body:{
        username,
        password
    }
}
//定义id,nickname,email规则
const id=joi.number().integer().min(1).required()
const nickname=joi.string().required()
const email=joi.string().email().required()
//暴露规则
exports.update_userinfo_schema={
    body:{
        id,
        nickname,
        email
    }
}
//重置密码
exports.update_password_schema={
    body:{
        oldpwd:password,
        //表示新密码不能等于旧密码
        newpwd:joi.not(joi.ref('oldpwd')).concat(password)
    }
}
//修改头像
const avatar=joi.string().dataUri().required()
exports.update_avatar_schema={
    body:{
        avatar
    }
}
