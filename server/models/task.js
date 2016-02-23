var mongodb = require('./db'),
ObjectID = require('mongodb').ObjectID,
formatTime = require('../../public/js/plugins/formatTime');


function Task(task) {
  this.title= task.title,
  this.createTime= task.createTime,
  this.lastUpdate= task.createDate,
  this.finished= task.finished,
  this.isPrivate= task.isPrivate,
  this.finishTime = task.finishTime
};

module.exports = Task;

//存储用户信息
Task.prototype.save = function(callback) {
  var createtime = formatTime(this.createTime);

  var task = {
      title: this.title,
      createTime: createtime,
      lastUpdate: createtime.date,
      finished: this.finished,
      isPrivate: this.isPrivate,
      finishTime:this.finishTime
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 tasks 集合
    db.collection('tasks', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 tasks 集合
      collection.insert(task, {
        safe: true
      }, function (err, task) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, task[0]);//成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};

Task.getAll = function(haslogin,callback) {
  var query={};
  if(!haslogin){
    query.isPrivate = 0;
  }
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('tasks', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.find(query).sort({
        lastUpdate: -1,
        finished:1
      }).toArray(function (err, docs) {
       mongodb.close();
       if (err) {
         return callback(err);
       }
       callback(null, docs);
     });
    });
  });
};

Task.update = function(_id, title, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('tasks', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.update({
        "_id": new ObjectID(_id)
      }, {
        $set: {title:title,lastUpdate:new Date()}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};


Task.finish = function(_id, callback) {
  var finishtime =  formatTime(new Date());
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('tasks', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "_id": new ObjectID(_id)
      }, {
        $set: {finished:true,finishTime:finishtime}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

Task.recover = function(_id, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('tasks', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "_id": new ObjectID(_id)
      }, {
        $set: {finished:false,finishTime:{}}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

Task.remove = function(_id, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('tasks', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.remove({
        "_id": new ObjectID(_id)
      }, {
        w: 1
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });

    });
  });
};

