<template>
  <div class="tabs-panel is-active" id="menu-tab-layers">
    <div class="row collapse">
      <div class="columns">
        <ul class="tabs" data-tabs id="layers-tabs">
          <li class="tabs-title is-active" menu="active">
            <a href="#layers-active" aria-selected="true">Active</a>
          </li>
          <li class="tabs-title" menu="catalogue">
            <a href="#layers-catalogue">Browse Layers</a>
          </li>
          <li class="tabs-title" menu="export">
            <a href="#layers-export">Save & Print</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="row collapse" id="layers-tab-panels">
      <div class="columns">
        <div class="tabs-content vertical" data-tabs-content="layers-tabs">
          <gk-active ref="active"></gk-active>
          <gk-catalogue ref="catalogue"></gk-catalogue>
          <gk-export ref="export"></gk-export>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gkActive from '@/components/layers/Active.vue';
import gkCatalogue from '@/components/layers/Catalogue.vue';
import gkExport from '@/components/layers/Export.vue';

import { useAnnotationsStore } from '@/stores/annotations';
import { useStateStore } from '@/stores/state';
import { useInfoStore } from '@/stores/info';

export default {
  store: {
    activeMenu: 'activeMenu',
    activeSubmenu: 'activeSubmenu',
  },
  data: function () {
    return {
      menu: null,
      layersInitialised: false,
    };
  },
  components: { gkActive, gkCatalogue, gkExport },
  computed: {
    info: function () {
      return useInfoStore().component;
    },
    state() {
      return useStateStore();
    },
    activeMenu: {
      get() {
        return this.state.activeMenu;
      },
      set(value) {
        this.state.activeMenu = value;
      },
    },
    activeSubmenu: {
      get() {
        return this.state.activeSubmenu;
      },
      set(value) {
        this.state.activeSubmenu = value;
      },
    },
    annotationsReady() {
      return useAnnotationsStore().ready;
    },
    annotations() {
      return useAnnotationsStore().component;
    },
  },
  watch: {
    annotationsReady: {
      immediate: true,
      handler(ready) {
        if (ready) {
          this.initialiseLayers();
        }
      },
    },
  },
  methods: {
    initialiseLayers: function () {
      if (this.layersInitialised) {
        return;
      }

      this.layersInitialised = true;

      this.annotations.setTool();
      this.switchMenu(this.menu);
    },
    getSubmenuComponent(menu) {
      return this.$refs[menu];
    },
    teardown: function () {
      if (this.activeSubmenu) {
        const component = this.getSubmenuComponent(this.activeSubmenu);

        if (component?.teardown) {
          component.teardown();
        }
      }
    },
    switchMenu(menu) {
      menu = menu || 'active';

      if (this.activeSubmenu === menu || (!this.activeSubmenu && !menu)) {
        return;
      }

      if (this.activeSubmenu) {
        const previousComponent = this.getSubmenuComponent(this.activeSubmenu);
        previousComponent?.teardown?.();
      }

      this.activeSubmenu = menu;

      const component = this.getSubmenuComponent(this.activeSubmenu);
      component?.setup?.();
      this.menu = menu;
    },
  },
  mounted() {
    var vm = this;
    $('#layers-tabs').on('change.zf.tabs', function (target, selectedTab) {
      var menu = selectedTab.attr('menu');
      vm.info.hoverable.splice(0, vm.info.hoverable.length);
      vm.switchMenu(menu);
      // TODO replace legacy menuChanged/layout update
      //   vm.$root.menuChanged();
    });
  },
};
</script>
