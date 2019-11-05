import Vue from 'vue';
import Nav from './nav';
import Footer from './footer';
import Content from './content';

const template = require('./template.html');

export default Vue.component('thought-leadership', {
  template,
  name: 'thought-leadership',
  components: {
    Nav,
    Footer,
    Content,
  },
});
