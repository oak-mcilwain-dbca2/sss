export function getLayerId(id, env) {
  return (env && env.layerMapping && env.layerMapping[id]) || id;
}

export function isKbLayer(id) {
  return typeof id === "string" && id.startsWith("kaartdijin-boodja");
}

export function getLayerUrl(layerId, env) {
  if (isKbLayer(layerId) || layerId.startsWith("dpaw:bushfire")) {
    return env.kbService;
  }

  if (layerId.startsWith("hotspots:")) {
    return `${env.hotspotsUrl}/wfs`;
  }

  return env.kmiService;
}
