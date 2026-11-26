import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', {
  state: () => ({
    component: null,
    olmap: null,
    ready: false,
  }),

  actions: {
    setMap(component) {
      this.component = component;
      this.olmap = component.olmap;
      this.ready = true;
    },
  },
});
