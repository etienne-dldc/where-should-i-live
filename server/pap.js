const fetch = require('node-fetch');
const querystring = require('querystring');
const colors = require('colors/safe');
const path = require('path');
const fs = require('fs');
const sequence = require('promise-sequence');
const timers = require('timers');
const _ = require('lodash');
const FormData = require('form-data');
const request = require("request");

const data = require('../data/pap-11-12-13-14.json');
const filteredData = _(data['_embedded'].annonce).value();

function getDataForAppart (appartId) {

  var options = {
    method: 'GET',
    url: 'http://ws.pap.fr/immobilier/annonces/' + appartId,
    headers: {
      'cache-control': 'no-cache',
      'X-Device-Gsf': '30f763cc90cfba94'
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}
