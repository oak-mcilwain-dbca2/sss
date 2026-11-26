<template>
  <div style="display: none">
    <div
      id="toolbox_control"
      class="ol-selectable ol-control"
      :style="topPositionStyle"
    >
      <button
        type="button"
        id="toolbox_expand"
        style="margin-bottom: 1px"
        @click="showTools = !showTools"
        title="Toolbox"
      >
        <img :src="toolBox" width="36" height="36" />
      </button>
      <button
        type="button"
        id="toolbox_tool"
        title="{{toolTitle}}"
        v-show="showTool"
        @click="toggleTool()"
        :class="{ selected: isControlActivated, warning: isControlWarning }"
      >
        <img :src="tool.icon" width="48" height="48" />
      </button>
      <div
        v-show="showTools"
        style="position: absolute; width: 200px; right: 0px"
        id="toolbox_tools"
      >
        <button
          type="button"
          v-for="(t, index) in tools"
          title="{{t.title}}"
          id="{{t.toolid}}"
          style="margin-left: 2px; margin-bottom: 1px; float: right"
          :key="index"
          @click.stop.prevent="selectTool(t)"
          :class="{ selected: isToolSelected(t) }"
        >
          <img :src="t.icon" width="36" height="36" />
        </button>
      </div>
      <template v-for="(t, index) in tool.assistantButtons" :key="index">
        <button
          type="button"
          v-show="showAssistantButton(t)"
          style="margin-top: 1px"
          title="{{t.title}}"
          @click.stop.prevent="clickAssistantButton(t)"
        >
          <img :src="t.icon" />
        </button>
      </template>
    </div>
  </div>
</template>

<style>
#toolbox_control button {
  width: 48px;
  height: 48px;
  margin: 0;
}

#toolbox_control .selected {
  background-color: #2199e8;
}
#toolbox_control .warning {
  background-color: rgba(125, 47, 34, 0.7);
}
#toolbox_control {
  position: absolute;
  left: auto;
  right: 16px;
  bottom: auto;
  width: 48px;
  height: 48px;
  padding: 0;
}
</style>

<script>
import Control from 'ol/control/Control';

import env from '@/config/env';

import toolBoxSvg from '@/assets/images/toolbox.svg';
import nonToolSvg from '@/assets/images/non-tool.svg';

import { useLoadingStore } from '@/stores/loading';
import { useMapStore } from '@/stores/map';
import { useAnnotationsStore } from '@/stores/annotations';
import { useMeasureStore } from '@/stores/measure';
import { useWeatherForecastStore } from '@/stores/weatherForecast';
import { useWeatherOutlookStore } from '@/stores/weatherOutlook';
import { useFeatureDetailStore } from '@/stores/featureDetail';

export default {
  store: {},
  setup() {
    return {
      toolBoxSvg,
      nonToolSvg,
    };
  },
  data: function () {
    return {
      toolBox: toolBoxSvg,
      tool: {},
      tools: [],
      showTools: false,
      toolboxInitialised: false,
    };
  },
  // parts of the template to be computed live
  computed: {
    loading: function () {
      return useLoadingStore();
    },
    mapReady() {
      return useMapStore().ready;
    },
    map() {
      return useMapStore()?.component;
    },
    annotationsReady() {
      return useAnnotationsStore().ready;
    },
    annotations: function () {
      return useAnnotationsStore()?.component;
    },
    measureReady() {
      return useMeasureStore().ready;
    },
    measure() {
      return useMeasureStore()?.component;
    },
    weatherForecastReady() {
      return useWeatherForecastStore().ready;
    },
    weatherForecast() {
      return useWeatherForecastStore()?.component;
    },
    weatherOutlookReady() {
      return useWeatherOutlookStore().ready;
    },
    weatherOutlook() {
      return useWeatherOutlookStore()?.component;
    },
    featureDetailReady() {
      return useFeatureDetailStore()?.ready;
    },
    featureDetail() {
      return useFeatureDetailStore()?.component;
    },
    components: function () {
      if (env.weatherForecastUrl) {
        return [
          this.weatherOutlook,
          this.weatherForecast,
          this.featureDetail,
          this.measure,
        ];
      } else {
        return [this.weatherOutlook, this.featureDetail, this.measure];
      }
    },
    enabled: function () {
      return this.layers.length > 0;
    },
    topPosition: function () {
      return 180;
    },
    topPositionStyle: function () {
      return 'top:' + this.topPosition + 'px';
    },
    mapControl() {
      // TODO: Legacy code lazily cached the controller in a computed property.
      // Computed properties should not mutate state. Revisit once the
      // application is running.

      return new Control({
        element: $('#toolbox_control').get(0),
        target: $('#external-controls').get(0),
      });
    },
    isControlActivated: function () {
      return this.tool && this.tool._component && this.tool._component !== this
        ? this.tool._component.isToolActivated(this.tool)
        : false;
    },
    isControlWarning: function () {
      return this.tool &&
        this.tool._component &&
        this.tool._component !== this &&
        this.tool._component.isToolWarning
        ? this.tool._component.isToolWarning(this.tool)
        : false;
    },
    showTool: function () {
      return this.tool && this.tool._component !== this && !this.showTools;
    },
    toolTitle: function () {
      return this.tool.title;
    },
  },
  watch: {
    componentsReady: {
      immediate: true,
      handler(ready) {
        if (ready && !this._componentsInitialised) {
          this.initialiseToolbox();
        }
      },
    },
  },
  // methods callable from inside the template
  methods: {
    initialiseToolbox() {
      const vm = this;

      if (vm.toolboxInitialised) {
        return;
      }

      this._toolboxStatus = vm.loading.register('toolbox', 'Toolbox Component');

      this._toolboxStatus.phaseBegin(
        'gk-init',
        80,
        "Listen 'gk-init' event",
        true,
        true,
      );

      vm._toolboxStatus.phaseEnd('gk-init');

      vm._toolboxStatus.phaseBegin('initialize', 20, 'Initialize', true, false);

      let defaultTool = null;
      var nonTool = {
        toolid: 'deselect-tool',
        title: '',
        icon: nonToolSvg,
        _component: vm,
        assistantButtons: [],
      };
      vm.tools.push(nonTool);

      if (vm.tools.length) {
        vm.map.mapControls['toolbox'] = {
          enabled: false,
          autoenable: false,
          controls: vm.mapControl,
        };

        vm.selectTool(defaultTool, false);
      }
      vm._toolboxStatus.phaseEnd('initialize');

      var index = 1;
      $.each(vm.components, function (index1, component) {
        $.each(component.tools, function (index2, tool) {
          tool._component = component;
          tool.assistantButtons =
            tool.assistantButtons === null ||
            tool.assistantButtons === undefined
              ? []
              : tool.assistantButtons;
          vm.tools.splice(Math.floor(index / 4) * 4, 0, tool);
          if (defaultTool === null) {
            defaultTool = tool;
          }
          index += 1;
        });
      });
      this.toolboxInitialised = true;
    },
    inToolbox: function (component) {
      return (
        this.components.findIndex(function (o) {
          return o === component;
        }) >= 0
      );
    },
    selectTool: function (tool, enabled) {
      this.showTools = false;
      enabled = enabled === null || enabled === undefined ? true : enabled;
      if (!tool._component || tool._component === this) {
        //select a non tool
        if (this.isControlActivated) {
          //current selected tool is activated,deactivate it
          this.toggleTool();
        }
        this.tool = tool;
      } else {
        this.tool = tool;
        this.tool._component.selectTool(this.tool);
        if (enabled) {
          this.tool._component.toggleTool(true, this.tool);
        }
      }
    },
    toggleTool: function (enabled) {
      if (this.tool._component && this.tool._component !== this)
        this.tool._component.toggleTool(enabled, this.tool);
    },
    isToolSelected: function (t) {
      return this.tool === t;
    },
    showAssistantButton: function (button) {
      return this.showTools
        ? false
        : this.tool._component !== this &&
            this.tool._component.showAssistantButton &&
            this.tool._component.showAssistantButton(button);
    },
    clickAssistantButton: function (button) {
      if (this.tool._component && this.tool._component !== this)
        this.tool._component.clickAssistantButton(button);
    },
  },
};
</script>
