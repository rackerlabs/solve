// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueLogger from 'vuejs-logger';
import VuePaginate from 'vue-paginate';
import Strings from '@/filters/strings';
import '@nm/zoolander/dist/css/derek.css'; // eslint-disable-line
import './scss/main.scss';
import App from './app-view';
import router from './router';
import store from './store';

const isProd = process.env.NODE_ENV === 'production';

Vue.use(VueLogger, {
  logLevels: isProd ? 'error' : ['debug', 'info', 'warn', 'error', 'fatal'],
  stringifyArguments: true,
  showLogLevel: true,
  showMethodName: true,
  showConsoleColors: true,
});

Vue.use(VuePaginate);
Vue.filter('capitalize', Strings.capitalize);
Vue.filter('unescape', Strings.unescape);
Vue.filter('truncate', Strings.truncate);
Vue.filter('translate', Strings.translate);

// lend me a hand lodash! to all components
Vue.prototype.$env = process.env.NODE_ENV;
Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.config.performance = true;

/* eslint-disable no-new */
new Vue({
  el: '#rsSolve',
  router,
  store,
  components: { App },
  template: '<App/>',
});
