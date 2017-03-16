<template>
  <div class="personal_orderdetail" transition="move" v-el:detail v-show="showFlag">
    <div class="orderdetail_header">
      <div class="go-back" @click="close()">
        <span class="arrow" ><span class="arrowwhite"></span></span>
      </div>
    </div>
    <div class="process">
      <h1 class="title">正在派送中</h1>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import split from 'components/split/split';
  import {formatDate} from 'common/js/date';

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
        showFlag: false
      }
    },
    created() {
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
      },
      close() {
        this.showFlag = false;
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


</style>

