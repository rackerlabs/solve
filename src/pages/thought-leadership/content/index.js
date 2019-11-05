import Vue from 'vue';
import axios from 'axios';

const template = require('./template.html');

export default Vue.component('thought-leadership-content', {
  template,
  name: 'thought-leadership-content',
  data() {
    return {
      loading: false,
      content: null,
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
        this.content = request.response;
      } catch (e) {
        this.$log.error(e.message || e);
      } finally {
        this.loading = false;
      }
    },
  },
});
