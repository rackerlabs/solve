import Vue from 'vue';
import axios from 'axios';
import _ from 'lodash';
import mockData from '@/mock-data.json';
import mockCategories from '@/mock-categories.json';
import formatDate from '@/mixins/date-format';

const template = require('./template.html');

export default Vue.component('solve-overview-content', {
  template,
  name: 'solve-overview-content',
  mixins: [formatDate],
  computed: {
    filteredContent() {
      let content = _.cloneDeep(this.content);
      const total = content ? content.length : 0;
      let articles = 1;
      if (!this.topic.header) {
        articles = 2;
      }
      if (content && total > articles) {
        content.splice(0, articles);
      } else {
        content = [];
      }
      return {
        trimmed: content ? content.slice(0, this.visibleContent) : [],
        full: content || [],
        total,
        featured: Math.min(articles, total),
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
      topic: {
        header: false,
        desc: false,
      },
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
      const topic = window.rsSolveFilterTopic;
      if (typeof topic !== 'undefined') {
        const cats = await this.getCategories();
        const catData = _.find(cats, c => c.tid === topic);
        if (catData) {
          this.topic.header = catData.name;
          this.topic.desc = catData.description;
        }

        this.content = _.filter(this.content, (item) => {
          const tokens = item.field_tl_.split(':::');
          return tokens.indexOf(window.rsSolveFilterTopic) > -1;
        });
      }
    },
    async getCategories() {
      let data = {};
      if (this.$env === 'development') {
        data = await new Promise((resolve) => {
          resolve(mockCategories);
        });
      } else {
        const resp = await axios({
          method: 'get',
          url: `api/thought-leadership-categories?_format=json${this.getVersionString()}`,
        });
        data = resp.data;
      }
      return data;
    },
    async getData() {
      try {
        this.loading = true;
        this.fetchError = false;
        this.content = await this.fetchData();
        await this.filterByTopic();
        this.sortData();
        // if there is no topic filter then we need the featured header
        let article = 0;
        if (!this.topic.header) {
          this.featured.first = this.content[0];
          article = 1;
        }
        // we will always need the secondary
        this.featured.second = this.content[article];
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
          resolve(mockData);
        });
      } else {
        const resp = await axios({
          method: 'get',
          url: `api/thought-leadership?_format=json${this.getVersionString()}`,
        });
        data = resp.data;
      }
      return data;
    },
    getVersionString() {
      if (typeof window.drupalSettings !== 'undefined' && typeof window.drupalSettings.rsSolveLastMod !== 'undefined' && window.drupalSettings.rsSolveLastMod.length) {
        return `&version=${window.drupalSettings.rsSolveLastMod}`;
      }

      return '';
    },
    sortData() {
      this.content = this.content.sort((a, b) => {
        const c = new Date(a.field_published_date);
        const d = new Date(b.field_published_date);
        return c - d;
      }).reverse();
    },
    getContent() {
      return this.content;
    },
    getFilteredContentCount() {
      return this.filteredContent.full.length;
    },
    getVisibleContentCount() {
      return this.visibleContent;
    },
    incrementVisibleContent() {
      const itemsLeft = this.getFilteredContentCount() - this.getVisibleContentCount();
      this.visibleContent += (itemsLeft > this.moreAmount) ? this.moreAmount : itemsLeft;
    },
    loadMore() {
      const num = this.getVisibleContentCount();
      if (num < this.getFilteredContentCount()) {
        this.incrementVisibleContent();
      }
    },
    getDateString(isoDate) {
      return this.formatDate(new Date(isoDate));
    },
    getGridStyles(index) {
      return {
        'grid-row': Math.floor(index / 2) + 1,
        'grid-column': (index % 2) + 1,
      };
    },
  },
});
