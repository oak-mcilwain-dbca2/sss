// stores/weatherForecast.js

import { defineStore } from 'pinia';

export const useWeatherForecastStore = defineStore('weatherForecast', {
  state: () => ({
    component: null,
  }),

  actions: {
    setComponent(component) {
      this.component = component;
    },
  },
});
