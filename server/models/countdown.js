var mongodb = require('./db');

function Countdown(c) {
  // 开始时间
  this.begintime = c.begintime;
  // 结束时间
  this.endtime = c.endtime;
  // 事件
  this.event = c.event;
  // 详情
  this.detail = c.detail;
  // 1:倒计时/0:顺计时
  this.type = c.type;
  // 重要性评级 1-7,用于标色
  this.level = c.level;
};

module.exports = Countdown;

//存储用户信息
Countdown.prototype.save = function (callback) {
  //要存入数据库的用户信息文档
  var countdown = {
    begintime:this.begintime,
    endtime: this.endtime,
    event: this.event,
    detail: this.detail,
    type: this.type,
    level: this.level
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('countdown', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.insert(countdown, {
        safe: true
      }, function (err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, doc[0]);//成功！err 为 null，并返回存储后信息
      });
    });
  });
};


