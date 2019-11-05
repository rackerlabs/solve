import Vue from 'vue';
import axios from 'axios';

const template = require('./template.html');

export default Vue.component('thought-leadership-content', {
  template,
  name: 'thought-leadership-content',
  data() {
    return {
      loading: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        this.loading = true;
        // TODO get this working
        const request = await axios({
          method: 'get',
          url: 'http://localhost:8888/api/thought-leadership?_format=json',
        });
        console.log('request: ', request);
      } catch (e) {
        console.log(e.message || e);
      } finally {
        this.loading = false;
      }
    },
  },
});
