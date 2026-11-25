// stores/systemSetting.js

import { defineStore } from "pinia";

export const useSystemSettingStore = defineStore("systemSetting", {
  state: () => ({
    component: null,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
    },
  },
});
