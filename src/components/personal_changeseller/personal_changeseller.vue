<template>
  <div class="personal_changeseller">
    <div class="baseinfo">
      <h1 class="info_header">店铺信息：</h1>
      <div class="main">
        <div>店铺名：<input type="text" v-model="name"></div>
        <div>快递描述：<input type="text" v-model="description"></div>
        <div>起送价：<input type="text" v-model="minPrice">元</div>
        <div>运费：<input type="text" v-model="deliveryPrice">元</div>
        <div><input type="button" value="修改基础信息" class="deinfo" @click="changebaseinfo"></div>
        <h1 class="info_header">其他信息：</h1>
        <div v-for="item in userdetail.seller.infos">
          <label><input type="radio" v-model="infos" value="{{$index}}">{{item}}</label>
        </div>
        <div><input type="text" v-model="newinfo"></div>
        <div><input type="button" value="删除信息" class="deinfo" @click="deinfo"><input @click="addinfo" type="button" value="增加信息" class="deinfo"></div>
        <h1 class="info_header">店铺公告</h1>
        <div><textarea class="bulletin">{{userdetail.seller.bulletin}}</textarea></div>
        <div><input type="button" value="修改店铺公告" class="deinfo" @click="changebulletin"></div>
      </div>
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
        infos:'',
        newinfo:'',
        name: this.userdetail.seller.name,
        description: this.userdetail.seller.description,
        minPrice: this.userdetail.seller.minPrice,
        deliveryPrice: this.userdetail.seller.deliveryPrice,
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
      this.hash = 'changeseller'
      this.$dispatch('changeGobackHash',this.hash);
      // console.log(this.userdetail)
    },
    methods: {
      deinfo:function () {
        this.$http.get('/deinfo?'+'num='+this.infos)
          .then((res) => {
            if(res.body == 1){
              alert("删除成功！");
              this.userdetail.seller.infos.splice(this.infos,1);
              this.$dispatch('refreshseller');
            }
          })
      },
      addinfo:function () {
        if(!this.newinfo){
          alert("您还没有输入！");
          return;
        }
        // console.log(this.userdetail)
        var param = {
          info: this.newinfo
        }
        this.$http.post('/addinfo',param)
          .then((res) => {
            if(res.body == 1){
              alert("增加成功！");
              this.userdetail.seller.infos.push(this.newinfo);
              this.newinfo = '';
              this.$dispatch('refreshseller');
            }
          })
      },
      changebaseinfo: function () {
        var param = {
          name: this.name,
          description: this.description,
          minPrice: this.minPrice,
          deliveryPrice: this.deliveryPrice,
        }
        this.$http.post('/changebaseinfo',param)
          .then((res) => {
            if(res.body == 1){
              alert("修改成功！");
              this.$dispatch('refreshseller');
            }
          })
      },
      changebulletin: function () {
        var param = {
          bulletin: this.userdetail.seller.bulletin
        };
        this.$http.post('/changebulletin',param)
          .then((res) => {
            if(res.body == 1){
              alert("修改成功！");
              this.$dispatch('refreshseller');
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
  .personal_changeseller
    .baseinfo
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
            border: 1px solid #666
            padding: 5px
            border-radius: 5px
        .deinfo
          display: inline-block
          margin-top 5px
          margin-right:30px
          padding: 5px
          border-radius: 5px
          font-size: 14px
        .bulletin
          resize: none;
          width: 90%
          height: 100px
          font-size: 14px
          line-height 20px
</style>

