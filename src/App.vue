<template>
  <gk-loading ref="loading" application="SSS" />
  <div class="off-canvas-wrapper">
    <div class="off-canvas-wrapper-inner" data-off-canvas-wrapper>
      <div id="offCanvasLeft" class="off-canvas position-left" data-off-canvas>
        <a id="side-pane-close" class="button alert hide-for-medium"
          >&#x2715;</a
        >
        <div class="tabs-content vertical" data-tabs-content="menu-tabs">
          <gk-settings ref="settings" />
          <gk-layers ref="layers" />
          <gk-annotations ref="annotations" />
          <gk-tracking ref="tracking" />
          <gk-thermal ref="thermal" />
          <gk-bfrs ref="bfrs" />
          <gk-dialog ref="dialog" />
        </div>
        <div
          v-if="$root.hasHints"
          class="tool-slice row collapse"
          style="width: 100%; margin-top: -32px"
        >
          <div v-if="$root.isShowHints" id="hints">
            <hr class="small-12" style="margin-bottom: 0; margin-top: 0" />
            <template v-for="(hint, index) in hints" :key="index">
              <div class="small-12">{{ hint.name }}:</div>
              <div class="small-12">
                <ul style="margin-bottom: 0px">
                  <template
                    v-for="(description, innerIndex) in hint.description"
                    :key="innerIndex"
                  >
                    <li>{{ description }}</li>
                  </template>
                </ul>
              </div>
            </template>
          </div>
          <div class="small-12" style="text-align: right">
            <img
              :src="questionMarkPng"
              style="height: 32px; width: 32px"
              @click="systemsetting.toggleShowHints()"
            />
          </div>
        </div>
      </div>
      <div class="off-canvas-content" data-off-canvas-content>
        <ul id="menu-tabs" class="tabs vertical map-widget" data-tabs>
          <li class="tabs-title side-button is-active" menu="layers">
            <a href="#menu-tab-layers" title="Map Layers">
              <svg class="icon">
                <use :href="`${spriteUrlSvg}#icon-layers`" />
              </svg>
            </a>
          </li>
          <li class="tabs-title side-button" menu="annotations">
            <a href="#menu-tab-annotations" title="Drawing Tools">
              <i class="fa fa-pencil" aria-hidden="true"></i>
            </a>
          </li>
          <li class="tabs-title side-button" menu="tracking">
            <a href="#menu-tab-tracking" title="Resources Tracking">
              <i class="fa fa-truck" aria-hidden="true"></i>
            </a>
          </li>
          <li class="tabs-title side-button" menu="thermal">
            <a href="#menu-tab-thermal" title="Thermal Imaging">
              <i class="fa fa-plane" aria-hidden="true"></i>
            </a>
          </li>
          <li class="tabs-title side-button" menu="bfrs">
            <a href="#menu-tab-bfrs" title="Bushfire Report System">
              <i class="fa fa-fire" aria-hidden="true"></i>
            </a>
          </li>
          <li class="tabs-title side-button" menu="settings">
            <a href="#menu-tab-settings" title="System Settings">
              <i class="fa fa-cog" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
        <gk-map ref="map" />
      </div>
    </div>
  </div>
  <div id="external-controls"></div>
</template>

<script>
import gkMap from "@/components/map/Map.vue";
import gkLayers from "@/components/layers/Layers.vue";
import gkAnnotations from "@/components/annotations/Annotations.vue";
import gkTracking from "@/components/sss/Tracking.vue";
import gkThermal from "@/components/sss/Thermal.vue";
import gkLoading from "@/components/loading/Loading.vue";
import gkSettings from "@/components/settings/Settings.vue";
import gkBfrs from "@/components/sss/BFRS.vue";
import gkDialog from "@/components/dialog/Dialog.vue";

import questionMarkPng from "@/assets/images/question-mark.png";
import spriteUrlSvg from "@/assets/images/iD-sprite.svg";

import { useStateStore } from "@/stores/state";

export default {
  store: {
    activeMenu: "activeMenu",
    activeSubmenu: "activeSubmenu",
    hints: "hints",
  },
  components: {
    gkMap,
    gkLayers,
    gkAnnotations,
    gkTracking,
    gkThermal,
    gkLoading,
    gkSettings,
    gkBfrs,
    gkDialog,
  },
  setup() {
    return { questionMarkPng, spriteUrlSvg };
  },
  computed: {
    layers: function () {
      return this.$root.layers;
    },
    info: function () {
      return this.$root.info;
    },
    systemsetting: function () {
      return this.$root.systemsetting;
    },
    settings: function () {
      return this.$root.settings;
    },
    hints() {
      return useStateStore().hints;
    },
    showHints() {
      return useStateStore().showHints;
    },
    hasHints() {
      return this.hints && this.hints.length > 0;
    },
  },
  methods: {
    switchMenu: function (menu) {
      if (this.activeMenu === menu || (!this.activeMenu && !menu)) {
        //new active menu is equal to current active menu, do nothing
        return;
      }
      if (this.activeMenu && this.$root[this.activeMenu].teardown) {
        this.$root[this.activeMenu].teardown();
      }
      this.activeMenu = menu || null;
      this.activeSubmenu = null;

      if (this.activeMenu && this.$root[this.activeMenu].setup) {
        this.$root[this.activeMenu].setup();
      }
      if (["layers", "settings"].indexOf(menu) < 0) {
        this.activeSubmenu = null;
      }
      this.$root.menuChanged();
    },
  },
  mounted() {
    var vm = this;
    $("#menu-tabs").on("change.zf.tabs", function (target, selectedTab) {
      var menu = selectedTab.attr("menu");
      vm.info.hoverable.splice(0, vm.info.hoverable.length);
      vm.switchMenu(menu);
    });
  },
};
</script>
