// stores/settings.js

import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: {
      undoLimit: 0,
      lengthUnit: 'km',
      areaUnit: 'ha',
      measureFeature: false,

      print: {
        retainBoundingbox: true,
        snapToFixedScale: true,
      },

      overviewMap: true,
      hoverInfo: false,
      resourceLabels: true,
      resourceDirections: true,
      viewportOnly: false,
      rightHandTools: true,
      graticule: true,

      bfrs: {
        bushfireLabels: true,
        viewportOnly: false,
      },

      weatheroutlook: {
        'weather-outlook-customized': null,
        'weather-outlook-amicus': null,
      },
    },
  }),
  resetSettings() {
    this.$reset();
  },
});
