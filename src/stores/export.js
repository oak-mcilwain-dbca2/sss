// stores/export.js

import { defineStore } from 'pinia';

export const useExportStore = defineStore('export', {
  state: () => ({
    component: null,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
    },
  },
});
