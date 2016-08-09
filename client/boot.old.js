var d3 = require('d3');
var _ = require('lodash');
require('d3-voronoi');
var voronoi = d3.voronoi();
var loadGoogleMapsAPI = require('load-google-maps-api').default;
var data = require('../data/1469613404149-resume.json');
var ControlKit = require('controlkit');

// ControlKit
var params = {
  distGob: 25,
  distTaff: 30,
  range: [0, 120]
};
var controlKit = new ControlKit();
controlKit.addPanel()
  .addGroup()
    .addSubGroup()
      .addSlider(params,'distGob','range', {
        onFinish: updateMap
      })
      .addSlider(params,'distTaff','range', {
        onFinish: updateMap
      })

// CSS
require('./app.css');

// require('./maps');


var allGobDist = data.map(item => item.gobs);
var minGobDist = _.min(allGobDist)
var maxGobDist = _.max(allGobDist)
var diffGob = maxGobDist - minGobDist;

var allTaffDist = data.map(item => item.taff);
var minTaffDist = _.min(allTaffDist)
var maxTaffDist = _.max(allTaffDist)
var diffTaff = maxTaffDist - minTaffDist;

var allLat = data.map(item => item.origin.lat);
var minLat = _.min(allLat);
var latDiff = _.max(allLat) - minLat;
var allLng = data.map(item => item.origin.lng);
var minLng = _.min(allLng);
var lngDiff = _.max(allLng) - minLng;

var allWeight = [];

var dataVal = data
.filter(item => {
  return (item.gobs !== null) && (item.taff !== null);
})
.map(item => {
  var gobVal = diffGob - (item.gobs - minGobDist)
  var taffVal = diffTaff - (item.taff - minTaffDist)
  var weight = gobVal + taffVal
  allWeight.push(weight);
  return [
    item.origin.lat,
    item.origin.lng,
    {
      sum: weight,
      taff: item.taff / 60,
      gobs: item.gobs / 60,
      item: item
    }
  ]
})
var diagram = voronoi(dataVal);
var polygons = diagram.polygons();

var map, polys = [];

loadGoogleMapsAPI({
  key: 'AIzaSyACvG7lhlveHa24Qn1mMsSW7jaT17eHaVI',
  libraries : ['visualization'],
  language: 'fr'
}).then((googleMaps) => {
  initMap();
})

function initMap () {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(48.8791064, 2.2314794)
  });

  updateMap();
}

function updateMap () {

  for (var i = 0; i < polys.length; i++) {
    polys[i].setMap(null);
  }

  for (var i = 0; i < polygons.length; i++) {
    var poly = polygons[i];
    var red = 0;
    var blue = 0;
    var opa = 0.2;
    if (poly.data[2].taff < params.distTaff ) {
      red = 200;
      opa += 0.2;
    }
    if (poly.data[2].gobs < params.distGob ) {
      blue = 200;
      opa += 0.2;
    }
    if (poly.data[2].gobs == null || poly.data[2].taff == null) {
      opa = 0;
    }
    var shape = new google.maps.Polygon({
      paths: polygons[i]
      .filter(point => point !== null)
      .map((point) => {
        return { lat: point[1], lng: point[0] };
      }),
      strokeWeight: 0.5,
      strokeOpacity: 0.3,
      fillColor: `rgb(${red}, 0, ${blue})`,
      fillOpacity: opa
    });
    shape.setMap(map);
    (function(poly) {
      shape.addListener('click', (e) => {
        showData(e, poly);
      });
    }(poly));
    polys.push(shape);
  }
}

function showData(event, poly) {
  console.log(poly.data[2]);
}


//
// document.addEventListener('DOMContentLoaded', function(event) {
//
//
//   var canvas = document.getElementById('canvas');
//   canvas.width = 1000;
//   canvas.height = 600;
//   var ctx = canvas.getContext('2d');
//
//   console.log(polygons.length);
//
//   for (var i = 0; i < polygons.length; i++) {
//     var poly = polygons[i].map(point => {
//       if (point === null) {
//         return null
//       }
//       return [
//         ((point[0] - minLat) / latDiff) * 300,
//         ((point[1] - minLng) / lngDiff) * 300
//       ]
//     });
//
//     var opacity = polygons[i].data[2] / 6000;
//
//     if (poly[0] !== null) {
//       ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
//       ctx.beginPath();
//       ctx.moveTo(poly[0][0],poly[0][1]);
//       for (var j = 1; j < poly.length; j++) {
//         if (poly[j] !== null) {
//           ctx.lineTo(poly[j][0],poly[j][1])
//         }
//       }
//       ctx.fill();
//     }
//
//   }
//
// });
