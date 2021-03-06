var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  "date": Number,
  "ordernumber": Number,
  "process": Number,              //0 刚提交订单  1 正在制作  2 正在发货  3 已经签收 5 已经评价
  "user": String,
  "seller_id": String,
  "seller_name": String,
  "price": Number,
  "foods": [],
  "phone": String,
  "address": String,
  "rating": {}
})

var Order = mongoose.model("orders",orderSchema);


module.exports = Order;
