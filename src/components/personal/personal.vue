<template>
  <div class="personal">
    <div class="personal_header">
      <h1 class="title">{{hashTitle}}</h1>
      <div class="go-back">
        <span class="arrow" v-link="{path:'/'+hashback}"><span class="arrowwhite"></span></span>
      </div>
    </div>
    <router-view :userdetail="userdetail" :hash="hash"></router-view>

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
    data() {
      return {
        hash: 'index'
      }
    },
    computed: {
      //根据hash决定返回哪个页面
      hashback() {
        if(this.hash === 'index'){
          return 'home'
        }else{
          return 'personal'
        }
      },
      //根据hash显示头部文字
      hashTitle() {
        if(this.hash === 'index'){
          return '我的'
        }else if(this.hash === 'orderlist'){
          return '订单列表'
        }else if(this.hash === 'address'){
          return '管理收货地址'
        }else if(this.hash === 'ratings'){
          return '我的评价'
        }
      }
    },
    events: {
      'changeGobackHash'(hash) {
        this.hash = hash
      }
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

</style>

