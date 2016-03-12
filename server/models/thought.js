var mongodb = require('./db'),
ObjectID = require('mongodb').ObjectID,
formatTime = require('../../public/js/plugins/formatTime');

function Thought(thought) {
  this.title= thought.title,
  this.createTime= thought.createTime,
  this.lastUpdate= thought.createDate,
  this.isPrivate= thought.isPrivate,
};

module.exports = Thought;

//存储用户信息
Thought.prototype.save = function(callback) {
  var createtime = formatTime(this.createTime);

  var thought = {
      title: this.title,
      createTime: createtime,
      lastUpdate: createtime.date,
      isPrivate: this.isPrivate,
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 thoughts 集合
    db.collection('thoughts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 thoughts 集合
      collection.insert(thought, {
        safe: true
      }, function (err, thought) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, thought[0]);//成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};

Thought.getAll = function(haslogin,callback) {
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
    db.collection('thoughts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
    collection.count(query, function (err, total) {
        collection.find(query).sort({
          createTime: -1,
          finished:1
        }).toArray(function (err, docs) {
         mongodb.close();
         if (err) {
           return callback(err);
         }
         callback(null, docs,total);
       });
      });
    });
  });
};

Thought.update = function(_id, title, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('thoughts', function (err, collection) {
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


Thought.finish = function(_id, callback) {
  var finishtime =  formatTime(new Date());
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('thoughts', function (err, collection) {
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

Thought.recover = function(_id, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('thoughts', function (err, collection) {
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

Thought.remove = function(_id, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('thoughts', function (err, collection) {
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

//一次获取5篇文章
Thought.getFiveDay = function(lastdate,haslogin, callback) {
  var nowdate = new Date();
  nowdate.setTime(lastdate.getTime()); 
  nowdate.setDate(nowdate.getDate()+5);
  console.log(nowdate);
  console.log(lastdate);
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('thoughts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if(!haslogin){
          query.isPrivate = 0;
      }
      
      if(lastdate){
        query["createTime.date"] = {"$gt":lastdate,"$lte":nowdate};
      }

      collection.count(query, function (err, total) {
        collection.find(query).sort({
          createTime: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(null, docs, total);
        });
      });
    });
  });
};

