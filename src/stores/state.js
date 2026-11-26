// stores/state.js

import { defineStore } from 'pinia';

import env from '@/config/env';

export const useStateStore = defineStore('state', {
  state: () => ({
    tourVersion: null,
    touring: false,

    view: {
      center: [123.75, -24.966],
      scale: 4026092,
    },

    activeLayers: [
      [env.resourceTrackingLiveLayer, {}],
      [env.stateMapLayer, {}],
    ],
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
