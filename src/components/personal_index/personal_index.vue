<template>
  <div class="personal_index">
    <div class="info">
      <div class="avatar"><img src="default_header.png"></div>
      <div class="username">{{userdetail.username}}</div>
    </div>
    <split></split>
    <div class="main" v-show="userdetail.type">
      <div class="order" v-link="{path:'/personal/orderlist'}">所有订单</div>
      <!--<div class="rating" v-link="{path:'/personal/ratings'}">我的评价</div>-->
      <div class="local" v-link="{path:'/personal/phone'}">设置联系方式</div>
      <div class="local" v-link="{path:'/personal/address'}">管理收货地址</div>
    </div>
    <div class="main" v-show="!userdetail.type">
      <div class="order" v-link="{path:'/personal/orderlist'}">订单管理</div>
      <div class="home" v-link="{path:'/detail/goods'}"  @click="changeSeller()">查看店铺主页</div>
      <div class="changeinfo" v-link="{path:'/personal/changeinfo'}">修改店铺信息</div>
      <div class="foods" v-link="{path:'/personal/managegoods'}" >管理店铺商品</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from 'components/split/split';

  export default {
    props: {
      userdetail: {
        type: Object
      },
      hash: {
        type: String
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
      this.hash = 'index'
      // console.log(this.userdetail)
      this.$dispatch('changeGobackHash',this.hash);
      if(!this.userdetail.type){

      }
    },
    methods: {
      changeSeller() {
        // console.log(this.userdetail)
        this.$dispatch('changeseller',this.userdetail)
      },
    },
    components: {
      split
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal_index
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

