<template>
  <div istyle="display:none">
    <input
      id="map-search"
      class="map-control"
      title="Search the map for any of the following. &#10;&#10;Places/Addresses, e.g.:&#10;- 17 Dick Perry Avenue, Kensington&#10;- Upper Swan, Western Australia&#10;&#10;Coordinates, e.g.:&#10;- 32.00858S 115.53978E&#10;- 115d 38m 58.0s E, 33d 20m 52.8s S&#10;- 115:38:58.0 E, 33:20:52.8 S&#10;- 115° 38′ 58.0″ E, 33° 20′ 52.8″ S&#10;&#10;Map Grid of Australia UTM coordinates, e.g.:&#10;- MGA 50 718776E 6190981N&#10;- MGA50 3816452&#10;&#10;Forestry Department/Pilbara grid references, e.g.:&#10;- FD ET 79&#10;- PIL AF50"
      placeholder="Search (places, °, MGA, FD)"
      @keyup="searchKeyFix($event)"
    />
    <button id="map-search-button" class="map-control" @click="runSearch">
      <i class="fa fa-search"></i>
    </button>
  </div>
</template>

<style>
#map-search.alert,
#map-search-button.alert {
  background-color: rgba(125, 47, 34, 0.7);
}

#map-search:hover.alert,
#map-search-button:hover.alert {
  background-color: rgba(125, 47, 34, 0.9);
}

#map-search.success,
#map-search-button.success {
  background-color: rgba(53, 94, 26, 0.7);
}

#map-search:hover.success,
#map-search-button:hover.success {
  background-color: rgba(53, 94, 26, 0.9);
}
</style>

<script>
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';

import Point from 'ol/geom/Point';

import Control from 'ol/control/Control';

import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

import { containsCoordinate } from 'ol/extent';

import { getLayerUrl } from '@/utils';

import { useMapStore } from '@/stores/map';
import { useAnnotationsStore } from '@/stores/annotations';
import { useWeatherOutlookStore } from '@/stores/weatherOutlook';
import { useWeatherForecastStore } from '@/stores/weatherForecast';

export default {
  store: ['resolutions'],
  data: function () {
    return {};
  },
  computed: {
    mapReady() {
      return useMapStore().ready;
    },
    map: function () {
      return useMapStore()?.component;
    },
    annotations: function () {
      return useAnnotationsStore().component;
    },
    weatherOutlook() {
      return useWeatherOutlookStore().component;
    },
    weatherForecast() {
      return useWeatherForecastStore().component;
    },
  },
  watch: {
    mapReady: {
      immediate: true,
      handler(ready) {
        if (ready && !this._trackingInitialized) {
          this.initialiseSearch();
        }
      },
    },
  },
  methods: {
    initialiseSearch() {
      this.map.mapControls.search = {
        enabled: false,
        controls: [
          new Control({
            element: $('#map-search').get(0),
            target: $('#external-controls').get(0),
          }),
          new Control({
            element: $('#map-search-button').get(0),
            target: $('#external-controls').get(0),
          }),
        ],
      };

      this.overlay.setMap(this.map.olmap);
    },
    searchKeyFix: function (ev) {
      // run a search after pressing enter
      if (ev.keyCode == 13) {
        this.runSearch();
      }
    },
    clearSearchPoint: function () {
      this.features.clear();
    },
    setSearchPointFunc: function (func) {
      this._setSearchPointFunc = func;
    },
    runSearch: function () {
      var vm = this;
      var map = this.map;
      $('#map-search, #map-search-button').removeClass('alert success');
      var query = $('#map-search').get(0).value;
      if (!query) {
        this.clearSearchPoint();
        return;
      }

      var victory = function (searchMethod, coords, name, update_name) {
        $('#map-search, #map-search-button').addClass('success');
        // map.animate({center:coords},{resolution:vm.resolutions[10]})
        if (Array.isArray(coords) && Array.isArray(coords[0])) {
          coords = coords[0];
        }
        map.animate(coords);
        if (update_name) {
          $('#map-search').val(update_name);
        }
        if (
          vm.weatherOutlook &&
          vm.annotations.tool &&
          vm.annotations.toname === 'WeatherOutlook'
        ) {
          //weather outlook tool is activated.
          vm.weatherOutlook.setPosition(coords);
        } else if (
          vm.weatherForecast &&
          vm.annotations.tool &&
          vm.annotations.toname === 'WeatherForecast'
        ) {
          //weather forecast tool is activated.
          vm.weatherForecast.setPosition(coords);
        } else if (
          !vm._setSearchPointFunc ||
          !vm._setSearchPointFunc(searchMethod, coords, name)
        ) {
          vm.features.clear();
          vm.features.push(
            new Feature({
              geometry: new Point(coords),
              name: name,
            }),
          );
        }
        //console.log([name, coords[0], coords[1]])
      };

      var failure = function () {
        $('#map-search, #map-search-button').addClass('alert');
        //console.log(reason)
      };

      // check for EPSG:4326 coordinates
      var dms = map.parseDMSString(query);
      if (dms) {
        victory('DMS', dms, name);
        return;
      }

      // check for MGA coordinates
      var mga = map.parseMGAString(query);
      if (mga) {
        victory('MGA', mga.coords, map.getMGA(mga.coords));
        return;
      }

      // check for Grid Reference
      var gd = map.parseGridString(query);
      if (gd) {
        if (gd.gridType === 'FD') {
          this.queryFD(gd.gridNorth + ' ' + gd.gridEast, victory, failure);
        } else {
          this.queryPIL(gd.gridNorth + gd.gridEast, victory, failure);
        }
        return;
      }

      // failing all that, ask mapbox
      this.queryGeocode(query, victory, failure);
    },
    queryFD: function (fdStr, victory, failure) {
      var vm = this;
      var layerId = vm.env.fdGridPointsMappingLayer;
      $.ajax({
        url:
          getLayerUrl(layerId, vm.env) +
          '/wfs?' +
          $.param({
            version: '1.1.0',
            service: 'WFS',
            request: 'GetFeature',
            outputFormat: 'application/json',
            srsname: 'EPSG:4326',
            typename: layerId,
            cql_filter: "(FDGRID = '" + fdStr + "')",
          }),
        dataType: 'json',
        xhrFields: {
          withCredentials: true,
        },
        success: function (data) {
          if (data.features.length) {
            victory('FD', data.features[0].geometry.coordinates, 'FD ' + fdStr);
          } else {
            failure('No Forest Department Grid reference found for ' + fdStr);
          }
        },
      });
    },
    queryPIL: function (pilStr, victory, failure) {
      var vm = this;
      var layerId = vm.env.pilbaraGrid10kmMappingLayer;
      $.ajax({
        url:
          getLayerUrl(layerId, vm.env) +
          '/wfs?' +
          $.param({
            version: '1.1.0',
            service: 'WFS',
            request: 'GetFeature',
            outputFormat: 'application/json',
            srsname: 'EPSG:4326',
            typename: layerId,
            cql_filter: "(grid = '" + pilStr + "')",
          }),
        dataType: 'json',
        xhrFields: {
          withCredentials: true,
        },
        success: function (data) {
          if (data.features.length) {
            victory(
              'PIL',
              data.features[0].geometry.coordinates,
              'PIL ' + pilStr,
            );
          } else {
            failure('No Pilbara Grid reference found for ' + pilStr);
          }
        },
      });
    },
    queryGeocode: function (geoStr, victory, failure) {
      var vm = this;
      var center = this.map.getCenter();
      if (!containsCoordinate(this._wa_bbox, center)) {
        center = this._wa_perth;
      }
      $.ajax({
        url:
          '/api/mapbox.json?' +
          $.param({
            geo_str: encodeURIComponent(geoStr),
            country: 'au',
            //types: 'country,region,postcode,place,locality,address',
            proximity: '' + center[0] + ',' + center[1],
          }),
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          if (data.features.length) {
            var feature = null;
            //get the first place in wa bbox or get the first feature
            $.each(data.features, function (index, f) {
              if (containsCoordinate(vm._wa_bbox, f.center)) {
                feature = f;
                return false;
              } else if (!feature) {
                feature = f;
              }
            });

            victory(
              'GEOCODE',
              feature.center,
              feature.text,
              feature.place_name,
            );
          } else {
            failure('No location match found for ' + geoStr);
          }
        },
      });
    },
  },
  mounted() {
    this._wa_bbox = [112.5, -36.0, 129.0, -13.0];
    this._wa_perth = [115.8605, -31.9527];

    this.style = function (feature) {
      return new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({
            color: 'rgb(255, 255, 255)',
          }),
          stroke: new Stroke({
            width: 2,
            color: 'rgb(114, 193, 0)',
          }),
        }),
        text: new Text({
          offsetX: 12,
          text: feature.get('name'),
          textAlign: 'left',
          font: '12px Helvetica,Roboto,Arial,sans-serif',
          stroke: new Stroke({
            color: '#fff',
            width: 4,
          }),
        }),
      });
    };

    this.features = new Collection();
    this.source = new VectorSource({
      features: this.features,
    });
    this.overlay = new VectorLayer({
      source: this.source,
      style: this.style,
    });
  },
};
</script>
