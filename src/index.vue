<template>
  <div>
    <router-view :allseller="allseller" :seller="showseller" :userdetail="userdetail" ></router-view>
  </div>

</template>

<script type="text/ecmascript-6">
  const ERR_OK = 0;

  export default {
    data() {
      return {
        allseller: [],
        showseller: {},
        // username: '',
        userdetail: {
          username: '',
          type: true
        }
      };
    },
    created() {
      this.$http.get('/allSeller').then((res) => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.allseller = res.data
          // console.log(this.allseller)
        }
      });
      // this.$http.get('/checkLogin').then((res) => {
      //   if(res.body.data){
      //     this.username = res.body.data;
      //   }
      // })
    },
    events: {
      'changeseller'(seller){
        this.showseller = seller;
      },
      'checkuserdetail'(userdetail){
        this.userdetail = userdetail;
      },
      'refreshseller'(){
        this.$http.get('/allSeller').then((res) => {
          res = res.body;
          if (res.errno === ERR_OK) {
            this.allseller = res.data
          }
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>

