import Vue from 'vue';
import InstantSearch from 'vue-instantsearch';
import VueRouter from 'vue-router';

import App from './App.vue';
import Search from './Search.vue';

Vue.use(InstantSearch);
Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'search',
      path: '/search',
      component: Search,
      props: route => ({ queryParameters: route.query }),
    },
    { path: '/', redirect: '/search' },
  ],
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
