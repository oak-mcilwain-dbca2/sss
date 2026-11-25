<template>
  <div class="tabs-panel" id="menu-tab-thermal">
    <div class="row collapse">
      <div class="columns">
        <ul class="tabs" id="thermal-tabs">
          <li class="tabs-title is-active">
            <a class="label" aria-selected="true">Thermal Imaging</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="row collapse" id="thermal-tab-panels">
      <div class="columns">
        <div class="tabs-content vertical" data-tabs-content="thermal-tabs">
          <div id="thermal-list-tab" class="tabs-panel is-active" v-cloak>
            <div id="thermal-list-controller-container">
              <div class="tool-slice row collapse">
                <a
                  v-for="(t, index) in tools"
                  class="button button-tool"
                  :class="{ selected: t.name == annotations.tool.name }"
                  @click="annotations.setTool(t)"
                  :title="t.label"
                  style="font-size: 0.9rem"
                  :key="index"
                  >{{ annotations.icon(t) }} {{ t.showName ? t.label : "" }}</a
                >
              </div>
            </div>
          </div>
          <div class="row">
            <div class="small-9 columns">
              <div class="row">
                <div class="switch tiny">
                  <input
                    class="switch-input"
                    id="thermalInViewport"
                    type="checkbox"
                    :checked="viewportOnly"
                    @change="toggleViewportOnly"
                  />
                  <label class="switch-paddle" for="thermalInViewport">
                    <span class="show-for-sr"
                      >Viewport thermal imagery only</span
                    >
                  </label>
                </div>
                <label for="thermalInViewport" class="side-label"
                  >Restrict to viewport ({{ extentFeaturesSize }}/{{
                    featurelistSize
                  }})</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <div class="small-9 columns">
              <div class="row">
                <div class="switch tiny">
                  <input
                    class="switch-input"
                    id="showFlightFootprint"
                    type="checkbox"
                    :checked="showFlightFootprint"
                    @change="toggleFlightFootprint"
                  />
                  <label class="switch-paddle" for="showFlightFootprint">
                    <span class="show-for-sr">Show Flight Footprint</span>
                  </label>
                </div>
                <label for="showFlightFootprint" class="side-label"
                  >Show flight footprint</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <div class="small-9 columns">
              <div class="row">
                <div class="switch tiny">
                  <input
                    class="switch-input"
                    id="mosaicRawImage"
                    type="checkbox"
                    :checked="showRawImageMosaic"
                    @change="toggleRawImageMosaic"
                  />
                  <label class="switch-paddle" for="mosaicRawImage">
                    <span class="show-for-sr">Mosaic raw image</span>
                  </label>
                </div>
                <label for="mosaicRawImage" class="side-label"
                  >Show mosaic image</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <div class="small-9 columns">
              <div class="row">
                <div class="switch tiny">
                  <input
                    class="switch-input"
                    id="dateRange"
                    type="checkbox"
                    v-model="showDateRange"
                    @change="toggleDateRange"
                  />
                  <label class="switch-paddle" for="dateRange">
                    <span class="show-for-sr">Date range</span>
                  </label>
                </div>
                <label v-if="showDateRange" for="dateRange" class="side-label"
                  >Date range (up to 72 hr)</label
                >
                <label v-else for="dateRange" class="side-label"
                  >Date range (off)</label
                >
              </div>
            </div>
          </div>
          <div v-if="!showDateRange" class="row">
            <div class="small-9 columns">
              <div class="row">
                <label
                  >Date:
                  <input
                    type="date"
                    class="date"
                    id="singleDate"
                    v-model="thermalSingleDate"
                  />
                </label>
              </div>
            </div>
          </div>
          <div id="date-range-panel" v-show="showDateRange">
            <div class="row collapse tool-slice">
              <div class="small-2">
                <label for="dateRangeFrom">From:</label>
              </div>
              <div class="small-5">
                <DateTimeInput
                  id="thermalFromDate"
                  class="span2"
                  :max="thermalMaxDate"
                  v-model="thermalFromDate"
                  placeholder="YYYY-MM-DD HH:mm"
                  :disabled="thermalDateRange !== '-1'"
                  readonly
                />
                <input
                  type="text"
                  id="thermalToDate"
                  class="span2"
                  :min="thermalMinDate"
                  v-model="thermalToDate"
                  placeholder="YYYY-MM-DD HH:mm"
                  :disabled="thermalDateRange !== '-1'"
                  readonly
                />
                <!--input type="text" id="thermalFromDate" class="span2" v-model="thermalFromDate" placeholder="YYYY-MM-DD HH:mm"  v-bind:disabled="thermalDateRange !== '-1'"  readonly></input-->
              </div>
              <div class="small-5">
                <select name="select" v-model="thermalDateRange">
                  <!--option value="21001">Last hour</option-->
                  <option value="21004">Last 4 hours</option>
                  <option value="21008">Last 8 hours</option>
                  <option value="21024">Last 24 hours</option>
                  <option value="31002">Last 48 hours</option>
                  <option value="31003">Last 3 days</option>
                  <!--option value="31005">Last 5 days</option> 
                      <option value="31007">Last 7 days</option> 
                      <option value="31030">Last 30 days</option-->
                  <option value="-1">User Defined</option>
                </select>
              </div>
            </div>
            <div class="row collapse tool-slice">
              <div class="small-2">
                <label for="dateRangeTo">To:</label>
              </div>
              <div class="small-5">
                <input
                  type="text"
                  id="thermalToDate"
                  class="span2"
                  v-model="thermalToDate"
                  placeholder="YYYY-MM-DD HH:mm"
                  :disabled="thermalDateRange !== '-1'"
                  readonly
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="small-9 columns">
              <div class="row"></div>
            </div>
          </div>
          <div class="row"></div>
          <div class="row">
            <div class="small-9 columns">
              <div class="row">
                <a
                  class="button"
                  :disabled="invalidDateFilter"
                  @click="loadHotspotLayers"
                  title="Show Hotspots"
                  button
                  style="margin: 5px"
                  >Show Hotspots
                </a>
                <a
                  class="button"
                  :disabled="invalidDateFilter"
                  @click="clearHotspotLayers"
                  title="Clear Hotspots"
                  button
                  style="margin: 5px"
                  >Clear Hotspots
                </a>
                <!--a class="button" :disabled="invalidDateFilter"@click="removeHotspotMosaic" title="Clear Mosaic" button style="margin:5px;">Clear Mosaic </a-->
              </div>
            </div>
          </div>
          <!--div class="row">
              <div class="small-9 columns" >
                <div class="row">
                    <a class="button" @click="showEmailComposerPanel" title="Show Email Composer"><i class="fa fa-envelope" aria-hidden="true" v-model="mdlShowEmailComposer"></i> Email </a>
                </div>
              </div>
		    </div>
			<div v-show="showEmailComposer" id="emailPanel" >
				<form id="emailForm">
				<p>Email to
				<select id="emailRecipient">
				</select>
				
   				</p>
				<div>
				<textarea id="emailText" placeholder="Type message here" style="width:360px; height:190px; color:#000; opacity:1"></textarea>
				<p></p>
				</div>
				<div v-show="showEmailComposer">
				<input v-on:click="sendEmail" type="button" id="sendEmail" style="background-color:#39e" value="Send">
				<input v-on:click="showEmailComposer = !showEmailComposer" type="reset" id="cancelEmail" style="background-color:#39e" value="Cancel">
				</div>
				</form>
			</div-->
        </div>

        <div
          id="hotspot-list"
          class="layers-flexibleframe scroller"
          style="margin-left: -15px; margin-right: -15px"
        >
          <!--template v-for="f in featurelist" track-by="get('hotspot_no')"-->
          <template v-for="(f, index) in featurelist" :key="index">
            <div
              v-show="revision && (!viewportOnly || f.inViewport)"
              class="row feature-row"
              :class="{ 'feature-selected': isFeatureSelected(f) }"
              @click="toggleSelect(f)"
            >
              <button class="collapsible" @click="toggleImageList($event, f)">
                {{ f.get("flight_datetime") }} {{ f.get("hotspot_no") }}
              </button>

              <div class="showImages">
                <template
                  v-for="(imageFile, innerIndex) in f.shortImages"
                  :key="innerIndex"
                >
                  <!-- TODO: Resolve duplicate @click attribute 
				  <button :id="'img_' + imageFile" :class=["button"] @click="changeButtons" @click="showImage(f.get('flight_datetime'), f.get('hotspot_no'), imageFile, $index, $parent.$index)">
					<i class="fa fa-camera"></i>        image {{imageFile}}</button>
				 -->
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash-es";

import Collection from "ol/Collection";

import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";

import { extend } from "ol/extent";

import { containsCoordinate } from "ol/extent";

import { getDateRange } from "@/utils";

import DateTimeInput from "@/components/forms/DateTimeInput.vue";

import { useActiveStore } from "@/stores/active";
import { useAnnotationsStore } from "@/stores/annotations";
import { useLoadingStore } from "@/stores/loading";
import { useStateStore } from "@/stores/state";
import { useMapStore } from "@/stores/map";
import { useSettingsStore } from "@/stores/settings";

export default {
  store: {
    hotspotLabels: true, //boolean defining whether to show labels (can be later changed to use settings.
    hintsHeight: "layout.hintsHeight",
    screenHeight: "layout.screenHeight",
    leftPanelHeadHeight: "layout.leftPanelHeadHeight",
    activeMenu: "activeMenu",
    whoami: "whoami",
  },
  components: {
    DateTimeInput,
  },
  data: function () {
    return {
      clicked: false,
      showFlightFootprint: false,
      showRawImageMosaic: false,
      showDateRange: false,
      showEmailComposer: false,
      flights: [],
      //clippedOnly: false,
      search: "",
      groupFilter: "",
      tools: [],
      thermalDateRange: "21024",
      features: new Collection(),
      extentFeaturesSize: 0,
      footprints: new Collection(),
      imagesShow: {},
      emailList: [],
      featureLabelDisabled: false,
      clippedFeatures: [],
      thermalFromDate: "",
      thermalToDate: "",
      //dateRange: '',
      revision: 1,
      selectRevision: 1,
      extent: null,
      isHotspotImageON: false,
      showHotspotImages: false,
      thermalSingleDate: null,
      _featurelist: null,
    };
  },

  computed: {
    mapReady() {
      return useMapStore().ready;
    },
    map() {
      return useMapStore()?.component;
    },
    env: function () {
      return this.$root.env;
    },
    activeReady() {
      return useActiveStore().ready;
    },
    active: function () {
      return useActiveStore()?.component;
    },
    annotationsReady() {
      return useAnnotationsStore().ready;
    },
    annotations: function () {
      return this.annotationsReady ? useAnnotationsStore().component : null;
    },
    info: function () {
      return this.$root.info;
    },
    systemsetting: function () {
      return this.$root.systemsetting;
    },
    setting() {
      return useSettingsStore();
    },
    viewportOnly() {
      return this.setting?.viewportOnly;
    },
    catalogue: function () {
      return this.$root.catalogue;
    },
    export: function () {
      return this.$root.export;
    },
    loading: function () {
      return useLoadingStore();
    },
    selectedFeatures: function () {
      return this.annotations.getSelectedFeatures("thermal");
    },

    selectedFeaturesSize: function () {
      return this.selectRevision && this.selectedFeatures.getLength();
    },

    /*queryThermalDateRangeDisabled: function() {
        return !(this.selectRevision && this.selectedFeatures && this.selectedFeatures.getLength() && this.thermalFromDate !== "")
      },*/
    hotspotLayer: function () {
      return this.$root.catalogue.getLayer("hotspots:hotspot_centroids");
    },
    hotspotMapLayer: function () {
      return this.$root.map
        ? this.$root.map.getMapLayer(this.hotspotLayer)
        : undefined;
    },
    //based on the much more complex bfrsStyleFunc, may be overcomplex
    hotspotStyleFunc: function () {
      // TODO: Legacy code cached the generated style function on
      // this._hotspotStyleFunc. Computed properties should not mutate
      // component state. Verify whether caching is still required once
      // the application is runnable.

      return function () {
        const labelStyleFunc = function () {
          return new Style({
            text: new Text({
              text: "o",
              font: "24px Calibri,sans-serif",
              fill: new Fill({ color: "#fff" }),
              stroke: new Stroke({
                color: "#fff",
                width: 2,
              }),
            }),
            image: new Circle({
              fill: new Fill({
                color: [0, 0, 255],
              }),
              radius: 12,
            }),
          });
        };

        return function (res) {
          const feat = this;
          return labelStyleFunc.call(feat, res);
        };
      }.call(this);
    },

    flightFootprintLayer: function () {
      return this.$root.catalogue.getLayer(
        "hotspots:hotspot_flight_footprints",
      );
    },

    flightFootprintMapLayer: function () {
      return this.$root.map
        ? this.$root.map.getMapLayer(this.flightFootprintLayer)
        : undefined;
    },

    footprintStyle: function () {
      return new Style({
        stroke: new Stroke({
          width: 5,
          color: [0, 0, 255],
        }),
      });
    },

    // TODO: Make sure not needed any more
    // postmark_client: function () {
    //   var postmark = require("postmark");

    //   var client = new postmark.Client("c5abeaf7-cf27-4539-8f8a-790786320f30");
    //   //var client = new postmark.ServerClient("c5abeaf7-cf27-4539-8f8a-790786320f30")
    //   return client;
    // },

    featurelist: function () {
      try {
        //return this.revision && this._featurelist.getArray().sort(function(a, b){return a.get('hotspot_no') - b.get('hotspot_no')})
        if (this.showHotspotImages) {
          return this.revision && this._featurelist.getArray();
        }
        return this.revision && this._featurelist.getArray().slice().reverse();
      } catch {
        return [];
      }
    },

    featurelistSize: function () {
      try {
        return this.revision && this._featurelist.getLength();
      } catch {
        return 0;
      }
    },
    hasFeatureFilter: function () {
      //prob replace with a hasDateFilter function based on whether a date or date range is specified
      return this.search && this.search.trim() ? true : false;
    },
    thermalMinDate() {
      if (!this.thermalFromDate) {
        return moment().subtract(10, "years").format("YYYY-MM-DDTHH:mm");
      }

      return moment(this.thermalFromDate).format("YYYY-MM-DDTHH:mm");
    },
    thermalMaxDate() {
      if (!this.thermalToDate) {
        return moment().format("YYYY-MM-DDT23:59");
      }

      return moment(this.thermalToDate).format("YYYY-MM-DDTHH:mm");
    },
    invalidDateFilter: function () {
      var invalid = true;
      if (!this.showDateRange) {
        if (
          this.thermalSingleDate != undefined &&
          this.thermalSingleDate != ""
        ) {
          invalid = false;
        }
      }
      if (this.showDateRange) {
        if (
          this.thermalDateRange != undefined &&
          this.thermalDateRange != "-1"
        ) {
          invalid = false;
        }
        if (this.thermalDateRange == "-1") {
          var startDatetime = this.thermalFromDate
            .replace(/-/g, "")
            .replace(" ", "_")
            .replace(":", "");
          var endDatetime = this.thermalToDate
            .replace(/-/g, "")
            .replace(" ", "_")
            .replace(":", "");
          if (endDatetime == "") {
            endDatetime = moment().format("YYYYMMDD_HHmm");
          }
          var startYear = parseInt(startDatetime.substring(0, 4));
          var startMonth = parseInt(startDatetime.substring(4, 6)) - 1;
          var startDay = startDatetime.substring(6, 8);
          var startHr = startDatetime.substring(9, 11);
          var startMin = startDatetime.substring(11, 13);
          var endYear = parseInt(endDatetime.substring(0, 4));
          var endMonth = parseInt(endDatetime.substring(4, 6)) - 1;
          var endDay = endDatetime.substring(6, 8);
          var endHr = endDatetime.substring(9, 11);
          var endMin = endDatetime.substring(11, 13);
          var start = new Date(
            startYear,
            startMonth,
            startDay,
            startHr,
            startMin,
            0,
          );
          var end = new Date(endYear, endMonth, endDay, endHr, endMin, 0);
          var timeDiff = end - start;
          if (timeDiff <= 259200000) {
            invalid = false;
          } //25... is number of millisec in 72 hr
        }
      }
      return invalid;
    },
  },
  watch: {
    mapReady: {
      immediate: true,
      handler(ready) {
        if (ready && !this._thermalInitialised) {
          this.initialiseThermal();
        }
      },
    },
    thermalDateRange: function () {
      this.changeThermalDateRange();
    },
  },
  methods: {
    adjustHeight: function () {
      if (this.activeMenu === "thermal") {
        $("#hotspot-list").height(
          (this.screenHeight -
            this.leftPanelHeadHeight -
            $("#thermal-list-controller-container").height() -
            this.hintsHeight) *
            0.83,
        );
      }
    },
    changeThermalDateRange: function () {
      if (this.thermalDateRange === "-1") {
        //customized
        if (!this.thermalFromDate) {
          //fromDate is null, set to default value "Last 24 hours"
          let range = getDateRange(21024, "YYYY-MM-DD HH:mm");
          this.thermalFromDate = range[0] || "";
          if ((range[1] || "") !== this.thermalToDate) {
            this.thermalToDate = range[1] || "";
          } else {
            this.changeThermalToDate();
          }
        } else {
          this.changeThermalFromDate();
          this.changeThermalToDate();
        }
      } else {
        let range = getDateRange(this.thermalDateRange, "YYYY-MM-DD HH:mm");
        this.thermalFromDate = range[0] || "";
        this.thermalToDate = range[1] || "";
      }
    },

    hasDateFilter: function () {
      var dateFilterSpecified = false;
      if (this.showDateRange || this.thermalSingleDate != undefined) {
        dateFilterSpecified = true;
      }
      return dateFilterSpecified;
    },

    showFeature: function (feat) {
      return this.revision && (!this.viewportOnly || feat.inViewport);
    },

    scrollToSelected: function () {
      if (this.selectedFeatures.getLength() === 0) return;
      var index = -1;

      for (var i = 0; i < this._featurelist.getLength(); i++) {
        if (this.showFeature(this._featurelist.item(i))) {
          index += 1;
          if (this._featurelist.item(i) === this.selectedFeatures.item(0)) {
            break;
          }
        }
      }
      if (index >= 0) {
        var listElement = document.getElementById("hotspot-list");
        if (index < listElement.children.length) {
          listElement.scrollTop +=
            listElement.children[index].getBoundingClientRect().top -
            listElement.getBoundingClientRect().top;
        }
      }
    },

    toggleSelect: function (f) {
      if (this.isFeatureSelected(f)) {
        this.selectedFeatures.remove(f);
      } else {
        this.selectedFeatures.push(f);
      }
    },

    toggleViewportOnly: function () {
      this.viewportOnly = !this.viewportOnly;
      this.export.saveState();
    },
    toggleFlightFootprint: function () {
      this.showFlightFootprint = !this.showFlightFootprint;
      this.export.saveState();
      var map = this.$root.map;
      // Check if footprints layer already loaded
      var hotspotsLoaded = false;
      map.olmap.getLayers().forEach(function (layer) {
        if (layer.get("name") === "Thermal Imaging Flight Footprints") {
          // TODO: Resolve unused variable
          // toggleFlightFootprint = true
        }
        if (layer.get("name") === "Thermal Imaging Hotspots") {
          hotspotsLoaded = true;
        }
      });
      if (hotspotsLoaded && this.showFlightFootprint) {
        this.flightFootprintLayer.style = this.footprintStyle;
        var footprintOLLayer = map["createWFSLayer"](this.flightFootprintLayer);
        var ThermalImagingFlightFootprintsExists = false;
        map.olmap.getLayers().forEach(function (layer) {
          if (layer.get("name") === "Thermal Imaging Flight Footprints") {
            ThermalImagingFlightFootprintsExists = true;
          }
        });
        if (ThermalImagingFlightFootprintsExists == false) {
          map.olmap.addLayer(footprintOLLayer);
        } else {
          footprintOLLayer.refresh();
        }
      } else if (hotspotsLoaded && !this.showFlightFootprint) {
        map.olmap.getLayers().forEach(function (layer) {
          if (layer.get("name") === "Thermal Imaging Flight Footprints") {
            map.olmap.removeLayer(layer);
          }
        });
      }
    },
    toggleRawImageMosaic: function () {
      this.showRawImageMosaic = !this.showRawImageMosaic;
      this.export.saveState();

      var vm = this;
      var map = this.$root.map;
      // Check if mosaic layer already loaded
      // TODO fix unused variable
      // var mosaicLoaded;
      var hotspotsLoaded = this.isFeatureSelected;
      var mosaicPosition = null;

      map.olmap.getLayers().forEach(function (layer) {
        if (layer.get("name") === "Flight mosaics") {
          // TODO: Resolve unused variable
          // mosaicLoaded = true
        }
        if (layer.get("name") === "Thermal Imaging Hotspots") {
          mosaicPosition = map.olmap
            .getLayers()
            .getArray()
            .findIndex(function (l) {
              return l === layer;
            });
          hotspotsLoaded = true;
        }
      });
      if (hotspotsLoaded && this.showRawImageMosaic) {
        vm.removeImages();
        /*var mosaicLayers = []
			if (!this.hasDateFilter()) {
				mosaicLayers.push('vrt-test')
				console.log('mosaicLayers');
				console.log(mosaicL	ayers);
			}
			var mosaicLayersOLLayer = map['createWMSLayer'](mosaicLayers, position)*/
        // map.olmap.addLayer(mosaicLayersOLLayer)
        // mosaicLayersOLLayer.refresh()
        var dateInfo = this.getDateInfoForMosaics(vm);
        if (mosaicPosition && dateInfo.length > 0) {
          map["createWMSLayer"](mosaicPosition, dateInfo);
        }
        // map.olmap.addLayer(mosaicPositionOLLayer)
        // mosaicPositionOLLayer.refresh()
      } else if (hotspotsLoaded && !this.showRawImageMosaic) {
        map.olmap.getLayers().forEach(function (layer) {
          if (layer) {
            if (layer.get("name") === "Flight mosaics") {
              map.olmap.removeLayer(layer);
            }
          }
        });
      }
    },

    toggleDateRange: function () {
      this.thermalSingleDate = undefined;
      if (this.showDateRange) {
        ((this.thermalFromDate = undefined), (this.thermalToDate = undefined));
        this.ThermalDateRange = 21024;
        this.changeThermalDateRange();
      }
      if (!this.showDateRange) {
        ((this.thermalFromDate = undefined), (this.thermalToDate = undefined));
      }
    },

    isFeatureSelected: function (f) {
      return (
        this.selectedFeatures.getArray().findIndex(function (o) {
          return f === o;
        }) >= 0
      );
    },

    updateCQLFilter: function (wait) {
      var vm = this;
      if (!vm._updateCQLFilter) {
        vm._updateCQLFilter = debounce(function () {
          try {
            var cql_filter = "";
            if (cql_filter === vm.hotspotLayer.cql_filter) {
              //filter not changed
              return;
            }
            vm.hotspotLayer.cql_filter = cql_filter;
            //clear device filter or change other filter
            vm.hotspotMapLayer.set("updated", moment().toLocaleString());
            vm.hotspotMapLayer.getSource().loadSource("query");
          } catch (ex) {
            alert(ex);
          }
        }, 500);
      }
      if (wait === 0) {
        vm._updateCQLFilter.call({ wait: 1 });
      } else if (wait === undefined || wait === null) {
        vm._updateCQLFilter();
      } else {
        vm._updateCQLFilter.call({ wait: wait });
      }
    },

    getDateInfoForMosaics: function (vm) {
      var dateInfo = [];
      if (vm.showDateRange) {
        var start = vm.thermalFromDate
          .replace(/-/g, "")
          .replace(" ", "_")
          .replace(":", "");
        var end = vm.thermalToDate
          .replace(/-/g, "")
          .replace(" ", "_")
          .replace(":", "");
        dateInfo.push(start);
        if (end === "") {
          dateInfo.push("now");
        } else {
          dateInfo.push(end);
        }
      } else if (vm.thermalSingleDate != undefined) {
        var singleDate = vm.thermalSingleDate.replace(/-/g, "");
        dateInfo.push(singleDate);
      }
      return dateInfo;
    },

    removeHotspotList: function () {
      var hotspotButtons = document
        .getElementById("hotspot-list")
        .querySelectorAll(".collapsible");
      hotspotButtons.forEach(function (button) {
        // button.parentNode.remove()
        button.parentNode.style.display = "none";
      });
    },

    removeImages: function () {
      this.isHotspotImageON = false;
      var hotspotButtons =
        (this.$root.map,
        document
          .getElementById("hotspot-list")
          .querySelectorAll(".collapsible"));
      var i = 0;
      return (
        hotspotButtons.forEach(function (button) {
          "block" === button.nextElementSibling.style.display &&
            (setTimeout(function () {
              button.click();
            }, 10),
            (i += 1));
        }),
        i
      );
    },

    loadHotspotLayers: function () {
      if (this.invalidDateFilter) {
        return;
      }
      this.showHotspotImages = false;
      var _this = this;
      var vm = this;

      vm._featurelist.clear();
      vm.setExtentFeatureSize();
      var cqlFilter = "";
      var fromDate;
      var toDate;
      if (vm.hasDateFilter()) {
        if (vm.thermalSingleDate != undefined) {
          var singleDate = vm.thermalSingleDate.replace(/-/g, "");
          cqlFilter =
            "strStartsWith(flight_datetime,'" + singleDate + "')=true";
        } else if (vm.thermalToDate == "") {
          fromDate = vm.thermalFromDate.replace(/-/g, "");
          cqlFilter = "flight_datetime>'" + fromDate + "'";
        } else {
          toDate = vm.thermalToDate.replace(/-/g, "");
          fromDate = vm.thermalFromDate.replace(/-/g, "");
          cqlFilter =
            "flight_datetime between '" + fromDate + "' and '" + toDate + "'";
        }
      }
      var map = vm.$root.map;
      var imagesRemoved = vm.removeImages();
      var timeout = 10 * imagesRemoved;
      setTimeout(function () {
        map.olmap
          .getLayers()
          .getArray()
          .slice()
          .forEach(function (layer) {
            var layer_name = layer.get("name");

            //"Thermal Imaging Flight Footprints"===layer.get("name")&&map.olmap.removeLayer(layer),"Flight mosaics"===layer.get("name")&&map.olmap.removeLayer(layer)
            // if (layer.get("name") == "Thermal Imaging Hotspots"){
            // 	map.olmap.removeLayer(layer)
            // }
            if (
              layer_name.startsWith("Hotspot image") ||
              layer_name.startsWith("Thermal Imaging Hotspots") ||
              layer_name.startsWith("Thermal Imaging Flight Footprints") ||
              layer_name.startsWith("Flight mosaics")
            ) {
              map.olmap.removeLayer(layer);
            }
          });
        vm.hotspotLayer.hotspotFilter = cqlFilter;
        //Use footprint to set extent,then remove
        vm.flightFootprintLayer.hotspotFilter = cqlFilter;
        vm.flightFootprintLayer.style = vm.footprintStyle;
        var footprintOLLayer = map.createWFSLayer(vm.flightFootprintLayer);
        map.olmap.addLayer(footprintOLLayer);
        footprintOLLayer.refresh();

        map.olmap
          .getLayers()
          .getArray()
          .slice()
          .forEach(function (layer) {
            if (layer.get("name") == "Thermal Imaging Flight Footprints") {
              map.olmap.removeLayer(layer);
            }
          });
        var insertPosition = map.olmap.getLayers().getArray().length;
        map.createWMSLayerHotspots(cqlFilter, insertPosition);
        var mosaicPosition = insertPosition;

        if (vm.showFlightFootprint) {
          //vm.flightFootprintLayer.style = vm.footprintStyle
          map.olmap.addLayer(footprintOLLayer);
          footprintOLLayer.refresh();
        }

        if (vm.showRawImageMosaic) {
          var dateInfo = _this.getDateInfoForMosaics(vm);
          map.createWMSLayer(mosaicPosition, dateInfo);
        }
        var hotspotOLLayer = map.createWFSLayer(vm.hotspotLayer);
        hotspotOLLayer
          .getSource()
          .retrieveFeatures(cqlFilter, function (features) {
            vm.features.clear();
            vm.updateFeatureFilter(0);
            vm.features.extend(features.sort(vm.featureOrder));
            // $.each(features, function (index, feature){
            // 	var imagesString = feature.get('images')
            // 	var imagesArray = imagesString.split(',')
            // 	feature.shortImages = imagesArray
            // })
          });
      }, timeout);
    },

    clearHotspotLayers: function () {
      this.showHotspotImages = false;
      this.removeImages();
      this.removeHotspotLayers();
      this.removeHotspotList();
      setTimeout(() => {
        this.removeHotspotMosaic();
      }, 100);
    },

    featureFilter: function (f) {
      var search = this.search ? this.search.toLowerCase().trim() : "";
      var found =
        !search ||
        this.fields.some(function (key) {
          return ("" + f.get(key)).toLowerCase().indexOf(search) > -1;
        });
      return found;
    },

    featureOrder: function (a, b) {
      var as = [a.get("flight_datetime"), a.get("hotspot_no")];
      var bs = [b.get("flight_datetime"), b.get("hotspot_no")];
      if (as[0] < bs[0]) {
        return 1;
      } else if (as[0] > bs[0]) {
        return -1;
      } else if (as[1] < bs[1]) {
        return 1;
      } else if (as[1] > bs[1]) {
        return -1;
      }
      return 0;
    },

    //filter the loaded hotspot features
    updateFeatureFilter: function (wait) {
      var vm = this;
      vm.flights = [];
      if (!vm._updateFeatureFilter) {
        vm._updateFeatureFilter = debounce(function () {
          var list = vm.features.getArray();
          //var list = vm.features.getArray().sort(vm.featureOrder)
          if (vm.hasFeatureFilter) {
            list = list.filter(vm.featureFilter);
          }
          if (vm.hasDateFilter()) {
            if (vm.thermalSingleDate != undefined) {
              var singleDate = vm.thermalSingleDate.replace(/-/g, "");
              list = list.filter(function (feature) {
                return feature.get("flight_datetime").startsWith(singleDate);
              });
            } else if (vm.showDateRange) {
              var start = vm.thermalFromDate
                .replace(/-/g, "")
                .replace(" ", "_")
                .replace(":", "");
              var end = vm.thermalToDate
                .replace(/-/g, "")
                .replace(" ", "_")
                .replace(":", "");
              if (end === "") {
                list = list.filter(function (feature) {
                  return feature.get("flight_datetime") > start;
                });
              } else {
                list = list.filter(function (feature) {
                  return (
                    feature.get("flight_datetime") > start &&
                    feature.get("flight_datetime") < end
                  );
                });
              }
            }
            if (list.length == 0) {
              alert("No hotspots recorded in that period");
              return;
            }

            list.forEach(function (feature) {
              var flight = feature.get("flight_datetime");
              if (!vm.flights.includes(flight)) {
                vm.flights.push(flight);
              }
            });
          }

          vm._featurelist.clear();
          vm._featurelist.extend(list);

          //get extent of filtered features and set extent of map to this
          if (!vm.showFlightFootprint) {
            var extent = list[0].getGeometry().getExtent(); //.slice(0)
            list.forEach(function (feature) {
              extend(extent, feature.getGeometry().getExtent());
            });
            vm.$root.map.olmap
              .getView()
              .fit(extent, vm.$root.map.olmap.getSize());
          }

          vm.setExtentFeatureSize();
          if (vm.selectedFeatures.getLength() > 0) {
            if (list.length === 0) {
              vm.selectedFeatures.clear();
              vm.clippedFeatures.splice(0, vm.clippedFeatures.length);
            } else {
              for (
                var index = vm.selectedFeatures.getLength() - 1;
                index >= 0;
                index--
              ) {
                if (
                  !list.find(function (f) {
                    return f === vm.selectedFeatures.item(index);
                  })
                ) {
                  vm.selectedFeatures.removeAt(index);
                }
              }
            }
          }
          vm.revision += 1;
        }, 500);
      }
      if (wait === 0) {
        vm._updateFeatureFilter.call({ wait: 1 });
      } else if (wait === undefined || wait === null) {
        vm._updateFeatureFilter();
      } else {
        vm._updateFeatureFilter.call({ wait: wait });
      }
    },

    //filter the loaded footprints
    updateFootprintFilter: function (wait) {
      var vm = this;
      if (!vm._updateFootprintFilter) {
        vm._updateFootprintFilter = debounce(function () {
          var list = vm.footprints.getArray();
          if (vm.hasFeatureFilter) {
            list = list.filter(vm.featureFilter);
          }
          if (vm.hasDateFilter()) {
            if (vm.thermalSingleDate != undefined) {
              var singleDate = vm.thermalSingleDate.replace(/-/g, "");
              list = list.filter(function (feature) {
                return feature.get("flight_datetime").startsWith(singleDate);
              });
            } else if (vm.showDateRange) {
              var start = vm.thermalFromDate
                .replace(/-/g, "")
                .replace(" ", "_")
                .replace(":", "");
              var end = vm.thermalToDate
                .replace(/-/g, "")
                .replace(" ", "_")
                .replace(":", "");
              if (end === "") {
                list = list.filter(function (feature) {
                  return feature.get("flight_datetime") > start;
                });
              } else {
                list = list.filter(function (feature) {
                  return (
                    feature.get("flight_datetime") > start &&
                    feature.get("flight_datetime") < end
                  );
                });
              }
            }
          }
          vm._footprintlist.clear();
          vm._footprintlist.extend(list);

          //get extent of filtered features and set extent of map to this
          var extent = list[0].getGeometry().getExtent(); //.slice(0)
          list.forEach(function (feature) {
            extend(extent, feature.getGeometry().getExtent());
          });
          vm.$root.map.olmap
            .getView()
            .fit(extent, vm.$root.map.olmap.getSize());
        }, 500);
      }
      if (wait === 0) {
        vm._updateFootprintFilter.call({ wait: 1 });
      } else if (wait === undefined || wait === null) {
        vm._updateFootprintFilter();
      } else {
        vm._updateFootprintFilter.call({ wait: wait });
      }
    },

    toggleImageList: function (event, feature) {
      //event.target is the button wh was clicked; its nextElementSibling is the associated content (list of images for that hotspot)
      var imagesString = feature.get("images");
      var imagesArray = imagesString.split(",");
      this.showHotspotImages = true;
      const selected_feature = this.featurelist.find(function (f) {
        return f.id_ === feature.id_;
      });
      selected_feature.shortImages = imagesArray;
      var hotspotID = event.target.innerHTML;
      var imageListContent = event.target.nextElementSibling;
      if (imageListContent.style.display === "block") {
        var children = imageListContent.children; //HTML Collection object
        for (let item of children) {
          item.innerHTML = item.innerHTML
            .replace("<b>", "")
            .replace(" ON</b>", "");
        }
        imageListContent.style.display = "none";
        var map = this.$root.map;
        // Close any single images for this hotspot
        map.olmap.getLayers().forEach(function (layer) {
          if (layer) {
            if (layer.get("name") === "Hotspot image " + hotspotID) {
              map.olmap.removeLayer(layer);
            }
          }
        });
        this.isHotspotImageON = false;
      } else {
        imageListContent.style.display = "block";
      }
    },

    listImageFiles: function (f) {
      //Not used at present
      var imagesString = f.get("images");
      var imagesArrayPrelim = imagesString.split(",");
      var imagesArray = [];
      imagesArrayPrelim.forEach(function (item) {
        var pos1 = item.indexOf("/PNGs/") + 6;
        var pos2 = item.indexOf(".png");
        var imageName = item.slice(pos1, pos2);
        imagesArray.push(imageName);
      });
      return imagesArray;
    },

    showImage: function (flight_datetime, hotspot_no, file) {
      file = file.replace(" ", ""); // Get rid of whitespace
      var map = this.$root.map;
      var hotspots_position = 0;
      this.isHotspotImageON = true;
      if (this.showRawImageMosaic) {
        this.toggleRawImageMosaic();
      }
      // Close any other single images for the same hotspot
      map.olmap.getLayers().forEach(function (layer) {
        if (layer) {
          if (
            layer.get("name") ===
            "Hotspot image " + flight_datetime + " " + hotspot_no
          ) {
            map.olmap.removeLayer(layer);
          }
        }
      });
      // Add new single image
      // TODO: This variable was not referenced
      // var position = map.olmap.getLayers().getArray().length - 1
      map.olmap.getLayers().forEach(function (layer) {
        if (layer.get("name") === "Flight mosaics") {
          // TODO: Resolve unused variable
          // mosaicLoaded = true
        }
        if (layer.get("name") === "Thermal Imaging Hotspots") {
          hotspots_position = map.olmap
            .getLayers()
            .getArray()
            .findIndex(function (l) {
              return l === layer;
            });
          // TODO: Resolve unused variable
          // hotspotsLoaded = true
        }
      });
      let position = hotspots_position;
      map.createWMSLayerSingleImage(
        position,
        flight_datetime,
        hotspot_no,
        file,
      );
    },

    changeButtons: function (event) {
      var siblingButtons = this.getSiblingButtons(event.target);
      if (
        !event.target.innerHTML.endsWith(" ON") &&
        !event.target.innerHTML.endsWith(" ON</b>")
      ) {
        event.target.innerHTML =
          event.target.innerHTML.replace("image ", "<b>image ") + " ON</b>";
      }
      siblingButtons.forEach(function (item) {
        item.innerHTML = item.innerHTML
          .replace("<b>", "")
          .replace(" ON</b>", "");
      });
    },

    getSiblingButtons: function (buttonElement) {
      var siblings = [];
      var sibling = buttonElement.parentNode.firstChild;
      while (sibling) {
        if (sibling.nodeType === 1 && sibling !== buttonElement) {
          siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
      }
      return siblings;
    },

    removeHotspotLayers: function () {
      //not used at present (the removal is done in map.vue L1811)
      try {
        var map = this.$root.map;
        // Remove layers if exist
        map.active.olLayers.forEach(function (layer) {
          if (layer.get("name") === "Thermal Imaging Hotspots") {
            map.olmap.removeLayer(layer);
          }
          if (layer.get("name") === "Thermal Imaging Flight Footprints") {
            map.olmap.removeLayer(layer);
          }
        });
      } catch (ex) {
        alert(ex);
      }
    },

    removeHotspotMosaic: function () {
      //not used at present (the removal is done in map.vue L1811)
      try {
        var map = this.$root.map;
        // Remove layers if exist
        map.olmap.getLayers().forEach(function (layer) {
          if (layer.get("name") === "Flight mosaics") {
            map.olmap.removeLayer(layer);
          }
        });
      } catch (ex) {
        alert(ex);
      }
    },

    showEmailComposerPanel_OLD: function () {
      this.showEmailComposer = !this.showEmailComposer;
      var vm = this;
      if (vm.emailList.length == 0) {
        if (this.env.gokartService == "") {
          this.env.gokartServicewindow.location.href.slice(0, -4);
        }
        $.get(this.env.gokartService + "/hotspot_email_list").then(
          function (response) {
            var jsonObject = JSON.parse(response);
            vm.emailList = jsonObject["objects"];
            const select = document.getElementById("emailRecipient");
            for (let email in vm.emailList) {
              select.add(new Option(vm.emailList[email]));
            }
          },
        );
      }
    },

    showEmailComposerPanel: function () {
      if (this.flights.length == 0 && this.showEmailComposer == 0)
        return void alert(
          "The email function is designed to work only if one or more hotspot flights are loaded in the map.",
        );
      this.showEmailComposer = !this.showEmailComposer;
      var vm = this;
      if (vm.emailList.length == 0) {
        if (this.env.gokartService == "") {
          this.env.gokartServicewindow.location.href.slice(0, -4);
        }
        $.get(this.env.gokartService + "/hotspot_email_list").then(
          function (response) {
            vm.emailList = JSON.parse(response);
            const select = document.getElementById("emailRecipient");
            for (let item in vm.emailList) {
              select.add(new Option(vm.emailList[item]["email"]));
            }
          },
        );
      }
    },

    sendEmail_OLD: function () {
      var recipient = document.getElementById("emailRecipient").value;
      var messageText = document.getElementById("emailText").value;
      var vm = this;
      var cqlFilter = "";
      if (vm.hasDateFilter()) {
        if (vm.thermalSingleDate != undefined) {
          var singleDate = vm.thermalSingleDate.replace(/-/g, "");
          cqlFilter =
            "strStartsWith(flight_datetime, '" + singleDate + "') = true";
        }
      }

      // TODO: Fix unused variable
      // var dateInfo = this.getDateInfoForMosaics(vm)
      if (messageText.length == 0) {
        alert("You need to type in a message.");
        return;
      }
      $.get(
        this.env.gokartService +
          "/send_hotspot_email/" +
          recipient +
          "/" +
          messageText +
          "/" +
          vm.flights +
          "/" +
          cqlFilter,
      ).then(function (response) {
        alert(response);
      });
    },

    sendEmail: function () {
      var recipient = document.getElementById("emailRecipient").value,
        messageText = document.getElementById("emailText").value,
        vm = this,
        cqlFilter = "";
      if (vm.hasDateFilter() && void 0 != vm.thermalSingleDate) {
        cqlFilter =
          "strStartsWith(flight_datetime, '" +
          vm.thermalSingleDate.replace(/-/g, "") +
          "') = true";
      }
      this.getDateInfoForMosaics(vm);
      if (0 == messageText.length)
        return void alert("You need to type in a message.");
      try {
        $.get(
          this.env.gokartService +
            "/send_hotspot_email/" +
            recipient +
            "/" +
            messageText +
            "/" +
            vm.flights +
            "/" +
            cqlFilter,
        ).then(function (response) {
          alert(response);
        });
      } catch (err) {
        alert(err.name + ": " + err.message);
      }
    },

    setExtentFeatureSize: function () {
      // var size = 0
      // this._featurelist.forEach(function(feat){
      //     if (feat.inViewport) {
      // 		console.log("setting feature size.......")
      //         ++size
      //     }
      // })
      // this.extentFeaturesSize = size
      const size = this._featurelist
        .getArray()
        .reduce(
          (accumulator, feat) =>
            feat.inViewport ? accumulator + 1 : accumulator,
          0,
        );
      this.extentFeaturesSize = size;
    },

    updateViewport: function (wait) {
      var vm = this;
      if (!vm._updateViewport) {
        vm._updateViewport = debounce(function () {
          var viewportExtent = vm.map.extent;
          vm.features.forEach(function (feat) {
            feat.inViewport =
              feat.getGeometry() &&
              containsCoordinate(
                viewportExtent,
                feat.getGeometry().getCoordinates(),
              );
          });
          vm.setExtentFeatureSize();
          if (vm.viewportOnly) {
            vm.revision += 1;
          }
        }, 500);
      }
      if (wait === 0) {
        vm._updateViewport.call({ wait: 1 });
      } else if (wait === undefined || wait === null) {
        //vm._updateViewport()
        vm._updateViewport.call({ wait: 1 });
      } else {
        vm._updateViewport.call({ wait: wait });
      }
    },

    updateViewport_NEW: function (wait) {
      var vm = this;
      (vm._updateViewport ||
        (vm._updateViewport = debounce(function () {
          var viewportExtent = vm.map.extent;
          vm.features.forEach(function (feat) {
            feat.inViewport =
              feat.getGeometry() &&
              containsCoordinate(
                viewportExtent,
                feat.getGeometry().getCoordinates(),
              );
          });
          vm.setExtentFeatureSize();
          vm.viewportOnly && (vm.revision += 1);
        }, 500)),
        0 === wait
          ? vm._updateViewport.call({ wait: 1 })
          : void 0 === wait || null === wait
            ? vm._updateViewport()
            : vm._updateViewport.call({ wait: wait }));
    },

    clipToSelection: function () {
      if (this.selectedFeatures.getLength() === 0) {
        return;
      }
      this.clippedFeatures.splice(0, this.clippedFeatures.length);
      for (var index = 0; index < this.selectedFeatures.getLength(); index++) {
        this.clippedFeatures.push(
          this.selectedFeatures.item(index).get("deviceid"),
        );
      }
      if (this.clippedOnly) {
        this.updateCQLFilter();
      }
    },

    //filter the loaded features based on report name and fire number
    setup: function () {
      this.$nextTick(this.adjustHeight);
    },

    teardown: function () {
      this.annotations.selectable.splice(0, this.annotations.selectable.length);
    },
    initialiseThermal() {
      const vm = this;

      this._thermalInitialised = true;

      this.thermalStatus.phaseEnd("gk-init");

      this.thermalStatus.phaseBegin("attach_events", 10, "Attach events");

      vm.map.olmap.getView().on("propertychange", function () {
        vm.updateViewport();
      });

      vm.selectedFeatures.on("add", function () {
        vm.selectRevision += 1;
      });

      vm.selectedFeatures.on("remove", function () {
        vm.selectRevision += 1;
      });

      vm.map.olmap.on("removeLayer", function (ev) {
        if (ev.mapLayer.get("id") === "hotspots:hotspot_centroids") {
          vm.features.clear();
          vm._featurelist.clear();
        } else if (
          ev.mapLayer.get("id") === "hotspots:hotspot_flight_footprints"
        ) {
          vm.footprints.clear();
          vm._footprintlist.clear();
        }
      });

      vm._resolutionChanged = debounce(function () {
        vm.featureLabelDisabled =
          vm.map.olmap.getView().getResolution() >= 0.003;

        vm.featureDirDisabled = vm.map.olmap.getView().getResolution() >= 0.003;
      }, 200);

      vm._resolutionChanged();

      vm.map.olmap.getView().on("change:resolution", function () {
        vm._resolutionChanged();
      });

      this.thermalStatus.phaseEnd("attach_events");

      this.thermalStatus.phaseBegin("init_tools", 10, "Initialize tools");

      $.each([vm.annotations.ui.defaultPan], function (index, t) {
        t.scope = t.scope || [];
        t.scope.push("thermal");
      });

      vm.tools = vm.annotations.tools.filter(function (t) {
        return t.scope && t.scope.indexOf("thermal") >= 0;
      });

      this.thermalStatus.phaseEnd("init_tools");
    },
  },
  mounted() {
    var vm = this;
    var thermalStatus = this.loading.register(
      "thermal",
      "Thermal Imaging Component",
    );
    vm._featurelist = new Collection();
    vm._footprintlist = new Collection();

    thermalStatus.phaseBegin("initialize", 20, "Initialize");

    this.changeThermalDateRange();

    thermalStatus.phaseBegin("load_hotspots", 30, "Load hotspots", false, true);
    useStateStore().fixedLayers.push({
      //   type: 'WFSLayer',
      type: "ImageLayer",
      name: "Thermal Imaging Hotspots",
      id: "hotspots:hotspot_centroids",
      features: vm._featurelist,
      getFeatureInfo: function (f) {
        return {
          flight_datetime: f.get("flight_datetime"),
          hotspot_no: f.get("hotspot_no"),
          images: f.get("images"),
        };
      },
      onerror: function (status, message) {
        thermalStatus.phaseFailed("load_hotspots", status + " : " + message);
      },
      onload: function (loadType, vectorSource, features) {
        vm.features.clear();
        vm.updateFeatureFilter(0);
        vm.features.extend(features.sort(vm.featureOrder));
        /*var s = function(hotspot_no) {
				  return new Style({
						  text: new Text({
							text: hotspot_no,
							font: '16px Calibri,sans-serif',
							fill: new Fill({ color: '#fff' }),
							stroke: new Stroke({color: '#fff', width: 0.8})
						  }),
						  image : new Circle({
							  fill: new Fill({color: [0, 0, 255]}),
							  radius: 15
						  })
					  })
			  }*/

        $.each(features, function (index, feature) {
          //var hotspot_no = feature.get('hotspot_no').toString()
          //feature.setStyle(s(hotspot_no))
          var imagesString = feature.get("images");
          var imagesArray = imagesString.split(",");
          feature.shortImages = imagesArray;
        });
      },
    });

    useStateStore().fixedLayers.push({
      type: "WFSLayer",
      name: "Thermal Imaging Flight Footprints",
      id: "hotspots:hotspot_flight_footprints",
      features: vm._footprintlist,
      getFeatureInfo: function (f) {
        return { flight_datetime: f.get("flight_datetime") };
      },
      onerror: function (status, message) {
        thermalStatus.phaseFailed("load_hotspots", status + " : " + message);
      },
      onload: function (loadType, vectorSource, features) {
        vm.footprints.clear();
        vm.footprints.extend(features);
        vm.updateFootprintFilter(0);

        $.each(features, function (index, feature) {
          feature.setStyle(
            new Style({
              stroke: new Stroke({
                width: 5,
                color: [0, 0, 255],
              }),
            }),
          );
        });
      },
    });

    thermalStatus.phaseEnd("load_hotspots");

    var tools = [
      {
        name: "Thermal Imaging Select",
        label: "Select",
        // icon: 'fa-mouse-pointer',
        scope: ["thermal"],
        selectedFeatures: vm.selectedFeatures,
        keepSelection: true,
        interactions: [
          vm.annotations.dragSelectInterFactory({
            listeners: {
              selected: function () {
                vm.scrollToSelected();
              },
            },
          }),
          vm.annotations.polygonSelectInterFactory({
            listeners: {
              selected: function () {
                vm.scrollToSelected();
              },
            },
          }),
          vm.annotations.selectInterFactory({
            listeners: {
              selected: function () {
                vm.scrollToSelected();
              },
            },
          }),
        ],
        onSet: function () {
          vm.annotations.ui.dragSelectInter.setMulti(true);
          vm.annotations.ui.selectInter.setMulti(true);
        },
        // comments:[
        //   {
        //       name:"Tips",
        //       description:[
        //           "Select all features using shortcut key 'Ctrl + A'",
        //           "Select features using mouse.",
        //           "Hold 'Ctrl' to enable polygon selection",
        //           "Delete selected features using key 'Del'"
        //       ]
        //   }
        // ]
      },
    ];

    tools.forEach(function (tool) {
      vm.annotations.tools.push(tool);
    });

    thermalStatus.phaseEnd("initialize");

    thermalStatus.phaseBegin("gk-init", 30, "Listen 'gk-init' event");
  },
};
</script>

<style>
#thermalFromDate,
#thermalToDate,
#singleDate {
  cursor: pointer;
}

/* Style the button that is used to open and close the collapsible content */
.collapsible {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 10px;
  width: 100%;
  border: 1px solid #009;
  text-align: left;
  outline: none;
  font-size: 15px;
}

/* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
.active,
.collapsible:hover {
  background-color: #ccc;
}

/* Style the collapsible content. Note: hidden by default */
.showImages {
  padding: 0 1px;
  display: none;
  overflow: hidden;
  background-color: #f1f1f1;
}

/*Button colours*/
.red {
  background-color: red;
}
.blue {
  background-color: blue;
}
</style>
