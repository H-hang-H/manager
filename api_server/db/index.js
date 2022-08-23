const mysql=require('mysql')
//建立连接
const db=mysql.createPool({
    host:'112.74.163.235',
    user:'root',
    // password:'.',
    password:'.',
    database:'st'
})
//暴露模块
module.exports=db
