// stores/toolbox.js

import { defineStore } from 'pinia';

export const useToolboxStore = defineStore('toolbox', {
  state: () => ({
    component: null,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
    },
  },
});
