<template>
  <div class="personal_addgood" transition="move" v-el:adddetail-wrap v-show="showFlags" >
    <div>
      <div class="orderdetail_header">
        <div class="go-back" @click="close()">
          <span class="arrow" ><span class="arrowwhite"></span></span>
        </div>
      </div>
      <h1 class="info_header">新增商品</h1>
      <div class="main">
        <div>商品名：<input type="text" v-model="name"></div>
        <div>原价：<input type="number" v-model="oldPrice"></div>
        <div>现价：<input type="number" v-model="price"></div>
        <div>描述：<input type="text" v-model="description"></div>

      </div>
      <h1>分类：</h1>
      <div class="tylelist">
        <ul>
          <li v-for="item in goodtype"><label><input type="checkbox" v-model="goodTypeNum" value="{{$index}}">{{item}}</label></li>
        </ul>
      </div>
      <h1 class="info_header">商品详细介绍：</h1>
      <div class="main"><div></div></div>
      <div><textarea class="bulletin">{{info}}</textarea></div>
      <h1 class="info_header">商品图片上传(请上传1:1比例的图片）：</h1>
      <form id="uploadForm" enctype="multipart/form-data" method="post">
        <div class="main"><div><input class="iconsub" type="file" accept="image/png,image/,image/jpg,image/jpeg" name="tupian" /><input @click="uppic" class="sctp" type="button" value="上传图片"></div></div>
      </form>
      <input type="button" class="sub" value="提交" @click="addgood">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from 'components/split/split';
  import $ from 'jquery'
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
      },
      goodtype:{
        type: Array
      }
    },
    data() {
      return {
        showFlags: false,
        selectType: ALL,
        onlyContent: true,
        name:'',
        price: '',
        oldPrice: '',
        description: '',
        info: '',
        as: '',
        goodTypeNum:[],
        newPicRef: ''
      }
    },
    created(){
      // console.log(this.name,222)
      // this.$file = this.$el.querySelector('input[type="file"]');
    },
    methods: {
      show() {
        this.showFlags = true;
        this.selectType = ALL;
        this.onlyContent = true;
        //绑定BS
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$els.adddetailWrap, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      close() {
        this.showFlags = false;
      },
      addgood() {
        // console.log(this.goodTypeNum)
        // console.log(this.as)
        if(!this.name || ! this.price){
          alert("必须有名称和现价！");
          return;
        }

        var param = {
          "name": this.name,
          "price": this.price,
          "oldPrice": this.oldPrice,
          "description": this.description,
          "info": this.info,
          "oldname": this.good.name,
          "typeNum": this.goodTypeNum,
          "newPicRef": this.newPicRef,
          "image": this.newPicRef,
          "icon": this.newPicRef
        }
        this.$http.post('/addgood',param)
          .then((res) => {
            if(res.body =="-1"){alert("对不起！服务器错误");return;}
            if(res.body =="-2"){alert("请先上传图片！");return;}
            this.$dispatch('refreshseller');
            alert("添加成功!请刷新查看");
          })
      },
      uppic() {
        $.ajax({
          url: '/addpic',
          type: 'POST',
          cache: false,
          data: new FormData($('#uploadForm')[0]),
          processData: false,  // 关键点
          contentType: false  // 关键点
          }).done(function(res) {
            if(res){
              alert("添加成功！请继续操作");
              this.newPicRef = res;
            }
          }).fail(function(res) {});
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal_addgood
    input
      font-size: 16px
    position: fixed
    left: 0
    top: 0
    bottom: 0
    z-index: 30
    width: 100%
    background-color: #fff
    .tylelist
      li
        display: inline-block
        padding: 7px
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
    .iconsub
      width: 60%
</style>

