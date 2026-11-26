export default {
  authUrl: '/sso/profile',

  appType: window.location.protocol === 'file:' ? 'cordova' : 'webapp',

  cswService:
    'https://csw-uat.dbca.wa.gov.au/catalogue/api2/application/records',

  catalogueAdminService: 'https://csw.dbca.wa.gov.au',

  kmiService: 'https://kmi.dbca.wa.gov.au/geoserver',

  hotspotService: 'https://hotspots.dbca.wa.gov.au/geoserver/hotspots/ows',

  gokartService: 'https://sss.dbca.wa.gov.au',

  resourceTrackingService: 'https://resourcetracking.dbca.wa.gov.au',

  bfrsService: 'https://bfrs.dbca.wa.gov.au',

  staticService: 'https://static.dbca.wa.gov.au',

  overviewLayer: 'dbca:mapbox-outdoors',

  resourceTrackingLiveLayer: '...',
};
