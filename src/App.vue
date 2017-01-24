<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <a v-link="{path:'/detail/goods'}">商品</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/detail/ratings'}">评论</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/detail/seller'}">商家</a>
      </div>
    </div>
    <!--keep 离开后保留组件状态，vue生命周期切换路由后不会重新开始-->
    <router-view :seller="seller" keep-alive></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {urlParse} from 'common/js/util';
import header from './components/header/header.vue';
const ERR_OK = 0;

export default{
  props: {
    seller: {
      type: Object
    }
  },
  // data() {
  //   return {
  //     seller: {
  //       // id: (() => {
  //       //   let queryParam = urlParse();
  //       //   console.log(queryParam)
  //       //   return queryParam.id;
  //       // })()
  //     }
  //   };
  // },
  created() {
    console.log(this.seller)
  },
  // created() {
  //   this.$http.get('seller?id=' + this.seller.id).then((res) => {
  //     //api改变，json()返回promise对象
  //     res = res.body;
  //     if(res.errno === ERR_OK){
  //      //赋值后id就会丢失，ES6语法，vue推荐的对象扩展属性方法
  //       this.seller = Object.assign({}, this.seller, res.data);
  //     }
  //   })
  //
  // },
  // created() {
  //   this.$http.get('/seller').then((response) => {
  //     response = response.body;
  //     if (response.errno === ERR_OK) {
  //       this.seller = response.data
  //     }
  //   });
  // },
  components:{
    'v-header': header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
    .tab
      display: flex
      width :100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display block
          font-size: 14px
          color: rgb(77,85,93)
          &.active
            color: rgb(240,20,20)
</style>
