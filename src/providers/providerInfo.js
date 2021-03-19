// Ref Project: https://github.com/htoooth/Leaflet.ChineseTmsProviders

const providerInfo = {
  // Chinese Provider, Alibaba - GaoDe
  // Todo, check incomplete map
  // GaoDe: {
  //   url: '//webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
  //   subdomains: ["1", "2", "3", "4"]
  // },

  // Google in China
  // Todo, check incomplete map
  // GoogleCN: {
  //   url: "//www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
  //   subdomains: []
  // },

  // Google in Global except China
  Google: {
    url: "//mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
    subdomains: []
  },

  // Chinese Provider, ZhiTu - GeoQ.cn
  Geoq: {
    url: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
    subdomains: []
  },

  // British Provider, OpenStreetMap
  OSM: {
    url: "//{s}.tile.osm.org/{z}/{x}/{y}.png",
    subdomains: ['a', 'b', 'c']
  },

  // Need to install Proj4Leaflet for active this provider's service
  // Chinese Provider, Baidu Map
  // Baidu: {
  //   url: '//online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
  //   subdomains: '0123456789',
  //   tms: true
  // }

  // Need to apply a developer key to active this provider's service
  // Chinese Provider, 
  // TianDiTu: {
  //   url: "//t{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
  //   subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
  //   key: "DEVELOPER"
  // },
}

/**
 * GetProviderInfoByName
 * @description Get provider's tile info by provider's name, support ['GaoDe', 'Google', 'GoogleCN', 'Geoq', 'OSM'] on Jan 26th, 2021
 * @param {String} providerName
 * @return {object} providerInfo{url, subdomains...}
 */
export function getProviderInfo(providerName) {
  let ret = ''
  const searchResult = providerName && providerInfo[providerName]
  ret =  searchResult ? searchResult : providerInfo['OSM']
  return ret
}

/**
 * GetAllProviderName
 * @description Get all providers' names according to the keys of provider info
 * @return {String[]} providerNames
 */
export function getAllProviderName() {
  return Object.keys(providerInfo)
}