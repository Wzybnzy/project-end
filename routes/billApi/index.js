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

//获取账单

//按年 + 分类

//按月  + 分类
var getBill = function(req, res, next) {
    var params = req.query,
        uid = params.uid,
        time = params.time, //时间  年2019   月2019-12 
        name = params.name.split(','); // 分类的名字 登山,唱歌  ===>  ['登山',唱歌]
    if (!uid || !time || !name) {
        res.send({ code: 2, message: "缺少参数" });
    } else {
        if (time.indexOf('-') != -1) { //按月2019-12 
            var timeArr = time.split('-'); // [2019,12]
            // 2019-01   max :2019-02     2019-12  max: 2020-01
            if (timeArr[1] == '12') {
                maxTime = (timeArr[0] * 1 + 1) + '-01';
            } else { //2019-2
                maxTime = timeArr[0] + '-' + (timeArr[1] * 1 + 1);
            }
        } else { //按年
            maxTime = time * 1 + 1;
        }
    }

    mongodb.find(dbBase, dbbillColl, { time: { $lt: new Date(maxTime), $gte: new Date(time) }, uid: uid, name: { $in: name } }, function(result) {
        console.log(result);
        if (result.length > 0) {
            res.send({ code: 0, data: result });
        } else {
            res.send({ code: 1, message: "查询失败" });
        }
    }, {
        sort: { time: -1 }
    });

    //按年


    //按月
    // 2019-12  
}

module.exports = {
    addbill: addBill,
    getbill: getBill
}