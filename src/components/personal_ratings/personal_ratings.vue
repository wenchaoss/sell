<template>
  <div class="personal_ratings">
    personal_ratings
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
      this.hash = 'ratings'
      this.$dispatch('changeGobackHash',this.hash)
    },
    components: {
      split
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>

