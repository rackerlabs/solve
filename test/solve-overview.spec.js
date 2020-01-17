import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Strings from '@/filters/strings';
import Solve from '../src/pages/solve-overview/';

const localVue = createLocalVue();
localVue.filter('translate', Strings.translate);
localVue.filter('truncate', Strings.truncate);
localVue.prototype.$env = 'development';

describe('Solve', () => {
  beforeEach(() => {
    this.wrapper = shallowMount(Solve, { localVue });
    window.rsSolveFilterTopic = undefined;
    window.Drupal = {
      t: string => string,
    };
  });

  describe('rendered', () => {
    describe('preloader', () => {
      it('should contain a preloader image', () => {
        expect(this.wrapper.html()).to.contain('<img src="data:image/svg+xml;base64,');
      });

      it('should not contain a preloader image after content is loaded', async () => {
        await this.wrapper.vm.getData();
        expect(this.wrapper.html()).to.not.contain('<img src="data:image/svg+xml;base64,');
      });
    });

    describe('content', () => {
      it('should display header fields instead of title fields', async () => {
        await this.wrapper.vm.getData();
        // Check featured post.
        expect(this.wrapper.text()).to.not.contain('Thought Leadership: Sample Admin Title');
        expect(this.wrapper.text()).to.contain('Thought Leadership Sample Header');
        // Check secondary post.
        expect(this.wrapper.text()).to.not.contain('Two: This is a Semi Long Title');
        expect(this.wrapper.text()).to.contain('This is a Semi Long Title 2');
        // Check tertiary post.
        expect(this.wrapper.text()).to.not.contain('Three: This is a Semi Long Title');
        expect(this.wrapper.text()).to.contain('This is a Semi Long Title 3');
      });
    });

    describe('CTAs', async () => {
      it('should all contain track-cta class', async () => {
        window.rsSolveFilterTopic = '122';
        await this.wrapper.vm.getData();
        const linkCt = this.wrapper.findAll('a').length;
        expect(linkCt).to.eql(9);
        for (let i = 0; i < linkCt; i += 1) {
          expect(this.wrapper.findAll('a').at(i).classes()).to.contain('track-cta');
        }
      });
    });
  });

  describe('computed', () => {
    describe('filteredContent', () => {
      it('loads all content and has two featured items when no filter is present', async () => {
        await this.wrapper.vm.getData();
        expect(this.wrapper.vm.filteredContent.total).to.eql(12);
        expect(this.wrapper.vm.filteredContent.featured).to.eql(2);
      });

      it('loads only filtered content and only has one featured item when a filter is present', async () => {
        window.rsSolveFilterTopic = '269';
        await this.wrapper.vm.getData();
        expect(this.wrapper.vm.filteredContent.total).to.eql(10);
        expect(this.wrapper.vm.filteredContent.featured).to.eql(1);
      });

      it('loads nothing when filter is invalid', async () => {
        window.rsSolveFilterTopic = '999';
        await this.wrapper.vm.getData();
        expect(this.wrapper.vm.filteredContent.total).to.eql(0);
        expect(this.wrapper.vm.filteredContent.featured).to.eql(0);
      });
    });

    describe('viewAction', () => {
      it('returns expected values', () => {
        expect(this.wrapper.vm.viewAction).to.eql({
          Video: 'watch',
          Article: 'read',
          Podcast: 'listen',
          Infographic: 'read',
        });
      });
    });

    describe('ctaText', () => {
      it('returns expected values', () => {
        expect(this.wrapper.vm.ctaText).to.eql({
          Video: 'Watch the Video',
          Article: 'Read the Article',
          Podcast: 'Listen Now',
          Infographic: 'Read Now',
        });
      });
    });
  });

  describe('methods', () => {
    describe('getGridStyles', () => {
      it('returns {1,1} for index 0', () => {
        expect(this.wrapper.vm.getGridStyles(0)).to.eql({ 'grid-row': 1, 'grid-column': 1 });
      });

      it('returns {1,2} for index 1', () => {
        expect(this.wrapper.vm.getGridStyles(1)).to.eql({ 'grid-row': 1, 'grid-column': 2 });
      });

      it('returns {2,1} for index 2', () => {
        expect(this.wrapper.vm.getGridStyles(2)).to.eql({ 'grid-row': 2, 'grid-column': 1 });
      });

      it('returns {2,2} for index 3', () => {
        expect(this.wrapper.vm.getGridStyles(3)).to.eql({ 'grid-row': 2, 'grid-column': 2 });
      });

      it('returns {3,1} for index 4', () => {
        expect(this.wrapper.vm.getGridStyles(4)).to.eql({ 'grid-row': 3, 'grid-column': 1 });
      });

      it('returns {3,2} for index 5', () => {
        expect(this.wrapper.vm.getGridStyles(5)).to.eql({ 'grid-row': 3, 'grid-column': 2 });
      });
    });

    describe('formatDate', () => {
      it('returns properly formatted date when passed a Date object', () => {
        const date = new Date('2017-06-11 03:30:30');
        expect(this.wrapper.vm.formatDate(date)).to.eql('June 11, 2017');
      });

      it('throws TypeError when passed a string', () => {
        const date = '2017-06-11 03:30:30';
        expect(() => { this.wrapper.vm.formatDate(date); })
          .to.throw('date.getDate is not a function');
      });
    });

    describe('getDateString', () => {
      it('returns properly formatted date when passed a Date object', () => {
        const date = new Date('2017-06-11 03:30:30');
        expect(this.wrapper.vm.getDateString(date)).to.eql('June 11, 2017');
      });

      it('returns properly formatted date when passed a string', () => {
        const date = '2017-06-11 03:30:30';
        expect(this.wrapper.vm.getDateString(date)).to.eql('June 11, 2017');
      });
    });

    describe('fetchData', () => {
      it('retrieves 12 results', () => this.wrapper.vm.fetchData().then((data) => {
        expect(data.length).to.eql(12);
        expect(data[0].title).to.eql('Thought Leadership: Sample Admin Title');
        expect(data[10].field_author).to.eql('Mike Rustyellow');
      }));
    });

    describe('visibleContent', () => {
      it('is initially set to 4', () => {
        expect(this.wrapper.vm.getVisibleContentCount()).to.eql(4);
      });

      it('increments by 4 until it has no more results to load', async () => {
        window.rsSolveFilterTopic = '269';
        await this.wrapper.vm.getData();
        expect(this.wrapper.vm.getVisibleContentCount()).to.eql(4);
        this.wrapper.vm.loadMore();
        expect(this.wrapper.vm.getVisibleContentCount()).to.eql(8);
        this.wrapper.vm.loadMore();
        expect(this.wrapper.vm.getVisibleContentCount()).to.eql(9);
        this.wrapper.vm.loadMore();
        expect(this.wrapper.vm.getVisibleContentCount()).to.eql(9);
      });
    });

    describe('filteredContent', () => {
      it('initially contains 10 items by default', async () => {
        await this.wrapper.vm.getData();
        expect(this.wrapper.vm.getFilteredContentCount()).to.equal(10);
      });

      it('contains 9 items when filter is changed', async () => {
        window.rsSolveFilterTopic = '272';
        await this.wrapper.vm.getData();
        expect(this.wrapper.vm.getFilteredContentCount()).to.equal(9);
      });

      it('contains 0 items when filter is invalid', async () => {
        window.rsSolveFilterTopic = '499';
        await this.wrapper.vm.getData();
        expect(this.wrapper.vm.getFilteredContentCount()).to.equal(0);
      });
    });

    describe('sortData', () => {
      it('sorts array of objects by field_published_date', async () => {
        this.wrapper.vm.content = [
          {
            title: 'A',
            field_published_date: '2019-10-01T11:20:57-05:00',
          },
          {
            title: 'B',
            field_published_date: '2019-11-01T11:20:57-05:00',
          },
          {
            title: 'C',
            field_published_date: '2019-09-01T11:20:57-05:00',
          },
        ];
        this.wrapper.vm.sortData();
        const content = this.wrapper.vm.getContent();
        expect(content[0].title).to.eql('B');
        expect(content[1].title).to.eql('A');
        expect(content[2].title).to.eql('C');
      });
    });

    describe('getCategories', () => {
      it('retrieves 6 results', () => this.wrapper.vm.getCategories().then((cats) => {
        expect(cats.length).to.eql(6);
        expect(cats[2].name).to.eql('Innovation');
        expect(cats[2].tid).to.eql('269');
        expect(cats[5].name).to.eql('What Are You Solving For?');
        expect(cats[5].tid).to.eql('273');
      }));
    });

    describe('getVersionString', () => {
      it('should have a version when drupalSettings.rsSolveLastMod property is set.', async () => {
        window.drupalSettings = {
          rsSolveLastMod: 'abc123',
        };
        expect(this.wrapper.vm.getVersionString()).to.eql('&version=abc123');
      });

      it('should have an empty version when drupalSettings.rsSolveLastMod property is empty.', async () => {
        window.drupalSettings = {
          rsSolveLastMod: '',
        };
        expect(this.wrapper.vm.getVersionString()).to.eql('');
      });

      it('should be empty when drupalSettings.rsSolveLastMod property is not set.', async () => {
        window.drupalSettings = {};
        expect(this.wrapper.vm.getVersionString()).to.eql('');
      });
    });
  });
});
