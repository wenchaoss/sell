# sell

> sell app

## 运行步骤（需要mongodb）（暂为cli调试步骤）

``` bash
# 安装依赖
npm install

# 运行mongodb
monogod --dbpath yourpath

# 运行node服务器（cli）
npm run dev

# 监听端口8080
http://localhost:8080

#调试说明
使用假数据，根目录下allseller.json为三个卖家集合的数据，newdata11，2，3是将三个卖家数据分开，新同步之后
需要在./models/Seller.js中，将89~97行注释恢复，将假数据写入数据库后便可以注释掉重新运行服务器（避免每次开机都会写入3个数据）



