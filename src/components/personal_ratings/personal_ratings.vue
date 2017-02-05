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

