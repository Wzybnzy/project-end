var express = require('express');
var router = express.Router();
var mongodb = require('mongodb-curd');
var dbBase = 'ninmeng';
var dbColl = 'iconlist';
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//查询所有的icon
router.get('/classify/iconlist', function(req, res, next) {
    mongodb.find(dbBase, dbColl, {}, function(result) {
        if (result.length > 0) {
            res.send({ code: 0, message: "查询成功", data: result });
        } else {
            res.send({ code: 1, message: "失败" });
        }
    });
});

//添加分类的接口


module.exports = router;