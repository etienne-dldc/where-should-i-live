const fetch = require('node-fetch');
const querystring = require('querystring');
const colors = require('colors/safe');
const path = require('path');
const fs = require('fs');
const sequence = require('promise-sequence');
const timers = require('timers');
const _ = require('lodash');

const TAFF = '73 Rue d\'Anjou 75008 Paris';
const GOBS = '73 Boulevard Saint-Marcel, 75013 Paris';
const CENTER_OF_PANAM = {
  lat: 2.342615,
  lng: 48.85
};
const RADIUS = 0.11;
const OVAL_CORRECT = 0.53;
const MIN_DIST_BETWEEN_COORDS = 0.01;
const NUMBER_OF_POINTS = 250;

function getData(origin, destination) {
  const params = {
    key: 'AIzaSyDFpld_zhpZg2_gd2VYU_AG7r1QFYZcxDU',
    origin: origin,
    destination: destination,
    mode: 'transit',
    departure_time: 1472716800,
    alternatives: true,
    language: 'fr'
  }
  const stringParams = querystring.stringify(params)
  const url = `https://maps.googleapis.com/maps/api/directions/json?${stringParams}`;
  console.log(colors.red(`=> Fetch ${url}`));
  return fetch(url)
    .then(function(res) {
      return res.json();
    }).then(function(json) {
      return json
    });
}

function getRandomCoord () {
  var angle = Math.random() * Math.PI * 2;
  var r = RADIUS * Math.sqrt( Math.random() );
  var result = {};
  result.lat = CENTER_OF_PANAM.lat + (r * Math.cos(angle))
  result.lng = CENTER_OF_PANAM.lng + (r * Math.sin(angle) * OVAL_CORRECT)
  return result;
}

function getRandomCoordList () {
  var coordList = [];
  for (var i = 0; i < NUMBER_OF_POINTS; i++) {
    var maxLoop = 200;
    var lastDist = 0;
    var bestCoord = null;
    do {
      var coord = getRandomCoord();
      var minDist = minDistWithOtherCoord(coord, coordList);
      if (minDist > lastDist) {
        lastDist = minDist;
        bestCoord = coord;
      }
      --maxLoop;
    } while (maxLoop > 0 && minDist < MIN_DIST_BETWEEN_COORDS);
    coordList.push(bestCoord);
  }
  return coordList;
}

function minDistWithOtherCoord (coord, list) {
  var distList = [];
  for (var i = 0; i < list.length; i++) {
    var otherCoord = list[i];
    var latDiff = coord.lat - otherCoord.lat;
    var lngDiff = coord.lng - otherCoord.lng;
    const dist = Math.sqrt( (latDiff * latDiff) + (lngDiff * lngDiff) );
    distList.push(dist);
  }
  return Math.min.apply(null, distList);
} // end distWithOtherCoord

function getDataList () {
  // Get points list
  const pointsList = getRandomCoordList();
  const listOfPromise = [];
  function wait () {
    return new Promise(function(resolve, reject) {
      console.log(colors.green('Wait 100...'));
      setTimeout(resolve, 100);
    });
  }
  for (var i = 0; i < pointsList.length; i++) {
    const coord = pointsList[i];
    listOfPromise.push(getPromiseForCoord(coord));
    listOfPromise.push(wait);
  }
  var final = Promise.resolve([]);
  for (var i = 0; i < listOfPromise.length; i++) {
    (function(listOfPromise, i) {
      final = final.then(function (results) {
        var exec = listOfPromise[i]();
        return exec.then(result => {
          results.push(result);
          return results;
        })
      })
    }(listOfPromise, i));
  }
  final.then(function(results) {
    console.log('finish !')
    const chunks = _.chunk(results, 20);
    for (var i = 0; i < chunks.length; i++) {
      const filename = path.resolve(__dirname, '..', 'data', new Date().getTime() + '-' + i + '.json');
      fs.writeFileSync(filename, JSON.stringify(chunks[i]), 'utf8');
    }
  })
}

function getPromiseForCoord (coord) {
  const stringCoord = coord.lng + ',' + coord.lat;
  return function () {
    return Promise.all([
      getData(stringCoord, TAFF),
      getData(stringCoord, GOBS),
    ])
    .then(results => {
      var resultJSON = {
        origin: coord,
        taff: results[0],
        gobs: results[1]
      }
      console.log(resultJSON);
      return resultJSON;
    })
  }
}

getDataList();


// var list = getRandomCoordList();
// list.map((coord) => {
//   console.log(coord.lng + ',' + coord.lat);
// })




// getData(TAFF, '48.839563,2.326401').then((data) => {
//   console.log(data);
// })
