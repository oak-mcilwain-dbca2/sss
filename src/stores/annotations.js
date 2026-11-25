import { defineStore } from "pinia";

export const useAnnotationsStore = defineStore("annotations", {
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
