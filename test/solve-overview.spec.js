import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Solve from '../src/pages/solve-overview/';

describe('getGridStyles', () => {
  beforeEach(() => {
    this.wrapper = shallowMount(Solve);
  });

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
