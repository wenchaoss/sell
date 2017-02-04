import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import index from './index';
import App from './App';
import home from 'components/home/home';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';
import personal from 'components/personal/personal';

import 'common/stylus/index.styl';      //引入全局css样式

Vue.use(VueRouter);
Vue.use(VueResource);
/* eslint-disable no-new */
let app = Vue.extend(index);

let router = new VueRouter({
  //切换路由默认加的类名
  linkActiveClass: 'active'
});
// router.map({
//   '/': {
//     component: goods
//   },
//   '/goods': {
//     component: goods
//   },
//   '/ratings': {
//     component: ratings
//   },
//   'seller': {
//     component: seller
//   }
// });
router.map({
  '/home':{
    component: home
  },
  '/personal': {
    component: personal
  },
  '/detail':{
    component: App,
    subRoutes: {
      '/':{
        component: goods
      },
      '/goods':{
        component: goods
      },
      '/ratings':{
        component: ratings
      },
      '/seller': {
        component: seller
      }
    }
  },
})

router.start(app,'#app');
//默认跳转
router.go('/home');
