// stores/state.js

import { defineStore } from 'pinia';

export const useStateStore = defineStore('state', {
  state: () => ({
    tourVersion: null,
    touring: false,

    fixedLayers: [],
    drawingLogs: [],
    redoPointer: 0,
    drawingSequence: 0,

    annotations: {
      type: 'FeatureCollection',
      features: [],
    },

    hints: [],
    showHints: false,

    activeMenu: null,
    activeSubmenu: null,
  }),
  getters: {
    activeModule: (state) => state.activeSubmenu || state.activeMenu,
  },
  actions: {
    startTour(version) {
      this.tourVersion = version;
      this.touring = true;
    },

    stopTour() {
      this.touring = false;
    },
  },
});
