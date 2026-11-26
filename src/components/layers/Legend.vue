<template>
  <img :src="legendSvg" />
</template>
<script>
import legendSvg from '@/assets/images/legend.svg';

import { useExportStore } from '@/stores/export';

export default {
  // TODO: Currently not referenced by Export.vue template.
  // Retained during migration pending review of export subsystem.
  setup() {
    return {
      legendSvg,
    };
  },
  computed: {
    export() {
      return useExportStore().component;
    },
    legendInfo: {
      get: function () {
        return this.export?.legendInfo();
      },
    },
    title: function () {
      return this.export?.title;
    },
  },
};
</script>
