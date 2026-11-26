// stores/catalogue.js

import { defineStore } from 'pinia';

export const useCatalogueStore = defineStore('catalogue', {
  state: () => ({
    filters: [
      ['basemap', 'Base Imagery'],
      ['boundaries', 'Admin Boundaries'],
      ['communications', 'Communications'],
      ['fire', 'Fire Operations'],
      ['meteorology', 'Meteorology'],
      ['vegetation', 'Vegetation'],
      ['tenure', 'Tenure and Land Use'],
      ['infrastructure', 'Infrastructure'],
      ['grid', 'Grid Systems'],
      ['resources', 'Resource Tracking'],
    ],
  }),
});
