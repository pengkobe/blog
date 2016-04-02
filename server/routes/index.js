var express = require('express');
var app = express.Router();

var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');
var Task = require('../models/task.js');

// 多文件上传
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/img');
  },
  filename: function (req, file, cb) {
    //file.fieldname
    cb(null, file.originalname);
  }
});
 
var upload = multer({ storage: storage });

app.get('/', function (req, res) {
  //判断是否是第一页，并把请求的页数转换成 number 类型
  var page = req.query.p ? parseInt(req.query.p) : 1;
  var haslogin = req.session.user? 1 :0;

  //查询并返回第 page 页的 5 篇文章
  Post.getTen(null, page, haslogin,function (err, posts, total) {
    if (err) {
      posts = [];
      console.log(err);
    } 
    var totalpage = parseInt(total/5);
    if(total % 5 !==0){
      totalpage=totalpage+1;
    }
    res.render('index', {
      title: '主页',
      posts: posts,
      total:total,
      totalpage:totalpage,
      page: page,
      isFirstPage: (page - 1) == 0,
      isLastPage: ((page - 1) * 5 + posts.length) == total,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

app.get('/reg', checkNotLogin);
app.get('/reg', function (req, res) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

app.post('/reg', checkNotLogin);
app.post('/reg', function (req, res) {
  var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];
  if (password_re != password) {
    req.flash('error', '两次输入的密码不一致!'); 
    return res.redirect('/reg');//返回主册页
  }
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
      name: req.body.name,
      password: password,
      email: req.body.email
  });
  //检查用户名是否已存在 
  User.get(newUser.name, function (err, user) {
    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/reg');
    }
    //如果不存在则新增用户
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = user;
      req.flash('success', '注册成功!');
      res.redirect('/');
    });
  });
});

app.get('/login', checkNotLogin);
app.get('/login', function (req, res) {
  res.render('login', {
    title: '登录',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  }); 
});

app.post('/login', checkNotLogin);
app.post('/login', function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.name, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!'); 
      return res.redirect('/login');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    if (user.password != password) {
      req.flash('error', '密码错误!'); 
      return res.redirect('/login');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/');//登陆成功后跳转到主页
  });
});

app.get('/post', checkLogin);
app.get('/post', function (req, res) {
  res.render('post', {
    title: '发表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

app.post('/post', checkLogin);
app.post('/post', function (req, res) {
  var currentUser = req.session.user,
      createtime = req.body.date + " " + req.body.time,
      tags = [req.body.tag1, req.body.tag2, req.body.tag3],
      post = new Post(currentUser.name, currentUser.head, 
        req.body.title, tags,(req.body.isprivate? 1:0), req.body.post,createtime);
  post.save(function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    req.flash('success', '发布成功!');
    // 发表成功跳转到主页
    res.redirect('/');
  });
});

app.get('/logout', checkLogin);
app.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  // 登出成功后跳转到主页
  res.redirect('/');
});

app.get('/upload', checkLogin);
app.get('/upload', function (req, res) {
  res.render('upload', {
    title: '文件上传',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

app.post('/upload', checkLogin);
app.post('/upload', upload.array('photos', 12),function (req, res) {
  req.flash('success', '文件上传成功!');
   // res.redirect('/upload');
   res.json({success:true});
});

app.get('/archive', function (req, res) {
  var haslogin = req.session.user? 1 :0;
  Post.getArchive(haslogin,function (err, posts) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('archive', {
      title: '存档',
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

app.get('/tags', function (req, res) {
  Post.getTags(function (err, posts) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('tags', {
      title: '标签',
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

app.get('/tags/:tag', function (req, res) {
  Post.getTag(req.params.tag, function (err, posts) {
    if (err) {
      req.flash('error',err); 
      return res.redirect('/');
    }
    res.render('tag', {
      title: 'TAG:' + req.params.tag,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

app.get('/links', function (req, res) {
  res.render('links', {
    title: '友情链接',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

app.get('/search', function (req, res) {
  Post.search(req.query.keyword, function (err, posts) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('search', {
      title: "SEARCH:" + req.query.keyword,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
app.get('/autocomplete', function (req, res) {
  console.log(req.query.keyword);
  Post.search(req.query.keyword, function (err, posts) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.json(posts);
  });
});

app.get('/p/:_id', function (req, res) {
  Post.getOne(req.params._id, function (err, post) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('article', {
      title: post.title,
      posttitle: post.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});


app.get('/edit/:_id', checkLogin);
app.get('/edit/:_id', function (req, res) {
  Post.edit(req.params._id, function (err, post) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    res.render('edit', {
      title: '编辑',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

app.post('/edit/:_id', checkLogin);
app.post('/edit/:_id', function (req, res) {
  var body = req.body;
  var createDate = body.date + " " + body.time;
  var tags = [body.tag1, body.tag2, body.tag3];
  var isprivate = body.isprivate? 1:0;
  Post.update(req.params._id, body.title, tags,body.post, createDate,isprivate,function (err) {
    var url = encodeURI('/p/' + req.params._id);
    if (err) {
      req.flash('error', err); 
      return res.redirect(url);//出错！返回文章页
    }
    req.flash('success', '修改成功!');
    res.redirect(url);//成功！返回文章页
  });
});

app.get('/remove/:_id', checkLogin);
app.get('/remove/:_id', function (req, res) {
  Post.remove(req.params._id, function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    req.flash('success', '删除成功!');
    res.redirect('/');
  });
});


app.get('/about', function (req, res) {
    res.render('about', {
      title: '关于我',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});

app.get('/labroom', function (req, res) {
    res.render('labroom', {
      title: '实验室',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});

app.get('/thoughts', function (req, res) {
    res.render('thoughts', {
      title: '随想录',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});

app.get('/movie-comments', function (req, res) {
    res.render('movie-comments', {
      title: '我的影评',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});




app.get('/task/all', function (req, res) {
   var haslogin = req.session.user? 1 :0;
   var date = new Date();
   date.setDate(date.getDate()-5);
   Task.getFiveDay(date,haslogin,function (err, tasks,total) {
    if (err) {
      req.flash('error', err); 
      console.log(err);
      return res.redirect('/');
    }
    var totalpage = parseInt(total/5);
    if(total % 5 !==0){
      totalpage=totalpage+1;
    }
    res.render('tasks', {
      title: '任务',
      totalpage:totalpage,
      tasks:tasks,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
   });
  });
});

app.post('/task/five', function (req, res) {
   var haslogin = req.session.user? 1 :0;
   var lastdate = req.body.lastdate ? new Date(req.body.lastdate) : new Date('2016/01/01');

   Task.getFiveDay(lastdate, haslogin,function (err, tasks, total) {
    if (err) {
      tasks = [];
      console.log(error);
    } 
    
    res.json(tasks);
  });
});

app.post('/task/new', checkLogin);
app.post('/task/new', function (req, res) {
  var currentUser = req.session.user,
      createtime = new Date();
  var info={
    title:req.body.title,
    createTime:createtime,
    lastUpdate:createtime,
    finished:false,
    isPrivate:req.body.isPrivate? 1 : 0,
    finishTime:{}
  };
  var task = new Task(info);
  task.save(function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    req.flash('success', '发布成功!');
    res.redirect('/task/all');
  });
});

app.get('/task/:_id/delete', checkLogin);
app.get('/task/:_id/delete', function (req, res) {
    Task.remove(req.params._id, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', '删除成功!');
      res.redirect('/task/all');
    });
});

app.post('/task/:_id/edit', checkLogin);
app.post('/task/:_id/edit', function (req, res) {
  var title = req.body.title;
    Task.update(req.params._id, title,function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      res.json({success:true});
    });
});

app.get('/task/:_id/finish', checkLogin);
app.get('/task/:_id/finish', function (req, res) {
    Task.finish(req.params._id, function (err) {
      console.log(err);
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
     res.json({success:true});
    });
});

app.get('/task/:_id/recover', checkLogin);
app.get('/task/:_id/recover', function (req, res) {
    Task.recover(req.params._id, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      res.json({success:true});
    });
});


function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!'); 
    res.redirect('/login');
    return;
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!'); 
    res.redirect('back');//返回之前的页面
    return;
  }
  next();
}

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!'); 
    res.redirect('/login');
    return;
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!'); 
    res.redirect('back');//返回之前的页面
    return;
  }
  next();
}

module.exports = app;
