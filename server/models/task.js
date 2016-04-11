var mongodb = require('./db'),
 marked = require('marked'),
ObjectID = require('mongodb').ObjectID,
formatTime = require('../../public/js/plugins/format_time');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

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
    collection.count(query, function (err, total) {
        collection.find(query).sort({
          createTime: -1,
          finished:1
        }).toArray(function (err, docs) {
         mongodb.close();
         if (err) {
           return callback(err);
         }
		 //解析 markdown 为 html
          docs.forEach(function (doc) {
               doc._m_title = marked(doc.title);
          });  

         callback(null, docs,total);
       });
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
        callback(null,{
			_m_title:marked(title)
		});
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

//一次获取5篇文章
Task.getFiveDay = function(lastdate,haslogin, callback) {
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
    db.collection('tasks', function (err, collection) {
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
		  //解析 markdown 为 html
          docs.forEach(function (doc) {
               doc._m_title = marked(doc.title);
          }); 
          callback(null, docs, total);
        });
      });
    });
  });
};

