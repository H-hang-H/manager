//个人中心模块
//初始化路由
const express = require('express')
const router = express.Router()
//引入数据验证模块
// const expressJoi = require('@escook/express-joi')
//引入路由处理模块
const operate_handle = require('../router_hander/operate')

// router.get('/studentinfo/city/:city',operate_handle.getstudentinfo)
router.get('/studentinfo/city/:city/:start/:pagesize',operate_handle.getstudentinfo)
router.get('/teacherinfo/city/:city',operate_handle.getteacherinfo)
router.delete('/studentinfo/delete/:id',operate_handle.deletestudent)
router.post('/studentinfo/add',operate_handle.addstudent)
router.put('/studentinfo/change',operate_handle.changestudent)
router.get('/studentinfo/stunumber/:num',operate_handle.gettargetstudent)
router.get('/studentinfo/select',operate_handle.getselect)
//暴露此模块
module.exports = router