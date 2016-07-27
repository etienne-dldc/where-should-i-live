var d3 = require('d3');
var _ = require('lodash');
require('d3-voronoi');
var voronoi = d3.voronoi();

// CSS
require('./app.css');

require('./maps');

var data = require('../data/1469613404149-resume.json');

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

var dataVal = data.map(item => {
  var gobVal = diffGob - (item.gobs - minGobDist)
  var taffVal = diffTaff - (item.taff - minTaffDist)
  var weight = gobVal + taffVal
  return [
    item.origin.lat,
    item.origin.lng,
    weight
  ]
})
var diagram = voronoi(dataVal);
var polygons = diagram.polygons();

document.addEventListener('DOMContentLoaded', function(event) {


  var canvas = document.getElementById('canvas');
  canvas.width = 1000;
  canvas.height = 600;
  var ctx = canvas.getContext('2d');

  console.log(polygons.length);

  for (var i = 0; i < polygons.length; i++) {
    var poly = polygons[i].map(point => {
      if (point === null) {
        return [
          0,
          0
        ]
      }
      return [
        ((point[0] - minLat) / latDiff) * 300,
        ((point[1] - minLng) / lngDiff) * 300
      ]
    });

    var opacity = polygons[i].data[2] / 6000;

    ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
    ctx.beginPath();
    ctx.moveTo(poly[0][0],poly[0][1]);
    for (var j = 1; j < poly.length; j++) {
      ctx.lineTo(poly[j][0],poly[j][1])
    }
    ctx.fill();

  }

});
