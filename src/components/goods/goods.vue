<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <li v-for="item in goods" class="menu-item" :class="{'current':currentIndex===$index}" @click="selectMenu($index,$event)">
          <span class="text" border-1px>
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item border-1px" v-for="food in item.foods" @click="selectFood(food,$event)">
                <div class="icon">
                  <img width="57" :src="food.icon">
                </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">{{food.price}}</span><span class="old"v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <!--定义v-shopcart，在methods里可以通过this.$refs.sho...访问到子组件 -->
  <shopcart v-ref:shopcart :userdetail="userdetail" :seller="seller" :select-foods="selectFoods" :delivery-price="seller.seller.deliveryPrice" :min-price="seller.seller.minPrice"></shopcart>
  <!--food详情页组件-->
  <div>
    <food :food="selectedFood" v-ref:food></food>
  </div>
</template>

<script type="text/ecmascript-6">
  //使用npm的better-scroll滚动库
  import BScroll from 'better-scroll'
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';

  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      },
      userdetail: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      //scrollY被监听实时变化，Index根据vue特性也会随时变化
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          //scrollY落在这个区间
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        //遍历的good.foods
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      if(this.seller){
        // console.log(this.seller.goods)
        this.goods = this.seller.goods;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      //数据变化监听 切换goods
      changeseller() {
        this.goods = this.seller.goods;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      },
      selectMenu(index, event) {
        //BS库里面点击事件存在这个属性，浏览器默认点击事件没有这个属性，可以防止执行两次
        if (!event._constructed) {
          return;
        }
        //转换为驼峰式
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        // console.log(el)
        //BS API 滚动到某个节点,el为源生dom节点
        this.foodsScroll.scrollToElement(el, 300);
      },
      //显示food组件
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      //初始化better-scroll,实现滑动
      _initScroll() {
        this.meunScroll = new BScroll(this.$els.menuWrapper, {
          click: true
        });
        //probeType，希望scroll在滚动的时候跟踪滚动的位置
        this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
          click: true,
          probeType: 3
        });

        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      //处理区块的高度
      _calculateHeight() {
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      //小球掉落方法
      _drop(target) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          //访问子组件
          this.$refs.shopcart.drop(target);
        });
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    },
    watch: {
      'seller' : 'changeseller'
    },
    //接受cartcontrol组件传递的事件，小球掉落位置
    events: {
      'cart.add'(target) {
        this._drop(target);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    /*等分 缩放情况 占位空间*/
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background-color: #f3f5f7
      .menu-item
        /*不论一行还是两行都需要垂直居中*/
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')


        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>

