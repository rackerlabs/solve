import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/thought-leadership',
    },
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/full-page/:id',
      name: 'full',
      component: require('@/layout/full-page/').default, // eslint-disable-line
      children: [
        {
          path: '/thought-leadership',
          name: 'thought-leadership',
          component: require('@/pages/thought-leadership/').default, // eslint-disable-line
          meta: {
            content: 'thought-leadership',
            format: 'json',
          },
          props: {
            default: true,
          },
        },
      ],
    },
  ],
});
