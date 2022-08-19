//引入数据库
const db = require('../db/index')
//引入加密包
const bcryps=require('bcryptjs')
//引入token包
const jwt=require('jsonwebtoken')
//引入miyao
const config=require('../config')
//路由处理函数
exports.register = (req, res) => {
    //获取用户提交的数据
    const userinfo = req.body
    //对数据进行合法校验
    if (!userinfo.username || !userinfo.password) {
        return res.cc('用户数据不合法')
    }
//    定义sql语句，查询用户名是否重复
    const namesql = 'select * from user where username=?'
//    执行sql
    db.query(namesql, userinfo.username, (err, result) => {
        //    执行sql失败
        if (err) {
            return res.cc(err)
        }
        // 如果名字被占用
        if (result.length > 0) {
            return res.cc('名字被占用，请重试')
        }
        //用户名可以被使用，对密码进行加密，使用bcryptjs来加密
        userinfo.password=bcryps.hashSync(userinfo.password,10)
    //    将信息加入数据库，sql语句
        const insertsql='insert into user set ?'
    //    执行sql
        db.query(insertsql,{...userinfo},(err,result)=>{
            //sql执行错误
            if(err){
                return res.cc(err)
            }
            //sql返回被影响行数不为1
            if(result.affectedRows!==1){
                return res.cc('注册用户失败，请重试')
            }
            //sql执行成功
            res.cc('注册成功',0)
        })
    })
}

exports.login = (req, res) => {
    console.log('用户登录')
    //获取登录用户信息
    const userinfo=req.body
    console.log(req.body)
   // 定义查询用户sql
    const sql='select * from user where username=?'
//    执行sql
    db.query(sql,userinfo.username,(err,result)=>{
    //    sql执行错误
        if(err){
            return res.cc(err)
        }
    //    如果改变的数据行数不唯一
        if(result.length!==1){
            return res.cc('登录失败')
        }
    //    判断用户名和密码是否一致，使用函数 bcryps.compareSync
        const compareResult=bcryps.compareSync(userinfo.password,result[0].password)
    //    判断密码是否一致
        if(!compareResult){
            return res.cc('登录失败，密码错误')
        }
    //    登录成功生成token字符串
    //    将用户信息中的密码，头像去掉，防止密码被破解，使用es6语法，将用户信息结构，新加入 password:'' 将原来的 密码 覆盖
        const user={...result[0],password:'',user_pic:''}
    //    生成token字符串,参数（加密对象，密钥，持续时间）
        const tokenStr=jwt.sign(user,config.jwtSecreKey,{expiresIn:config.expiresIn})
    //    将token返回给客户端
        res.send({
            status:0,
            message:'登录成功',
            token:'Bearer '+tokenStr
        })
    })
}