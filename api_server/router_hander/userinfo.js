//引入数据库
const db=require('../db/index')
//引入密码包
const bcrypt=require('bcryptjs')
//定义sql获取用户信息
exports.getuserinfo=(req,res)=>{
    const getuserinfosql='select id,username,nickname,email,user_pic from ev_users where id=?'
//    执行sql
    db.query(getuserinfosql,req.auth.id,(err,result)=>{
        if(err){
            return res.cc(err)
        }
        if(result.length!==1){
            return res.cc('获取用户信息失败')
        }
        res.send({
            status:0,
            message:'获取用户信息成功',
            data:result[0]
        })
    })
}
//修改用户信息
exports.updateuserinfo=(req,res)=>{
//    定义sql修改信息
    const updateinfosql='update ev_users set ? where id=?'
//    执行sql
    db.query(updateinfosql,[req.body,req.body.id],(err,result)=>{
    //    sql执行错误
        if(err){
            return res.cc(err)
        }
        if(result.affectedRows!==1){
            return res.cc('修改失败')
        }
        return res.cc('修改信息成功',0)
    })
}
//重置密码处理函数
exports.updatepassword=(req,res)=>{
//    查询用户是否存在，根据id
    const findidsql='select * from ev_users where id=?'
//    执行sql
    db.query(findidsql,req.auth.id,(err,result)=>{
        if(err){
            return res.cc(err.message)
        }
        if(result.length!==1){
            return res.cc('用户不存在')
        }
    //    判断旧密码是否正确
        const compareResult=bcrypt.compareSync(req.body.oldpwd,result[0].password)
        if(!compareResult){
            res.cc('旧密码错误，重试')
        }
    //    旧密码正确，加密新密码，修改
        const updatesql='update ev_users set password=? where id=?'
    //    对新密码加密
        const newpwd=bcrypt.hashSync(req.body.newpwd,10)
    //    执行sql
        db.query(updatesql,[newpwd,req.auth.id],(err,result)=>{
            if(err){
                res.cc(err.message)
            }
            if(result.affectedRows!==1){
                return res.cc('修改失败，请重试')
            }
            return res.cc('修改成功',0)
        })
    })
}
//改用户头像
exports.updateavatar=(req,res)=>{
   // 更新图片的sql
   const updatesql='update ev_users set user_pic=? where id=?'
//    执行sql
    db.query(updatesql,[req.body.avatar,req.auth.id],(err,result)=>{
        if(err){
            return res.cc(err)
        }
        if(result.affectedRows!==1){
            return res.cc('出错了，请重试')
        }
        return res.cc('更新成功',0)
    })
}