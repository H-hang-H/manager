//引入数据库
const db = require('../db/index')

//路由处理函数

//增加学生信息
exports.addstudent = (req, res) => {
    //获取表单数据
    const stu = req.body
    console.log(stu)
//    判断学号是否重复,使用sql
    const sql = 'select * from student where stunumber=?'
//    执行sql
    db.query(sql, stu.stunumber, (err, result) => {
        if (err) {
            return res.cc(err.message)
        }
        //如果学号重复
        if (result.length > 0) {
            return res.cc('学号重复，请重试')
        }
        //    学号正确，sql语句
        const sql = 'insert into student set ?'
        //    执行sql
        db.query(sql, {...stu}, (err, result) => {
            if (err) {
                return res.cc(err.message)
            } else if (result.affectedRows !== 1) {
                return res.cc('增加失败，请重试')
            }
            return res.cc('增加成功', 0)
        })
    })
}

// 修改学生信息
exports.changestudent = (req, res) => {
    //获取信息
    const stu = req.body
    //找到该数据，写修改的sql语句
    const sql = 'update student set stuname=?,stucity=?,stusex=? where stunumber=?'
    //执行sql
    db.query(sql, [stu.stuname, stu.stucity, stu.stusex, stu.stunumber], (err, result) => {
        if (err) {
            return res.cc(err.message)
        } else if (result.affectedRows !== 1) {
            return res.cc('修改失败')
        }
        return res.cc('修改成功', 0)
    })

}

//获取学生信息列表
exports.getstudentinfo = (req, res) => {
    //登录成功后，获取数据库表数据
    //sql语句
    const {city,start,pagesize} = req.params
    // console.log(city,start,pagesize)
    let sql = city === 'all' ? "select * from student" : "select * from student where stucity=?"
    sql+=' limit '+(start-1)*pagesize+','+pagesize
    db.query(sql, city, (err, result) => {
        if (err) {
            res.cc(err.message)
        }
        res.cc('获取数据成功', 0, result)
    })
}

//获取目标学生信息
exports.gettargetstudent = (req, res) => {
//    目标信息
    const stu = req.params.num
//    sql
    const sql = 'select * from student where stunumber=?'
//    执行sql
    db.query(sql, stu, (err, result) => {
        if (err) {
            res.cc(err.message)
        } else if (result.length !== 1) {
            res.cc('获取当前用户信息失败，稍后重试')
        }
        res.cc('获取当前用户信息成功', 0, result)
    })
}

//删除目标学生信息
exports.deletestudent = (req, res) => {
//    删除学生信息
    const id = req.params.id
//    删除的sql
    const sql = 'delete from student where stunumber=?'
//    执行sql
    db.query(sql, id, (err, result) => {
        if (err) {
            res.cc(err.message)
        } else if (result.affectedRows !== 1) {
            return res.cc('删除错误')
        }
        res.cc('删除数据成功', 0)
    })
}

//模糊查询
exports.getselect = (req, res) => {
    const {stunumber, stuname, stucity} = req.query
    let sql = 'select * from student where'
    let canshu = []
    //在院系中查找
    if (stucity !== 'all') {
        let flag = false
        if (stunumber) {
            canshu.push("%" + stunumber + "%")
            sql = sql + ' stunumber like ? '
            flag = true
        }
        if (stuname) {
            if (flag) {
                canshu.push("%" + stuname + "%")
                sql = sql + ' and stuname like ?'
            } else {
                canshu.push("%" + stuname + "%")
                sql = sql + ' stuname like ?'
            }
        }
        canshu.push(stucity)
        sql = sql + ' and stucity = ?'
    }
    //在所有学生中查找
    else {
        let flag = false
        if (stunumber) {
            canshu.push("%" + stunumber + "%")
            sql += ' stunumber like ? '
            flag = true
        }
        if (stuname) {
            if (flag) {
                canshu.push("%" + stuname + "%")
                sql += ' and stuname like ?'
            } else {
                canshu.push("%" + stuname + "%")
                sql += ' stuname like ?'
            }
        }
    }
    db.query(sql, canshu, (err, result) => {
        if (err) {
            return res.cc(err.message)
        } else {
            return res.cc('查询成功', 0, result)
        }
    })
}

//展示教师信息
exports.getteacherinfo = (req, res) => {
    //登录成功后，获取数据库表数据
    //sql语句
    const city = req.params.city
    const sql = city === 'all' ? "select * from teacher" : "select * from teacher where teacity=?"
    db.query(sql, city, (err, result) => {
        if (err) {
            res.cc(err.message)
        }
        res.cc('获取数据成功', 0, result)
    })
}