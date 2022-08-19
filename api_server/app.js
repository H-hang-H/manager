const express = require('express')
const app = express()
//跨域文件中间件
const cors = require('cors')
app.use(cors())
//引入加密密钥
const config = require('./config')
//解析 token中间件
const {expressjwt: expressJWT} = require('express-jwt')
//指定路由是否需要token登录,带有api的不需要token登录,通过正则表达式
app.use(expressJWT({secret: config.jwtSecreKey, algorithms: ['HS256']}).unless({path: [/^\/api\//]}))
//配置解析表单数据中间件
app.use(express.urlencoded({extended: false}))
//优化res.send()函数，作为中间件
app.use((req, res, next) => {
    //status=1  代表错误
    res.cc = (err, status = 1,data={}) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
            data
        })
    }
    next()
})
//使用路由
const userRouter = require('./router/user')
const useinfoRouter=require('./router/userinfo')
const operate=require('./router/operate')

app.use('/api', userRouter)
app.use('/api/my',useinfoRouter)
app.use('/api/use',operate)

app.listen(9090, () => {
    console.log('服务器启动')
})

const joi = require('joi')
//错误中间件
app.use((err, req, res, next) => {
//    数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    //身份认证失败
    if (err.auth === 'UnauthorizedError') return res.cc('身份认证失败')
//    未知错误
    res.cc(err)
})