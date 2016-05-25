var express = require('express');
var app = express.Router();

var Countdown = require('../models/countdown.js');

app.get('/all', function (req, res) {
  res.json({ success: true });
});

app.get('/add', function (req, res) {
  var cobj = JSON.parse(req.query.data);
  var countdown = new Countdown({
    begintime: cobj.begintime,
    endtime: cobj.endtime,
    event: cobj.event,
    detail: cobj.detail,
    type: cobj.type,
    level: cobj.level
  });

  countdown.save(function (err, user) {
    if (err) {
      //res.json({ success: false });
    }
  });
  res.json({ success: true });
});



app.get('/edit', function (req, res) {
  res.json({ success: true });
});

app.get('/delete', function (req, res) {
  res.json({ success: true });
});



module.exports = app;
