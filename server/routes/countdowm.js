var express = require('express');
var app = express.Router();

var Countdown = require('../models/countdown.js');

app.post('/all', function (req, res) {
  var haslogin = req.session.user ? 1 : 0;
  var query = {};
  console.log('login:'+req.session.user);
  if (!haslogin) {
    //query.isPrivate = false;
  }else{
  //  query.isPrivate = true;
  }

  Countdown.getByCondition(query, function (err, countdowns, total) {
    if (err) {
      countdowns = [];
      console.log(err);
      res.json({ success: false });
    }
    res.json({success: true,data:countdowns});
  });
});

app.post('/add', function (req, res) {
  var cobj = req.body;
  var countdown = new Countdown({
    begintime: cobj.begintime,
    endtime: cobj.endtime,
    event: cobj.event,
    detail: cobj.detail,
    type: cobj.type,
    level: cobj.level,
    cycle: cobj.cycle,
    isPrivate: cobj.isPrivate? true:false
  });
  countdown.save(function (err, model) {
    if (err) {
      console.log(err);
      res.json({ success: false });
    }else{
      res.json(model);
    }
  });
});


app.get('/:_id/delete', function (req, res) {
    console.log('rm' + req.params._id);
    Countdown.remove(req.params._id, function (err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
      res.json({success:true});
    });
});


app.get('/edit', function (req, res) {
  res.json({ success: true });
});
module.exports = app;
