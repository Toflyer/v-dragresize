import Vue from 'vue';
import App from './App.vue';
import dragResize from '../../dist/em/index';


Vue.use(dragResize);

Vue.config.productionTip = false;



new Vue({
  render: h => h(App),
}).$mount('#app');
