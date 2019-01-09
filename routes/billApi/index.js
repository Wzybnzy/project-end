var mongodb = require('mongodb-curd');
var dbBase = 'ninmeng';
var dbuserColl = 'user'; //用户的集合
var dbClassifyColl = 'classify'; //分类的集合

var dbbillColl = 'billlist'; //账单的集合


var addBill = function(req, res, next) {
    var params = req.body,
        type = params.type, //类型
        money = params.money, //价格
        icon = params.icon, //图标的名称
        name = params.name, //分类名称
        time = params.time, // 添加账单的时间
        uid = params.uid, //用户的id
        cid = params.cid; //分类的id

    if (!type || !money || !icon || !name || !time || !uid || !cid) {
        res.send({ code: 2, message: "缺少参数" });
    } else {
        //判断当前用户是否在集合里面
        getIsHasUser();
    }

    function getIsHasUser() {
        mongodb.find(dbBase, dbuserColl, { _id: uid }, function(result) {
            if (result.length > 0) {
                //判断当前的分类是否在分类的集合
                getIsHasClassify();
            } else {
                res.send({ code: 0, message: "没有找到该用户" });
            }
        });
    }

    function getIsHasClassify() {
        mongodb.find(dbBase, dbClassifyColl, { _id: cid }, function(result) {
            if (result.length > 0) {
                //添加账单
                add();
            } else {
                res.send({ code: 0, message: "没有找到该分类" });
            }
        });
    }

    function add() {
        params.time = new Date(params.time);
        mongodb.insert(dbBase, dbbillColl, params, function(result) {
            if (result) {
                res.send({ code: 0, message: "添加账单成功" });
            } else {
                res.send({ code: 1, message: "添加失败" });
            }
        });
    }
}

module.exports = {
    addbill: addBill
}