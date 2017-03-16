<template>
  <div class="personal_address">
    <div class="noaddress">您还没有设置收货地址！</div>
    <split></split>
    <div class="adrlist">
      <ul>
        <li v-for="item in userdetail.address"><label><input type="radio" v-model="address" value="{{$index}}">{{item}}</label></li>
      </ul>


      <input class="change" type="button" value="更换地址" @click="changeadr">
      <input class="change" type="button" value="删除地址" @click="delete">
    </div>
    <split></split>
    <div class="add">
      <p>增加新的地址：</p>
      <input class="text" type="text" v-model="newaddress">
      <input class="sub" type="button" value="提交新的地址" @click="addaddress">
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
      return{
        address: "0",
        newaddress: ""
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
      this.hash = 'address'
      this.$dispatch('changeGobackHash',this.hash);
      console.log(this.userdetail)
    },
    methods: {
      //增加地址
      addaddress: function () {
        this.$http.post('/addaddress',{
          address: this.newaddress
        })
          .then((res) => {
            if(res.body!="1"){alert("对不起！服务器错误");return;}
            this.userdetail.address.push(this.newaddress);
            this.newaddress = "";
            alert("添加成功!");
          })
      },
      //更换地址
      changeadr: function () {
        this.$http.get('/changeadr?'+'num='+this.address)
          .then((res) => {
            if(res.body == 1){
              var i = this.userdetail.address.splice(this.address,1);
              this.userdetail.address.unshift(i);
              console.log(this.address)
              // this.address = "0"
              alert("修改成功！");
            }
          })
      },
      //删除地址
      delete: function () {
        this.$http.get('/deleteadr?'+'num='+this.address)
          .then((res) => {
            if(res.body == 1){
              this.userdetail.address.splice(this.address,1);
              // this.address = "0"
              alert("删除成功！");
            }
          })
      }
    },
    components: {
      split
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal_address
    .noaddress
      margin: 50px 0
      text-align: center
      font-size: 18px
    .adrlist
      margin: 20px auto
      label
        padding: 10px
        padding-left: 20px
        display: block
      .change
        position: relative
        left: 20px
        padding: 5px
        margin-right: 20px
    .add
      padding-top: 20px
      text-align: center
      p
        text-align: center
      .text
        display: block
        margin: 20px auto
        width: 80%
        border: 1px solid #666
        border-radius: 5px
        height: 20px
        padding: 5px
      .sub
        position: relative
        top: 30px
        padding:10px
</style>

