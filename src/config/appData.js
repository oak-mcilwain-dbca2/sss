export const fixedScales = [
  0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 80, 100, 125, 250, 500, 1000, 2000,
  3000, 5000, 10000, 25000,
];

export const importSpatialFileTypes = ''; //".json,.geojson,.gpx,.gpkg" TODO: Looks like this was disabled in legacy. Can we bring some filetype strictness back in?

export const importSpatialFileTypeDesc =
  'Support GeoJSON(.geojson .json), GPS data(.gpx), GeoPackage(.gpkg), 7zip(.7z), TarFile(.tar.gz,tar.bz,tar.xz),ZipFile(.zip)';
