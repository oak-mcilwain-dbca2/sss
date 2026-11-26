import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    screenHeight: 0,
    leftPanelHeadHeight: 90,
    hintsHeight: 0,
  }),
});
