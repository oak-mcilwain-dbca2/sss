// stores/weatherOutlook.js

import { defineStore } from 'pinia';

export const useWeatherOutlookStore = defineStore('weatherOutlook', {
  state: () => ({
    component: null,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
    },
  },
});
