var _ = require('lodash');
var loadGoogleMapsAPI = require('load-google-maps-api').default;
var data = require('../data/pap-11-12-13-14.json');
var ControlKit = require('controlkit');
var React = require('react');
var ReactDOM = require('react-dom');

const filteredData = _(data['_embedded'].annonce)
.value();

console.log(filteredData);

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

// CSS
require('./app.css');

_.each(filteredData, (annonce, index) => {
  filteredData[index].prixSurface = annonce.prix / annonce.surface;
})

var orderData = _.orderBy(filteredData, 'prixSurface');
console.log(orderData);

const Item = (props) => {
  return (
    <div>
      <b>{ Math.floor(props.appart.prixSurface * 100) / 100 }</b> -
        <span>{ props.appart.prix }€</span> -
        <span>{ props.appart.surface }m2</span> -
        <a href={ props.appart._links.desktop.href }>Lien</a>
    </div>
  )
}

const List = (props) => {
  return (
    <div>
      { props.apparts.map(appart => {
        return (<Item appart={appart} />);
      }) }
    </div>
  );
}

ReactDOM.render(<List apparts={orderData} />, document.getElementById('app'));



var map, markers = [];

// loadGoogleMapsAPI({
//   key: 'AIzaSyACvG7lhlveHa24Qn1mMsSW7jaT17eHaVI',
//   libraries : ['visualization'],
//   language: 'fr'
// }).then((googleMaps) => {
//   initMap();
// })

// function initMap () {
//   map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 12,
//     center: new google.maps.LatLng(48.8791064, 2.2314794)
//   });
//
//   updateMap();
// }
//
// function updateMap () {
//
//
//
//
// }
