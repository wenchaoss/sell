<template>
  <div class="personal_phone">
    <div class="nophone" v-show="!userdetail.phone">您还没有设置联系方式</div>
    <div class="nowphone">
      <p>您当前的联系方式为</p>
      <p>{{userdetail.phone}}</p>
    </div>
    <split></split>
    <div class="setphone">
      <p>设置您的联系方式</p>
      <input class="num" type="number" @change="changephone" v-model="phonenum">
      <p class="err" v-show="isshow == 0">请输入正确手机号码！</p>
      <input  class="sub" type="button" value="提交/更新手机号" @click="sub">
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
    data() {
      return {
        phonenum: null,
        isshow: 2
      }
    },
    methods: {
      changephone: function () {
        if(/^\d{11}$/.test(this.phonenum)) {
          this.isshow = 1;
        }else{
          this.isshow = 0;
        }
      },
      sub: function () {
        if(this.isshow!=1){alert("请输入争取手机号！");return;}
        this.$http.get('/changephone?'+'phone='+this.phonenum)
          .then((res) => {
            if(res.body == 1){
              this.userdetail.phone = this.phonenum;
              this.phonenum = null;
              alert("修改成功！");
            }
          })
      }
    },
    created() {
      // console.log(this.userdetail)
      //验证登录
      this.$http.get('/checkLogin').then((res) => {
        if(!res.data.username){
          window.location.href='/';
          return;
        }
      })
      this.hash = 'phone'
      this.$dispatch('changeGobackHash',this.hash);
    },
    components: {
      split
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal_phone
    .nophone
      margin: 50px 0
      text-align: center
      font-size: 18px
    .nowphone
      margin: 50px 0
      text-align: center
      font-size: 18px
      p
        margin-bottom 20px
    .setphone
      padding-top: 30px
      text-align: center
      p
        text-align: center
      .num
        display: block
        margin: 20px auto
        border: 1px solid #666
        border-radius: 5px
        height: 20px
        padding: 5px
      .sub
        position: relative
        top: 30px
        padding:10px

</style>

