import { defineStore } from 'pinia';

export const useInfoStore = defineStore('info', {
  state: () => ({
    component: null,
    ready: false,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
      this.ready = true;
    },
  },
});
