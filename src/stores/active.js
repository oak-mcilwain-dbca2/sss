// stores/active.js

import { defineStore } from 'pinia';

export const useActiveStore = defineStore('active', {
  state: () => ({
    component: null,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
    },
  },
});
