<template>
  <div style="display: none">
    <select
      class="map-control"
      ref="scaleSelect"
      @change="$root.map.setScale($event.target.value)"
      id="menu-scale"
      v-cloak
    >
      <!-- TODO: Does this work as intended?-->
      <option :value="$root.map.scale" selected>{{ scaleString }}</option>
      <option v-for="(s, index) in fixedScales" :value="s" :key="index">
        {{ $root.map.getScaleString(s) }}
      </option>
    </select>
  </div>
</template>

<script>
import { fixedScales } from "@/config/appData";

export default {
  data: function () {
    return {};
  },
  computed: {
    // scale string for the current map zoom level
    fixedScales() {
      return fixedScales;
    },

    scaleString() {
      return this.$root.map.getScaleString(this.$root.map.scale);
    },
  },
  methods: {
    reset() {
      if (this.$refs.scaleSelect) {
        this.$refs.scaleSelect.selectedIndex = 0;
      }
    },
  },
  mounted() {
    const vm = this;
    // TODO: Vue 1 used $broadcast("gk-init") / $on("gk-init").
    // Vue 3 removed the event bus APIs.
    // Replace with an application startup/event strategy once
    // sss.js has been migrated.
    this.$on("gk-init", function () {
      this.$root.map.olmap.on("postrender", function () {
        vm.reset();
      });
    });
  },
};
</script>
