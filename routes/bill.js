var express = require('express');
var router = express.Router();

var bill = require('./billApi/index.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//添加账单
router.post('/bill/addbill', bill.addbill);


module.exports = router;