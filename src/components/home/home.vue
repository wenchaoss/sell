<template>
  <div class="home">
    <div class="home_header">
      <h1 class="title">山东师范大学外卖平台</h1>
    </div>
    <split></split>
    <div class="login-wrapper">
      <div class="info" v-show="username || !logpage">

      </div>
      <div class="login" v-show="!username || !logpage">
        <div class="left">
          <img src="ke.png">
          <p>用户登录</p>
        </div>
        <div class="right">
          <img src="shang.png">
          <p>商家登录</p>
        </div>
      </div>
      <div class="longin" v-show="logpage">

      </div>
    </div>
    <split></split>
    <div class="sellers">
      <ul>
        <li v-for="seller in allseller" class="seller-item" v-link="{path:'/detail/goods'}" @click="changeSeller(seller)">
          <div class="icon">
            <img width="64" :src="seller.seller.avatar">
          </div>
          <div class="content">
            <div class="title">
              <span class="brand"></span>
              <span class="name">{{seller.seller.name}}</span>
            </div>
            <star :size="24" :score="seller.seller.score" class="scorestar"></star><span class="score">{{seller.seller.score}}</span><span class="sellcount">月售{{seller.seller.sellCount}}单</span>
            <div class="footer clearFix">
              <span class="minPrice">￥{{seller.seller.minPrice}}起送 / </span><span class="deliveryPrice">配送费￥{{seller.seller.deliveryPrice}}</span>
              <span class="deliveryTime">{{seller.seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';
  import split from 'components/split/split';
  const ERR_OK = 0;
  export default {
    props: {
      allseller: {
        type: Array
      },
      username: {
        type: String
      }
    },
    data() {
      return {
        logpage: false
      }
    },
    created() {

    },
    methods: {
      changeSeller(seller) {
        this.$dispatch('changeseller',seller)
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";

  .home_header
    width: 100%
    background: rgb(0, 151, 255)
    height: 45px
    .title
      font-size: 18px
      line-height: 45px
      font-weight: 700
      color: #fff
      text-align: center
  .login-wrapper
    padding-bottom: 10px
    .login
      display: flex
      width: 100%
      text-align: center
      .left , .right
        flex: 1
        p
          color: #333
          font-weight: 700
        img
          width: 50%
  .sellers
    .seller-item
      position: relative
      padding: 12px 6px 9px 12px
      .icon
        display inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 8px
        color: #666
        font-size: 12px
        line-height: 12px
        .scorestar
          display: inline-block
        .score
          display: inline-block
          color: #FF9900
          font-weight: 700
          margin-left: 5px
        .sellcount
          display: inline-block
          font-size: 12px
          line-height: 12px
          margin-left: 5px
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            vertical-align: top
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .footer
          margin-top: 3px
          margin-left: -2px
          .deliveryTime
            display: inline-block
            position: absolute
            right: 14px
            bottom: 10px
            float: right
            color: #2395FF
</style>

