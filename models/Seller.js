var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sellerSchema = new Schema({
  "seller": {
    "username": String,             //商家登录名
    "password": String,             //商家密码
    "checkout": Number,             //当为1时，表示暂不合格不上首页
    "name": String,                 //店铺名
    "description": String,          //描述（快递描述，首页）
    "deliveryTime": Number,         //送达时间
    "score": Number,                //综合评分
    "serviceScore": Number,         //服务态度
    "foodScore": Number,            //商品评分
    "rankRate": Number,             //高于周边商家（69.2）
    "minPrice": Number,             //起送价
    "deliveryPrice": Number,        //运费
    "ratingCount": Number,          //评论总数
    "sellCount": Number,            //销量
    "bulletin": String,             //商家公告（介绍）
    // "supports": [                   //支持的活动
    //   {
    //     "type": Number,             //活动类型
    //     "description": String       //活动名称
    //   }
    // ],
    "supports": [],
    "avatar": String,               //店家头像
    "pics": [String],               //店家照片
    "infos": [String],              //商家信息
  },
  // "goods": [
  //   {
  //     "name": String,               //总分类
  //     "type": Number,
  //     "foods": [
  //       {
  //         "name": String,           //餐品名
  //         "price": String,          //价格
  //         "oldPrice": String,       //原价
  //         "description": String,    //介绍
  //         "sellCount": Number,      //销量
  //         "rating": Number,         //好评率（100）
  //         "info": String,           //商品信息
  //         "ratings": [
  //           {
  //             "username": String,
  //             "rateTime": Number,   //日期，为数字时间戳
  //             "rateType": Number,   //推荐0 吐槽1
  //             "text": String,
  //             "avatar": String
  //           }
  //         ],
  //         "icon": String,           //商品头像
  //         "image": String           //商品大图
  //       }
  //     ]
  //   }
  // ],
  "goods": [],
  "ratings": [
    {
      "username": String,
      "rateTime": Number,
      "deliveryTime": Number,         //用户填写的送达时间
      "score": Number,                //用户打分
      "rateType": Number,             //0推荐1吐槽
      "text": String,
      "avatar": String,
      "recommend":[String]            //购买的商品
    }
  ]
})
//检查用户是否被占用
sellerSchema.statics.checkExist = function(username,callback){
  //this指向类名，非Schema
  this.find({'username': username},function(err,results){
    if(results.length == 0){
      callback(false);
    }else{
      callback(true);
    }
  });
};


var Seller = mongoose.model("sellers",sellerSchema);

var mock1 = require('../data2.json');
var mock2 = require('../data3.json');
var mock3 = require('../data4.json');
var mockSeller1 = new Seller(mock1);
var mockSeller2 = new Seller(mock2);
var mockSeller3 = new Seller(mock3);
mockSeller1.save();
mockSeller2.save();
mockSeller3.save();

module.exports = Seller;
