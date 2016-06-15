var mongodb = require('./db'),
    marked = require('marked'),
    ObjectID = require('mongodb').ObjectID;

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

function Post(name, head, title, tags, isprivate,post,createtime) {
  this.name = name;
  this.head = head;
  this.title = title;
  this.tags = tags;
  this.isprivate = isprivate;
  this.post = post;

  this.createtime = createtime;
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
  var datenow = new Date();

  var createDate = new Date(this.createtime);
  var fullyear = createDate.getFullYear();
  var month =  createDate.getMonth() +1;
  var day =  createDate.getDate();
  var hour =  createDate.getHours();
  var minute =  createDate.getMinutes();
  //存储各种时间格式，方便以后扩展
  var createtime = {
      date: createDate,
      time:  (hour< 10 ? '0' + hour: hour) + ":" + (minute< 10 ? '0' + minute : minute),
      year : fullyear,
      month : fullyear + "-" + month,
      day : fullyear+ "-" + (month< 10 ? '0' + month: month) + "-" + (day< 10 ? '0' + day : day),
      minute : fullyear + "-" + month+ "-" + day + " " + 
      (hour< 10 ? '0' + hour: hour) + ":" + (minute< 10 ? '0' + minute : minute)
  }
  //要存入数据库的文档
  var post = {
      name: this.name,
      head: this.head,
      createtime: createtime,
      lastupdatetime: datenow,
      title:this.title,
      tags: this.tags,
      post: this.post,
      comments: [],
      isprivate: this.isprivate,
      pv: 0
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 posts 集合
      collection.insert(post, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null);//返回 err 为 null
      });
    });
  });
};

//一次获取5、10篇文章
Post.getTen = function(name, page,haslogin, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }

      if(!haslogin){
          query.isprivate = 0;
      }
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function (err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*5 个结果，返回之后的 5 个结果
        collection.find(query, {
          skip: (page - 1)*5,
          limit: 5
        }).sort({
          createtime: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          //解析 markdown 为 html
          docs.forEach(function (doc) {
            var index=0;
            index = doc.post.indexOf("<!-- more -->");
            if(index !== -1){
               doc.post = marked(doc.post.slice(0,index)) +'<a class="seemore" href="/p/'+doc._id+'">more...</a>';
            }else{
               doc.post = marked(doc.post);
            }
          });  
          callback(null, docs, total);
        });
      });
    });
  });
};

//获取一篇文章
Post.getOne = function(_id, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "_id": new ObjectID(_id)
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        if (doc) {
          //每访问 1 次，pv 值增加 1
          collection.update({
            "_id": new ObjectID(_id)
          }, {
            $inc: {"pv": 1}
          }, function (err) {
            mongodb.close();
            if (err) {
              return callback(err);
            }
          });
          //移除<!-- more --> && 解析 markdown 为 html 
          doc.post = marked(doc.post.replace("<!-- more -->",""));
          doc.comments.forEach(function (comment) {
            comment.content = marked(comment.content);
          });
          callback(null, doc);//返回查询的一篇文章
        }
      });
    });
  });
};

//返回原始发表的内容（markdown 格式）
Post.edit = function(_id, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "_id": new ObjectID(_id)
      }, function (err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, doc);//返回查询的一篇文章（markdown 格式）
      });
    });
  });
};

//更新一篇文章及其相关信息
Post.update = function(_id, title,tags,post, createDate,isprivate,callback) {
  var createDate = new Date(createDate);
  var fullyear = createDate.getFullYear();
  var month =  createDate.getMonth() +1;
  var day =  createDate.getDate();
  var hour =  createDate.getHours();
  var minute =  createDate.getMinutes();
  var createtime = {
      date: createDate,
      time:  (hour< 10 ? '0' + hour: hour) + ":" + (minute< 10 ? '0' + minute : minute),
      year : fullyear,
      month : fullyear + "-" + month,
      day : fullyear+ "-" + (month< 10 ? '0' + month: month) + "-" + (day< 10 ? '0' + day : day),
      minute : fullyear + "-" + month+ "-" + day + " " + 
      (hour< 10 ? '0' + hour: hour) + ":" + (minute< 10 ? '0' + minute : minute)
  }
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "_id": new ObjectID(_id)
      }, {
        $set: {title:title,tags:tags,post: post,createtime:createtime,isprivate:isprivate}
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

//删除一篇文章
Post.remove = function(_id, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
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

//返回所有文章存档信息
Post.getArchive = function(haslogin,callback) {
  //打开数据库
  var query={};
  if(!haslogin){
    query.isprivate = 0;
  }
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //返回只包含 name、time、title 属性的文档组成的存档数组
      collection.find(query, {
        "name": 1,
        "createtime": 1,
        "title": 1,
        "isprivate": 1,
      }).sort({
        createtime: -1
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

//返回所有标签
Post.getTags = function(callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //distinct 用来找出给定键的所有不同值
      collection.distinct("tags", function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};

//返回含有特定标签的所有文章
Post.getTag = function(tag, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //查询所有 tags 数组内包含 tag 的文档
      //并返回只含有 name、createtime、title 组成的数组
      collection.find({
        "tags": tag
      }, {
        "name": 1,
        "createtime": 1,
        "title": 1
      }).sort({
        createtime: -1
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

//返回通过标题关键字查询的所有文章信息
Post.search = function(keyword, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var pattern = new RegExp(keyword, "i");
      collection.find({
        "title": pattern
      }, {
        "name": 1,
        "createtime": 1,
        "title": 1
      }).sort({
        createtime: -1
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