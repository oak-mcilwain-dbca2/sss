// stores/measure.js

import { defineStore } from 'pinia';

export const useMeasureStore = defineStore('measure', {
  state: () => ({
    component: null,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
    },
  },
});
