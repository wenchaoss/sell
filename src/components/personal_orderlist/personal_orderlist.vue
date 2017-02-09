<template>
  <div class="personal_orderlist">
    <div class="noorder" v-show="orderlist.length === 0">
      <h1>没有结果</h1>
      <h2>暂时没有外卖订单记录</h2>
    </div>
    <div class="orderlist" v-show="orderlist.length !== 0">
      <li class="order-item" v-for="item in orderlist" @click="showOrder(item)">
        <div class="title">
          <h1 class="sellname">{{item.seller_name}}</h1>
          <h1 class="process">12323</h1>
        </div>
        <div class="time">{{item.date | formatDate}}</div>
        <div class="footer">
          <div class="name">{{item.foods.length === 1?item.foods[0].name : item.foods[0].name+"等"+item.foods.length+"件商品" }}</div>
          <div class="price">¥{{item.price}}</div>
        </div>
        <split></split>
      </li>
    </div>
    <personal_orderdetail v-ref:detail :userdetail="userdetail" :order="order"></personal_orderdetail>
  </div>

</template>

<script type="text/ecmascript-6">
  import split from 'components/split/split';
  import {formatDate} from 'common/js/date';
  import personal_orderdetail from 'components/personal_orderdetail/personal_orderdetail';

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
        orderlist: [],
        order: {}
      }
    },
    created() {
      this.hash = 'orderlist';
      this.$dispatch('changeGobackHash',this.hash);

      this.$http.get('/getorderlist')
        .then((res) => {
          this.orderlist = res.body;
        })
    },
    methods: {
      showOrder(item) {
        this.order = item;
        this.$refs.detail.show();
      }
    },
    components: {
      split,
      personal_orderdetail
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .personal_orderlist
    .noorder
      position: absolute
      top: 45px
      left: 0
      bottom: 0
      width: 100%
      padding-top: 150px
      background-color: #efefef
      overflow: hidden;
      text-align: center
      h1
        font-size:20px
        color: #333
      h2
        font-size: 14px
        color: #666
        margin-top: 20px
    .orderlist
      .order-item
        .title
          padding: 10px
          padding-top: 20px
          padding-bottom: 5px
          .sellname
            display: inline-block
            width: 200px
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            font-weight: 700
          .process
            display: inline-block
            float: right;
        .time
          font-size: 12px;
          color: #666
          margin-left: 10px
          margin-right: 10px
          padding-bottom: 10px
          border-bottom: 1px solid #eee
        .footer
          font-size: 14px
          padding: 15px 10px
          .name
            display: inline-block
          .price
            display: inline-block
            float: right
            font-weight: 700


</style>

