import Vue from 'vue';
import axios from 'axios';
import _ from 'lodash';
import mockData from '@/mock-data.json';
import { DateTime } from 'luxon';

const template = require('./template.html');

export default Vue.component('thought-leadership-content', {
  template,
  name: 'thought-leadership-content',
  computed: {
    filteredContent() {
      const content = _.cloneDeep(this.content);
      content.splice(0, 2);
      // TODO add filter logic when nav is ready
      return {
        trimmed: content.slice(0, this.visibleContent),
        full: content,
      };
    },
    ctaText() {
      return {
        Video: Drupal.t('Watch the Video'),
        Article: Drupal.t('Read the Article'),
        Podcast: Drupal.t('Listen Now'),
        Infographic: Drupal.t('Read Now'),
      };
    },
  },
  data() {
    return {
      loading: false,
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
    async getData() {
      try {
        this.loading = true;
        this.content = await this.fetchData();
        this.sortData();
        this.featured.first = this.content[0];
        this.featured.second = this.content[1];
      } catch (e) {
        this.$log.error(e.message || e);
      } finally {
        this.loading = false;
      }
    },
    async fetchData() {
      let data = {};
      try {
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
      } catch (e) {
        this.$log.error(e.message || e);
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
  },
});
