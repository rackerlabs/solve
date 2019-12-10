import Vue from 'vue';
import axios from 'axios';
import _ from 'lodash';
import mockData from '@/mock-data.json';
import { DateTime } from 'luxon';

const template = require('./template.html');

export default Vue.component('solve-overview-content', {
  template,
  name: 'solve-overview-content',
  computed: {
    filteredContent() {
      let content = _.cloneDeep(this.content);
      const total = content.length;
      if (content && total > 2) {
        content.splice(0, 2);
      } else {
        content = [];
      }
      return {
        trimmed: content ? content.slice(0, this.visibleContent) : [],
        full: content || [],
        total,
      };
    },
    viewAction() {
      return {
        Video: 'watch',
        Article: 'read',
        Podcast: 'listen',
        Infographic: 'read',
      };
    },
    ctaText() {
      return {
        Video: 'Watch the Video',
        Article: 'Read the Article',
        Podcast: 'Listen Now',
        Infographic: 'Read Now',
      };
    },
  },
  data() {
    return {
      loading: false,
      fetchError: false,
      moreAmount: 4,
      visibleContent: 4,
      featured: {
        first: null,
        second: null,
      },
      content: null,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async filterByTopic() {
      if (typeof window.rsSolveFilterTopic !== 'undefined') {
        this.content = _.filter(this.content, (item) => {
          // eslint-disable-next-line no-underscore-dangle
          const tokens = item.field_tl_.split(':::');
          return tokens.indexOf(window.rsSolveFilterTopic) > -1;
        });
      }
    },
    async getData() {
      try {
        this.loading = true;
        this.fetchError = false;
        this.content = await this.fetchData();
        this.filterByTopic();
        this.sortData();
        this.featured.first = this.content[0];
        this.featured.second = this.content[1];
      } catch (e) {
        this.fetchError = e.message || 'No articles could be found. Please try again later.';
        this.$log.error(e.message || e);
      } finally {
        this.loading = false;
      }
    },
    async fetchData() {
      let data = {};
      if (this.$env === 'development') {
        data = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(mockData);
          }, 2000);
        });
      } else {
        const resp = await axios({
          method: 'get',
          url: 'api/thought-leadership?_format=json',
        });
        data = resp.data;
      }
      return data;
    },
    sortData() {
      this.content = this.content.sort((a, b) => {
        const c = new Date(a.field_published_date);
        const d = new Date(b.field_published_date);
        return c - d;
      }).reverse();
    },
    loadMore() {
      const num = this.visibleContent;
      if (num < this.filteredContent.full.length) {
        this.visibleContent += this.moreAmount;
      }
    },
    formatDate(isoDate) {
      const date = DateTime.fromISO(isoDate);
      return `${date.monthLong} ${date.day}, ${date.year}`;
    },
    getGridStyles(index) {
      return {
        'grid-row': Math.floor(index / 2) + 1,
        'grid-column': (index % 2) + 1,
      };
    },
  },
});
