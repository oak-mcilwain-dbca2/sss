// stores/settings.js

import { defineStore } from "pinia";

export const useStateStore = defineStore("state", {
  state: () => ({
    fixedLayers: [],
    drawingLogs: [],
    redoPointer: 0,
    drawingSequence: 0,
    annotations: {
      type: "FeatureCollection",
      features: [],
    },
    hints: [],
    showHints: false,
  }),
});
