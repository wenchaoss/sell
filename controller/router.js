var formidable = require("formidable");
var fs = require("fs");
var crypto = require("crypto");             //加密
var url = require("url");

var Seller = require('../models/Seller');

//检查是否登录
exports.checkLogin = function(req,res){
  if(req.session.login == true){
    res.send({
      data: req.session.email,
      errno: 0
    })
  }else{
    res.send({
      data: '',
      errno: 0
    })
  }

};



// exports.getSeller = function (req,res) {
//   Seller.find({"seller.name": "第二个商家"},function (err,results) {
//     if(err){
//       res.send("-1");
//       return;
//     }
//     res.json({
//       errno: 0,
//       data: results[0].seller
//     })
//   })
// }
// exports.getGoods = function (req,res) {
//   Seller.find({'seller.name': '第二个商家'},function (err,results) {
//     if(err){
//       res.send("-1");
//       return;
//     }
//     res.json({
//       errno: 0,
//       data: results[0].goods
//     })
//   })
// }
// exports.getRatings = function (req,res) {
//   Seller.find({'seller.name': '第二个商家'},function (err,results) {
//     if(err){
//       res.send("-1");
//       return;
//     }
//     res.json({
//       errno: 0,
//       data: results[0].ratings
//     })
//   })
// }
