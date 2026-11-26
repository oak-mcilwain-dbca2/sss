<template>
  <div style="display: none">
    <select
      class="map-control"
      ref="scaleSelect"
      @change="map.setScale($event.target.value)"
      id="menu-scale"
      v-cloak
    >
      <option v-if="map" :value="map.scale" selected>
        {{ scaleString }}
      </option>

      <option v-for="(s, index) in fixedScales" :key="index" :value="s">
        {{ map ? map.getScaleString(s) : s }}
      </option>
    </select>
  </div>
</template>

<script>
import { fixedScales } from '@/config/appData';

import { useMapStore } from '@/stores/map';

export default {
  data: function () {
    return {
      scalesInitialised: false,
    };
  },
  computed: {
    // scale string for the current map zoom level
    mapReady() {
      return useMapStore().ready;
    },
    map() {
      return useMapStore()?.component;
    },
    fixedScales() {
      return fixedScales;
    },
    scaleString() {
      if (!this.map) {
        return '';
      }
      return this.map.getScaleString(this.map.scale);
    },
  },
  watch: {
    mapReady: {
      immediate: true,
      handler(ready) {
        if (ready && !this.scalesInitialised) {
          this.scalesInitialised = true;
          this.initialiseScales();
        }
      },
    },
  },
  methods: {
    initialiseScales() {
      const vm = this;

      this.map.olmap.on('postrender', function () {
        vm.reset();
      });
    },
    reset() {
      if (this.$refs.scaleSelect) {
        this.$refs.scaleSelect.selectedIndex = 0;
      }
    },
  },
};
</script>
