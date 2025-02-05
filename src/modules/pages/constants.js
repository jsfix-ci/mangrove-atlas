import { NOT_FOUND } from 'redux-first-router';

export const PAGES = [
  {
    name: 'PAGE/APP',
    path: '/',
    page: 'app',
  },
  {
    name: 'PAGE/COUNTRY',
    path: '/country/:iso',
    page: 'app',
  },
  {
    name: 'PAGE/CUSTOM',
    path: '/custom-area',
    page: 'app',
  },
  {
    name: 'PAGE/WDPA',
    path: '/protected-area/:id',
    page: 'app',
  },
  {
    name: NOT_FOUND,
    path: '/404',
    page: 'not-found'
  },
];

export default PAGES;
