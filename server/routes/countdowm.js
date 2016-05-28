var express = require('express');
var app = express.Router();

var Countdown = require('../models/countdown.js');

app.get('/all', function (req, res) {
  res.json({ success: true });
});

app.post('/add', require('body-parser').json(),  function (req, res) {
  var cobj = req.body;
  var countdown = new Countdown({
    begintime: cobj.begintime,
    endtime: cobj.endtime,
    event: cobj.event,
    detail: cobj.detail,
    type: cobj.type,
    level: cobj.level,
    cycle: cobj.cycle
  });
  countdown.save(function (err, user) {
    if (err) {
      console.log(err);
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
