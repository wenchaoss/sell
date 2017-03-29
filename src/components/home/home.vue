<template>
  <div class="home">
    <div class="home_header">
      <h1 class="title">山东师范大学外卖平台</h1>
    </div>
    <split></split>
    <div class="login-wrapper">
      <div class="info" v-show="userdetail.username && !sub">
        <p>欢迎！ {{userdetail.username}}</p>
        <button class="person" v-link="{path:'/personal'}">查看个人中心</button>
        <button class="logout" @click="logout">退出</button>
      </div>
      <div class="login" v-show="!userdetail.username && !logpage && !sub">
        <div class="left" @click="touser">
          <img src="ke.png">
          <p>用户登录</p>
        </div>
        <div class="right" @click="tosell">
          <img src="shang.png">
          <p>商家登录</p>
        </div>
      </div>
      <div class="logpage" v-show="logpage && !userdetail.username && !sub">
        <div class="username">
          用户名： <input type="text" v-model="log.username">
        </div>
        <div class="password">
          &emsp;密码： <input type="password" v-model="log.password">
        </div>
        <div class="btn">
          <button @click="login">登录</button>
          <button class="sub" @click="subon">注册</button>
          <button class="goback" @click="goback">返回</button>
        </div>
      </div>
      <div class="sub" v-show="sub">
        <div class="username">
          用户名： <input type="text" @change="checkusername" v-model="subinfo.username" placeholder="6~18位不允许中文特殊字符">
          <i class="err" v-show="usernamebol === 1">X</i>
          <i class="right" v-show="usernamebol === 0">√</i>
        </div>
        <div class="password">
          &emsp;密码： <input type="password" @change="checkpas" v-model="subinfo.password" placeholder="6~18位不允许中文特殊字符">
          <i class="err" v-show="passwordbol === 1">X</i>
          <i class="right" v-show="passwordbol === 0">√</i>
        </div>
        <div class="password2">
          再次输入： <input type="password" @change="checkpas" v-model="subinfo.password2" placeholder="请再次输入密码">
          <i class="err" v-show="passwordbol === 1">X</i>
          <i class="right" v-show="passwordbol === 0">√</i>
        </div>
        <div class="type">
          <label>用户<input @change="cls" type="radio" v-model="subinfo.subtype" value="true" checked></label>
          <label>商家<input @change="cls" type="radio" v-model="subinfo.subtype" value="false"></label>
        </div>
        <div class="btn">
          <button class="sub" @click="dosub">提交</button>
          <button class="goback" @click="goback" >返回</button>
        </div>
      </div>
    </div>
    <split></split>
    <div class="sellers">
      <ul>
        <li v-for="seller in allseller" v-show="seller.seller.checkout != 1" class="seller-item" v-link="{path:'/detail/goods'}" @click="changeSeller(seller)">
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
        logpage: false,
        logintype: true,
        sub: false,
        usernamebol: 2,           //用户名验证，0正确，1错误，2不显示
        passwordbol: 2,           //密码验证，0正确，1错误，2不显示
        log: {
          username: '',
          password: '',
          logintype: true
        },
        subinfo: {
          username: '',
          password: '',
          password2: '',
          subtype: true         //true默认注册用户
        },
        userdetail: {
          // username: '',
          // type: true
        }
      }
    },
    created() {

      this.$http.get('/checkLogin').then((res) => {
        if(res.data){
          this.userdetail = res.data;
          this.$dispatch('checkuserdetail',this.userdetail)
        }
      })
    },
    // watch: {
    //   'subinfo.subtype' : 'checkusername'
    // },
    methods: {
      changeSeller(seller) {
        // console.log(seller)
        this.$dispatch('changeseller',seller)
      },
      login() {
        //true为用户登录
        if(this.logintype){
          this.log.logintype = true;
        }else {
          this.log.logintype = false;
        }
        this.$http.post('login',this.log).then((res) => {
          // console.log(res.data)
          if(res.data == -1){
            alert("对不起！服务器错误");
            return;
          }else if(res.data == -2){
            alert("对不起！没有这个用户");
            return;
          }else if(res.data == -3){
            alert("对不起！密码错误");
            return;
          }
          alert("登录成功！")
          this.userdetail = res.data;
          console.log(this.userdetail)
          this.$dispatch('checkuserdetail',this.userdetail)
        })
      },
      logout() {
        this.$http.get('logout').then((res) => {
          if(res.data==1){
            this.userdetail = {
              username: '',
              type: true
            };
            this.$dispatch('checkuserdetail',this.userdetail)
            alert("成功登出！")
          }
        })
      },
      //用户登录切换
      touser() {
        this.logpage = true;
        this.logintype = true;
      },
      tosell() {
        this.logpage = true;
        this.logintype = false;
      },
      //重新选择登录
      goback() {
        this.logpage = false;
        this.sub = false;
      },
      subon() {
        this.sub = true;
      },
      checkusername() {
        if(! /^\w{5,17}$/.test(this.subinfo.username)){
          this.usernamebol = 1
        }else {
          this.$http.get('/checkexist?'+'username='+this.subinfo.username + '&subtype=' + this.subinfo.subtype).then((res) => {
            //false 表示未被占用
            if(res.body == 'false'){
              this.usernamebol = 0;
            }else{
              this.usernamebol = 1;
            }

          })
        }
      },
      checkpas() {
        if(!this.subinfo.password || !this.subinfo.password2){
          //两个密码框存在没有输入的，就不显示
          this.passwordbol = 2;
        }else if(this.subinfo.password != this.subinfo.password2){
          this.passwordbol = 1;
        }else{
          this.passwordbol = 0;
        }
      },
      cls() {
        //切换注册方式
        this.subinfo.username = '';
        this.subinfo.password = '';
        this.subinfo.password2 = '';
        this.usernamebol = 2;
        this.passwordbol = 2;
      },
      dosub() {
        if(this.usernamebol === 0 && this.passwordbol === 0){
          this.$http.post('/createuser',{
            username: this.subinfo.username,
            password: this.subinfo.password,
            subtype : this.subinfo.subtype
          })
            .then((res) => {
              alert("恭喜！注册成功");
              this.subinfo = {};
              this.subinfo.subtype = true;
              this.logpage = false;
              this.sub = false;
              this.usernamebol = 2;
              this.passwordbol = 2;
            })
        }
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
    .info
      padding: 10px
      p
        margin-bottom: 15px
      button
        display: inline-block
        border: 1px solid #fff
        border-radius: 5px
        padding: 10px 25px
      .person
        margin-left: 15px

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
    .logpage
      padding: 10px 0 10px 40px
      .btn
        position: relative
      .password
        margin: 15px 0
      input
        width: auto
      button
        display: inline-block
        /*margin: 0 auto*/
        /*margin-left: 50px*/
        margin-right: 10px
        margin-top: 10px
        border: 1px solid #fff
        border-radius: 5px
        padding: 10px 25px
      input
        border: 1px solid #999
        border-radius: 5px
        padding: 5px


    .sub
      padding: 10px 0 10px 25px
      position: relative
      i
        display: inline-block
        width: 11px
        height: 12px
        font-size: 12px
        line-height: 12px
        background-color: red
        color: #fff
        border-radius: 3px
        &.right
          background-color: rgb(0, 151, 255)
      .username
      .password
        margin: 15px 0
      .password2
        margin-left: -17px
        margin-bottom: 10px
      input
        border: 1px solid #999
        border-radius: 5px
        padding: 5px
      .type
        margin-left: 15px
        label
          margin-right: 20px
      .btn
        margin-left: 20px
        position: relative
        button
          display: inline-block
          /*margin: 0 auto*/
          /*margin-left: 50px*/
          margin-right: 10px
          margin-top: 10px
          border: 1px solid #fff
          border-radius: 5px
          padding: 10px 25px
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

