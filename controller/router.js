var formidable = require("formidable");
var fs = require("fs");
var crypto = require("crypto");             //加密
var url = require("url");

var Seller = require('../models/Seller');

//获得模拟数据
var mock = require('../data2.json');
var mockSeller = new Seller(mock);


