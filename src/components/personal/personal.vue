<template>
  <div class="personal">
    <div class="personal_header">
      <h1 class="title">我的</h1>
      <div class="go-back">
        <span class="arrow" v-link="{path:'/home'}"><span class="arrowwhite"></span></span>
      </div>
    </div>
    <div class="info">
      <div class="avatar"><img src="default_header.png"></div>
      <div class="username">{{userdetail.username}}</div>
    </div>
    <split></split>
    <div class="main">
      <div class="order">所有订单</div>
      <div class="rating">我的评价</div>
      <div class="local">管理收货地址</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from 'components/split/split';

  export default {
    props: {
      userdetail: {
        type: Object
      }
    },
    created() {

    },
    components: {
      split
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal
    .personal_header
      width: 100%
      background: rgb(0, 151, 255)
      height: 45px
      position: relative
      .title
        font-size: 18px
        line-height: 45px
        font-weight: 700
        color: #fff
        text-align: center
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
    .info
      position: relative
      padding: 40px
      padding-left: 100px
      background: rgb(0, 151, 255)
      color: #fff
      font-weight: 700
      font-size: 24px
      .avatar
        width: 60px
        height: 60px
        position: absolute
        top: 25px
        left: 20px
        background-color: #fff
        border-radius: 50%
        overflow: hidden
        img
          width: 100%

    .main
      div
        padding: 20px
        padding-left: 30px
        border-bottom: 1px solid rgb(221, 221, 221)
        font-weight: 700
</style>

