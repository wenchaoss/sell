<template>
  <div class="personal_gooddetail" transition="move" v-el:detail-wrap v-show="showFlag" >
    <div class="orderdetail_header">
      <div class="go-back" @click="close()">
        <span class="arrow" ><span class="arrowwhite"></span></span>
      </div>
    </div>
    <h1 class="info_header">修改商品信息</h1>
    <div class="main">
      <div>商品名：{{good.name}} <input type="text" v-model="name"></div>
      <div>原价：{{good.oldPrice?good.oldPrice:"暂无"}} <input type="number" v-model="oldPrice"></div>
      <div>现价：{{good.price?good.price:"暂无"}} <input type="number" v-model="price"></div>
      <div>描述：{{good.description?good.description:"暂无"}} <input type="text" v-model="description"></div>

    </div>
    <h1 class="info_header">商品详细介绍：</h1>
    <div class="main"><div>{{good.info?good.info:"暂无详细介绍"}}</div></div>
    <div><textarea class="bulletin">{{info}}</textarea></div>
    <input type="button" class="sub" value="提交修改" @click="sub">
    <h1 class="info_header">商品头像上传</h1>
    <div class="main"><div><input class="iconsub" type="file" accept="image/png,image/,image/jpg,image/jpeg" name="file" /></div></div>
    <h1 class="info_header">商品大图上传</h1>
    <div class="main"><div><<input class="iconsub" type="file" accept="image/png,image/,image/jpg,image/jpeg" name="file" /></div></div>
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
      good: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        name:'',
        price: null,
        oldPrice: null,
        description: '',
        info: ''
      }
    },
    created(){
      console.log(this.name,222)
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
      sub() {
        var param = {
          "name": this.name,
          "price": this.price,
          "oldPrice": this.oldPrice,
          "description": this.description,
          "info": this.info,
          "oldname": this.good.name
        }
        this.$http.post('/changegood',param)
          .then((res) => {
            if(res.body!="1"){alert("对不起！服务器错误");return;}
            console.log(111222333)
            this.$dispatch('refreshseller');
            alert("添加成功!请刷新查看");
          })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal_gooddetail
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
        input
          display: inline-block
          margin: 5px
          border: 1px solid #666
          padding: 5px
          border-radius: 5px
    .bulletin
      display: block
      margin: 0 auto
      resize: none
      width: 90%
      height: 100px
      font-size: 14px
      line-height 20px
    .sub
      padding: 5px
      display: block
      margin: 0 auto
      margin-top:10px
      border-radius:3px
</style>

