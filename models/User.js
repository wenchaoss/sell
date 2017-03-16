var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  "username": String,
  "password": String,
  "order": [String],
  "phone": String,
  "address": [String]

})
//检查用户是否被占用
userSchema.statics.checkExist = function(username,callback){
  //this指向类名，非Schema
  this.find({'username': username},function(err,results){
    if(results.length == 0){
      callback(false);
    }else{
      callback(true);
    }
  });
};
var User = mongoose.model("users",userSchema);


module.exports = User;
