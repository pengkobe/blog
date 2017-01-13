var mongodb = require('./db');

function PV(pv) {
  this.ip = pv.ip;
  this.resolution = pv.resolution;
  this.location = pv.location;
  this.referrer = pv.referrer;
  this.ssid = pv.ssid;
  this.timestamp = pv.timestamp;
  this.pvhash = pv.pvhash;
};

module.exports = PV;

//存储用户信息
PV.prototype.save = function (callback) {
  //要存入数据库的用户信息文档
  var pv = {
    ip:this.ip,
    resolution: this.resolution,
    location: this.location,
    referrer: this.referrer,
    ssid: this.ssid,
    timestamp: this.timestamp,
    pvhash: this.pvhash
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('pv', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      collection.insert(pv, {
        safe: true
      }, function (err, pv) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null, pv[0]);//成功！err 为 null，并返回存储后信息
      });
    });
  });
};


