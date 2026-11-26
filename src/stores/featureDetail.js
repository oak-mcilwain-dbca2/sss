// stores/featureDetail.js

import { defineStore } from 'pinia';

export const useFeatureDetailStore = defineStore('featureDetail', {
  state: () => ({
    component: null,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
    },
  },
});
