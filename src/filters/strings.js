import _ from 'lodash';

export default {
  capitalize(value) {
    if (!value) return '';
    return _.startCase(value);
  },
  unescape(value) {
    if (!value) return '';
    return _.unescape(value);
  },
  translate(string) {
    return Drupal.t(string);
  },
  truncate(value, length, clamp) {
    const clampValue = clamp || '...';
    const node = document.createElement('div');
    node.innerHTML = value;
    const content = node.textContent;
    return content.length > length ? content.slice(0, length) + clampValue : content;
  },
};
