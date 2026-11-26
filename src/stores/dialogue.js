// stores/dialogue.js

import { defineStore } from 'pinia';

export const useDialogueStore = defineStore('dialogue', {
  state: () => ({
    component: null,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
    },
  },
});
