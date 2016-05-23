var express = require('express');
var app = express.Router();

var PV = require('../models/pv.js');

app.get('/pv', function (req, res) {

  var ip = getIP(req);
  var pvobj = JSON.parse(req.query.data);
  var pv = new PV({
    ip:ip,
    resolution: pvobj.resolution,
    location: pvobj.location,
    referrer: pvobj.referrer,
    ssid: pvobj.ssid,
    timestamp: pvobj.timestamp,
    pvhash: pvobj.pvhash
  });

  //如果不存在则新增
  pv.save(function (err, user) {
    if (err) {
      //res.json({ success: false });
    }
  });
  res.json({ success: true });
});

// 非pv数据，暂时不存
app.get('/nopv', function (req, res) {
  //console.log(req.query);
  res.json({ success: true });
});

function getIP(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}

module.exports = app;
