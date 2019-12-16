// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint import/first: "off" */

// so we can support ie 11
require('babel-polyfill'); // eslint-disable-line

import Vue from 'vue';
import VueLogger from 'vuejs-logger';
import Strings from '@/filters/strings';
import Zoolander from 'zoolander'; // eslint-disable-line
import './scss/main.scss';
import App from './pages/solve-overview';

const isProd = process.env.NODE_ENV === 'production';

Vue.use(VueLogger, {
  logLevels: isProd ? 'error' : ['debug', 'info', 'warn', 'error', 'fatal'],
  stringifyArguments: true,
  showLogLevel: true,
  showMethodName: true,
  showConsoleColors: true,
});

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
  components: { App },
  template: '<App/>',
});
