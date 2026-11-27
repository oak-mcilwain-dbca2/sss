<template>
  <form
    id="get_weatherforecast"
    name="weatherforecast"
    action="/weatherforecast"
    method="post"
    target="weatherforecast"
  >
    <input type="hidden" name="data" id="weatherforecast_data" />
  </form>
</template>

<script>
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

import Draw from 'ol/interaction/Draw';

import Point from 'ol/geom/Point';

import { submitForm } from '@/utils';

import env from '@/config/env';

import weatherForecastSvg from '@/assets/images/weather-forecast.svg';
import pinSvg from '@/assets/images/pin.svg';

import { useLoadingStore } from '@/stores/loading';
import { useMapStore } from '@/stores/map';
import { useAnnotationsStore } from '@/stores/annotations';

export default {
  store: {
    whoami: 'whoami',
  },
  setup() {
    return {
      weatherForecastSvg,
      pinSvg,
    };
  },
  data: function () {
    return {
      forecastTool: {},
      forecastTools: [
        {
          toolid: 'incident-weather-forecast',
          title: 'Incident Weather Forecast',
          icon: weatherForecastSvg,
        },
      ],
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
    isControlSelected: function () {
      if (this.annotations) {
        return this.annotations.tool === this._weatherforecastTool;
      } else {
        return false;
      }
    },
    tools() {
      return this.whoami.is_internal_dbca ? this.forecastTools : [];
    },
  },
  watch: {
    annotationsReady: {
      immediate: true,
      handler(ready) {
        if (ready) {
          this.initialiseWeatherForecast();
        }
      },
    },
    isControlSelected: function (newValue) {
      if (newValue) {
        this._overlay.setMap(this.map.olmap);
      } else {
        this._overlay.setMap(null);
      }
    },
  },
  // methods callable from inside the template
  methods: {
    initialiseWeatherForecast() {
      const vm = this;
      vm._weatherforecastStatus.phaseEnd('gk-init');

      vm._weatherforecastStatus.phaseBegin(
        'initialize',
        20,
        'Initialize',
        true,
        false,
      );

      vm._features = new Collection();
      vm._features.on('add', function (event) {
        vm.getWeatherForecast(event.element.getGeometry().getCoordinates());
      });
      vm._style = new Style({
        image: new Icon({
          src: pinSvg,
          anchorOrigin: 'bottom-left',
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          anchor: [8, 0],
        }),
      });
      vm._source = new VectorSource({
        features: vm._features,
      });
      vm._overlay = new VectorLayer({
        source: vm._source,
        style: vm._style,
      });

      //initialize the overlay and interactions
      var weatherforecastInter = new Draw({
        source: vm._source,
        type: 'Point',
        style: vm._style,
      });

      weatherforecastInter.on(
        'drawend',
        function () {
          vm._features.clear();
        },
        vm,
      );

      vm._weatherforecastTool = {
        name: 'WeatherForecast',
        keepSelection: true,
        interactions: [weatherforecastInter],
      };

      vm.annotations.tools.push(this._weatherforecastTool);

      vm._weatherforecastStatus.phaseEnd('initialize');
    },
    toggleTool: function (enable) {
      this.warning = false;
      if (!this._weatherforecastTool) {
        this.annotations.setTool(this.annotations.currentTool, true);
      } else if (
        enable === true &&
        this.annotations.tool === this._weatherforecastTool
      ) {
        //already enabled
        return;
      } else if (
        enable === false &&
        this.annotations.tool !== this._weatherforecastTool
      ) {
        //already disabled
        return;
      } else if (this.annotations.tool === this._weatherforecastTool) {
        this.annotations.setTool(this.annotations.currentTool, true);
      } else {
        this.annotations.setTool(this._weatherforecastTool);
      }
    },
    selectTool: function (tool) {
      if (this.forecastTool === tool) {
        return;
      }
      this.forecastTool = tool;
    },
    isToolActivated: function () {
      return this.isControlSelected;
    },
    setPosition: function (coordinate) {
      this._features.clear();
      this._features.push(new Feature({ geometry: new Point(coordinate) }));
    },
    getWeatherForecast: function (coordinate) {
      var vm = this;
      vm._getWeatherForecast =
        vm._getWeatherForecast ||
        function (coordinate, position) {
          var requestData = {
            point: coordinate,
            position: position,
            forecast_url: env.weatherForecastUrl,
          };
          $('#weatherforecast_data').val(JSON.stringify(requestData));
          submitForm(
            'get_weatherforecast',
            {
              width: screen.width > 1890 ? 1890 : screen.width,
              height: screen.height > 1060 ? 1060 : screen.height,
            },
            true,
          );
        };

      this.map.getPosition(coordinate, function (position) {
        vm._getWeatherForecast.call(this, coordinate, position);
      });
    },
  },
  mounted() {
    var vm = this;
    this._weatherforecastStatus = vm.loading.register(
      'weatherforecast',
      'Weather Forecast Component',
    );

    this._weatherforecastStatus.phaseBegin(
      'gk-init',
      80,
      "Listen 'gk-init' event",
      true,
      true,
    );
  },
};
</script>

<style></style>
