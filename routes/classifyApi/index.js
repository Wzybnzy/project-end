var mongodb = require('mongodb-curd');
var dbBase = 'ninmeng';
var dbiconColl = 'iconlist'; //所有icon的集合
var dbClassifyColl = 'classify'; //分类的集合


//查询所有的icon
var iconlist = function(req, res, next) {
    mongodb.find(dbBase, dbiconColl, {}, function(result) {
        if (result.length > 0) {
            res.send({ code: 0, message: "查询成功", data: result });
        } else {
            res.send({ code: 1, message: "失败" });
        }
    });
}


//添加分类的接口
var addClassify = function(req, res, next) {
    var params = req.body,
        iname = params.icon, //图标名字
        cname = params.name, //分类的名称
        type = params.type, //支出或者收入
        uid = params.uid; // uid  *
    if (!iname || !cname || !type || !uid) {
        res.send({ code: 2, message: "缺少参数" });
    } else {
        getIsClassify();
    }
    //判断下当前的分类是否存在
    function getIsClassify() {
        //$in  查询一个健下的多个值
        mongodb.find(dbBase, dbClassifyColl, { cname: cname, type: type, uid: { $in: ["*", uid] } }, function(result) {
            if (result.length > 0) {
                res.send({ code: 2, message: "该分类已经存在" });
            } else {
                add();
            }
        });
    }
    //添加分类
    function add() {
        mongodb.insert(dbBase, dbClassifyColl, { iname: iname, cname: cname, type: type, uid: uid }, function(result) {
            if (result) {
                res.send({ code: 0, message: "添加分类成功" });
            } else {
                res.send({ code: 1, message: "添加失败" });
            }
        });
    }
}

var getClassify = function(req, res, next) {
    var params = req.query,
        type = params.type * 1,
        uid = params.uid;
    mongodb.find(dbBase, dbClassifyColl, { type: type, uid: { $in: ["*", uid] } }, function(result) {
        console.log(result); //[]  
        if (result.length > 0) {
            res.send({ code: 0, data: result });
        } else {
            res.send({ code: 1, message: "没有查询到分类" });
        }
    });
}

module.exports = {
    iconlist: iconlist,
    addClassify: addClassify,
    getClassify: getClassify
};