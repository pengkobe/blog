var express = require('express');
var app = express.Router();

var Task = require('../models/task.js');

app.get('/all', function (req, res) {
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

app.get('/unfinished', function (req, res) {
   var haslogin = req.session.user? 1 :0;
   Task.getByIsfinished( haslogin,false,function (err, tasks, total) {
    if (err) {
      tasks = [];
      console.log(error);
    }
    res.json(tasks);
  });
});

// (废弃)
app.post('/five', function (req, res) {
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

// 分页加载
app.post('/getbynum', function (req, res) {
   var haslogin = req.session.user? 1 :0;
   var page = req.body.page;
   var num = req.body.num;
   Task.getTasksByNum(num,page,haslogin,function (err, tasks, total) {
    if (err) {
      tasks = [];
      console.log(error);
    }

    res.json(tasks);
  });
});

app.post('/new', checkLogin);
app.post('/new', function (req, res) {
  var currentUser = req.session.user,
      createtime = new Date();
   //   console.log('ppp'+req.body.isPrivate);
  var info={
    title:req.body.title,
    createTime:createtime,
    lastUpdate:createtime,
    finished:false,
    isPrivate:req.body.isPrivate=="true"? 1 : 0,
    finishTime:{}
  };
  var task = new Task(info);
  task.save(function (err,doc) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
     res.json({success:true,tasks:[doc]});
  });
});

app.post('/:_id/edit', checkLogin);
app.post('/:_id/edit', function (req, res) {
  var title = req.body.title;
    Task.update(req.params._id, title,function (err,obj) {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
      res.json({success:true,_m_title:obj._m_title});
    });
});

app.get('/:_id/delete', checkLogin);
app.get('/:_id/delete', function (req, res) {
    Task.remove(req.params._id, function (err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
      res.json({success:true});
    });
});



app.get('/:_id/finish', checkLogin);
app.get('/:_id/finish', function (req, res) {
    Task.finish(req.params._id, function (err) {
      console.log(err);
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
     res.json({success:true});
    });
});

app.get('/:_id/recover', checkLogin);
app.get('/:_id/recover', function (req, res) {
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
    res.json({success:false});
   // res.redirect('/login');
    return;
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!');
    res.json({success:false});
   // res.redirect('back');//返回之前的页面
    return;
  }
  next();
}


module.exports = app;
