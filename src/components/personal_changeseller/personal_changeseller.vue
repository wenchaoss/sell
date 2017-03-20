<template>
  <div class="personal_changeseller">
    <div class="baseinfo"></div>





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
      this.hash = 'changeseller'
      this.$dispatch('changeGobackHash',this.hash);
      console.log(this.userdetail)
    },
    methods: {

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
</style>

