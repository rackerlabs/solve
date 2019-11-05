import Vue from 'vue';
import SolveLogo from './solve-logo';
import RsLogo from './rs-logo';
import SponsorLogo from './sponsor-logo';

const template = require('./template.html');

export default Vue.component('thought-leadership-nav', {
  template,
  name: 'thought-leadership-nav',
  components: {
    SolveLogo,
    RsLogo,
    SponsorLogo,
  },
});
