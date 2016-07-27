var loadGoogleMapsAPI = require('load-google-maps-api').default;
var data = require('../data/1469613404149-resume.json');

var map, heatmap;

loadGoogleMapsAPI({
  key: 'AIzaSyACvG7lhlveHa24Qn1mMsSW7jaT17eHaVI',
  libraries : ['visualization'],
  language: 'fr'
}).then((googleMaps) => {
  initMap();
})

function initMap () {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: new google.maps.LatLng(48.8791064, 2.2314794)
  });

  // heatmap = new google.maps.visualization.HeatmapLayer({
  //   data: getPoints(),
  //   map: map,
  //   dissipating: false
  // });
  //
  // heatmap.set('radius', 0.002);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {
  var allGobDist = data.map(item => item.gobs);
  var minGobDist = _.min(allGobDist)
  var maxGobDist = _.max(allGobDist)
  var diffGob = maxGobDist - minGobDist;

  var allTaffDist = data.map(item => item.taff);
  var minTaffDist = _.min(allTaffDist)
  var maxTaffDist = _.max(allTaffDist)
  var diffTaff = maxTaffDist - minTaffDist;

  return data.map(item => {
    var gobVal = diffGob - (item.gobs - minGobDist)
    var taffVal = diffTaff - (item.taff - minTaffDist)
    return {
      location: new google.maps.LatLng(item.origin.lng, item.origin.lat),
      weight: gobVal + taffVal
    }
  })
}
