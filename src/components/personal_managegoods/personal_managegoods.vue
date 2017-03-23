<template>
  <div class="personal_managegoods">
    <div class="type">
      <h1>分类：</h1>
      <div class="tylelist">
        <ul>
          <li v-for="item in goodType"><label><input type="radio" v-model="goodTypeNum" value="{{$index}}">{{item}}</label></li>
        </ul>
        <input type="text" v-model="newType" class="newType" ><input type="button" class="btn" value="增加"><input type="button" class="btn" value="移除">
      </div>
    </div>
    <split></split>
    <div class="foodlist">
      <ul>
        <li class="good-item" v-for="food in goodList" @click="selectFood(food,$event)">
          <div class="icon">
            <img width="57" :src="food.icon">
          </div>
          <div class="content">
            <h2 class="name">{{food.name}}</h2>
            <p class="desc">{{food.description?food.description:"暂无评价"}}</p>
            <div class="extra">
              <!--<span class="count">月售{{food.sellCount}}份</span>-->
              <!--<span>好评率{{food.rating}}%</span>-->
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span><span class="old"v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <personal_gooddetail v-ref:detail :userdetail="userdetail" :order="order"></personal_gooddetail>
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
    data() {
      return{
        goodType:[],
        goodTypeNum: '',
        //存放不重复商品
        goodList: [],
        //存放字符串
        goodnameList:[],
        good:{}
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
      this.hash = 'managegoods'
      this.$dispatch('changeGobackHash',this.hash);
      console.log(this.userdetail.goods)
      if(!this.userdetail.goods){
        return;
      }
      this.goodType = this.userdetail.goods.map(function (v,i) {
        return v.name
      })
      // 排出不重复的商品列表
      var self = this;
      this.userdetail.goods.forEach(function (v,i,arr) {
        v.foods.forEach(function (_v,_i,_arr) {
          if(self.goodnameList.indexOf(_v.name) == -1){
            self.goodnameList.push(_v.name);
            self.goodList.push(_v);
          }
        })
      })
      console.log(this.goodList)
    },
    methods: {
      selectFood: function () {

      }
    },
    components: {
      split
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal_managegoods
    .type
      padding-bottom: 5px
      h1
        padding: 5px
        border-bottom: 1px solid #999;
      .tylelist
        li
          display: inline-block
          padding: 7px
        .newType
          position: relative
          left: 3%
          padding: 5px
          border:1px solid #999
          border-radius: 5px
          width: 30%
          margin-right: 25px
        .btn
          padding: 5px
          margin-right:15px
          font-size: 14px
          border-radius:5px
    .good-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-bottom:1px solid #eee
      &:last-child
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .desc
          line-height: 12px
          margin-bottom: 8px
          padding-right: 50px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>

