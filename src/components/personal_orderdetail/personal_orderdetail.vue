<template>
  <div class="personal_orderdetail" transition="move" v-el:detail-wrap v-show="showFlag" >
    <div>
      <div class="orderdetail_header">
        <div class="go-back" @click="close()">
          <span class="arrow" ><span class="arrowwhite"></span></span>
        </div>
      </div>
      <div class="process">
        <h1 class="title">{{processtype}}</h1>
      </div>
      <split></split>
      <div class="order_seller">
        <div class="seller_name">{{order.seller_name}}</div>
        <div class="foodlist">
          <ul>
            <li v-for="item in order.foods">
              <span class="foodname">{{item.name}}</span>
              <div class="right">
                <span class="num">×{{item.count}}</span>
                <span class="price">¥{{item.count*item.price}}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="totalprice">实付¥{{order.price}}</div>
      </div>
      <split></split>
      <div class="orderinfo">
        <h1 class="info_header">订单信息</h1>
        <div class="main">
          <div class="num">订单号：{{order.ordernumber}}</div>
          <div class="date">下单时间：{{order.date | formatDate}}</div>
        </div>

      </div>
      <div  v-show="!userdetail.type" class="sellarea">
        <split></split>
        <div class="orderinfo">
          <h1 class="info_header">买家信息</h1>
          <div class="main">
            <div class="userid">购买用户：{{order.user}}</div>
            <div class="userphone">联系方式：{{order.phone}}</div>
            <div class="address">收货地址：{{order.address}}</div>
          </div>
        </div>
        <split></split>
        <input type="button" @click="jiedan" value="接单"><input type="button" @click="paisong" class="right" value="派送">
      </div>
      <div class="shouhuo" v-show="userdetail.type && order.process == 2">
        <split></split>
        <input type="button" @click="shouhuo" value="确定收货">
      </div>
      <div class="pinglun" v-show="userdetail.type && order.process == 3 && order.process !== 5">
        <split></split>
        <div class="star">
          <p>请输入评分</p>
          <div class="mainstar">
            <label><input type="radio" v-model="pingfen" value="5">5</label>
            <label><input type="radio" v-model="pingfen" value="4">4</label>
            <label><input type="radio" v-model="pingfen" value="3">3</label>
            <label><input type="radio" v-model="pingfen" value="2">2</label>
            <label><input type="radio" v-model="pingfen" value="1">1</label>
          </div>
          <p>请输入送达时间（分钟）</p>
          <input type="text" v-model="time" class="time">
          <p>请输入评价</p>
          <input type="text" v-model="pingjia" class="pingjia">
          <input type="button" value="提交评价" class="pingjiabtn" @click="subrating">
        </div>
      </div>
      <div class="orderinfo" v-if="order.process == 5 && order.rating">
        <split></split>
        <h1 class="info_header">评价详情</h1>
        <div class="main">
          <div class="num">评分：{{order.rating.score}}</div>
          <div class="date">评价时间：{{order.rating.rateTime | formatDate}}</div>
          <div class="num">送达时间：{{order.rating.deliveryTime}}分钟</div>
          <div class="num">评价：{{order.rating.text}}</div>
        </div>
      </div>


    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from 'components/split/split';
  import {formatDate} from 'common/js/date';
  import BScroll from 'better-scroll';
  const ALL = 2;

  export default {
    props: {
      userdetail: {
        type: Object
      },
      order: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        pingfen: 5,
        time: "",
        pingjia: ""
      }
    },

    computed: {
      processtype: function () {
        switch (this.order.process) {
          case 0:
            return "等待接单";
            break;
          case 1:
            return "已接单，正在制作"
            break;
          case 2:
            return "正在派送"
            break;
          case 3:
            return "已签收";
            break;
          case 5:
            return "已评价";
            break;
        }
      }
  },
    created() {
      // console.log(this.order)
      //验证登录
      this.$http.get('/checkLogin').then((res) => {
        if(!res.data.username){
          window.location.href='/';
          return;
        }
      })
    },
    methods: {
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = true;
        //绑定BS
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$els.detailWrap, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      close() {
        this.showFlag = false;
      },
      //接单
      jiedan: function ( ) {
        if(this.userdetail.type){
          return;
        }
        if(this.order.process != 0){
          alert("对不起！现在不能执行接单操作");
          return;
        }else{
          this.$http.get('/jiedan?'+'num='+this.order._id)
            .then((res) => {
              alert("设置接单成功！");
              this.order.process = 1;
            })
        }
      },
      //派送
      paisong: function () {
        if(this.userdetail.type){
          return;
        }
        if(this.order.process != 1){
          alert("对不起！现在不能执行派送操作");
          return;
        }else{
          this.$http.get('/paisong?'+'num='+this.order._id)
            .then((res) => {
              alert("设置派送成功！");
              this.order.process = 2;
            })
        }
      },
      //收货
      shouhuo: function () {
        if(!this.userdetail.type){
          return;
        }
        if(this.order.process != 2){
          alert("对不起！现在不能执行派送操作");
          return;
        }else{
          this.$http.get('/shouhuo?'+'num='+this.order._id)
            .then((res) => {
              alert("成功收货！");
              this.order.process = 3;
            })
        }
      },
      //评论
      subrating:function () {
        // console.log(this.order)
        if(!this.userdetail.type){
          return;
        }
        if(!this.time || !this.pingjia){
          alert("您还没有填全");
          return;
        }
        if(this.order.procee == 5){
          alert("您已经评价过");
          return;
        }
        var nfoods = this.order.foods.map(function (v,i,arr) {
          return arr[i].name;
        })
        var param = {
          seller_id: this.order.seller_id,
          username: this.userdetail.username,
          rateTime: +new Date(),
          deliveryTime: this.time,
          score: this.pingfen,
          rateType: 0,
          text: this.pingjia,
          avatar: "http://static.galileo.xiaojukeji.com/static/tms/default_header.png",
          recommend: nfoods,
          orderId: this.order._id
        }
        this.$http.post('/subrating',param)
          .then((res) => {
            if(res.body == 1) {
              alert("评论成功！");
              this.order.process = 5;
              this.order.rating = param;
              this.$dispatch('refreshseller');
              return;
            }
          })
      }
    },
    components: {
      split
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal_orderdetail
    input
      font-size: 16px
    position: fixed
    left: 0
    top: 0
    bottom: 0
    z-index: 30
    width: 100%
    background-color: #fff
    &.move-transition
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave
      transform: translate3d(100%, 0, 0)
    .orderdetail_header
      width: 100%
      background: rgb(0, 151, 255)
      height: 45px
      position: relative
      .go-back
        float: left
        position: absolute
        top: 0
        left: 0
        .arrow
          position: absolute
          border: 10px solid transparent
          border-right: 10px solid #fff
          left: 10px;
          top: 13px;
          .arrowwhite
            position: absolute
            top: -10px
            left: -8px
            border: 10px solid transparent
            border-right: 10px solid #fff
            border-right-color: rgb(0, 151, 255)

    .process
      padding-top: 50px
      padding-bottom: 30px
      .title
        font-size: 26px
        font-weight: 700
        text-align: center
    .order_seller
      padding-top: 8px
      padding-left: 10px
      overflow: hidden
      .seller_name
        color: #4d4d4d
        padding-bottom: 10px
        border-bottom: 1px solid #eee
      .foodlist
        font-size: 14px
        color: #6e6e6e
        padding-top: 10px
        padding-bottom: 10px
        border-bottom: 1px solid #eee
        li
          padding: 5px 10px 5px 0
          .right
            float: right
            .num
              padding-right: 25px
              color: #999
      .totalprice
        display: inline-block
        float: right
        padding: 10px
        font-size: 14px
        color: #fb6b23

    .orderinfo
      .info_header
        color: #333
        font-size: 18px
        padding: 8px
        border-bottom: 1px solid #eee
      .main
        padding-left: 10px
        div
          padding: 10px 0
          border-bottom: 1px solid #eee
          color: #6e6e6e
          &.date
            border-bottom: none


    .sellarea
      padding-bottom: 20px
      input
        padding: 10px 20px
        margin-top: 10px
        margin-left:60px;
        marign-bottom:30px;
    .shouhuo
      text-align: center
      input
        position: relative
        top: 20px
        padding: 10px
    .pinglun
      .star
        p
          margin-top: 15px
          margin-bottom: 10px
          text-align: center
          font-size:18px
        .mainstar
          text-align: center
          font-size:14px
          label
            padding: 5px
        .time
          display: block
          margin: 10px auto
          width: 30%
          border: 1px solid #666
          border-radius: 5px
          height: 15px
          padding: 5px
        .pingjia
          display: block
          margin: 10px auto
          width: 80%
          border: 1px solid #666
          border-radius: 5px
          height: 15px
          padding: 5px
        .pingjiabtn
          display: block
          font-size: 14px
          margin: 10px auto
          border: 1px solid #666
          border-radius: 5px
          padding: 5px
    .after
      p
        margin-top:20px
        text-align: center
</style>

