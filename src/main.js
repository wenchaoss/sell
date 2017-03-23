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
import personal_orderlist from 'components/personal_orderlist/personal_orderlist';
import personal_index from 'components/personal_index/personal_index';
import personal_address from 'components/personal_address/personal_address';
import personal_ratings from 'components/personal_ratings/personal_ratings';
import personal_phone from 'components/personal_phone/personal_phone';
import personal_changeseller from 'components/personal_changeseller/personal_changeseller';
import personal_managegoods from 'components/personal_managegoods/personal_managegoods';

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
    component: personal,
    subRoutes: {
      '/': {
        component: personal_index
      },
      '/orderlist': {
        component: personal_orderlist
      },
      '/address': {
        component: personal_address
      },
      '/ratings': {
        component: personal_ratings
      },
      '/phone': {
        component: personal_phone
      },
      '/changeinfo': {
        component: personal_changeseller
      },
      '/managegoods': {
        component: personal_managegoods
      }
    }
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
