# [kobepeng's site](new.kobepeng.com)
> a light weight blog based on nodejs&&mongodb. this blog mainly built for myself.
if you curious about how to build this. you can go there: https://github.com/nswbmw/N-blog.git

## Navigation	

*  [dependency](#dependency)
*  [install](#install)
*  [features](#features)
*  [structure](#structure)
*  [config](#config)
*  [todo](#todo)
*  [finished](#finished)
*  [protocol](#protocol)


## Dependency
*   nodejs
*   mongodb

## Feature
I use these framework or Midware you may concern:  
1. express  
2. ejs  
3. multer  
4. ~~webpack(Abandoned)~~  
5. socket.io(to do)  
how it looks? just click:  http://yipeng.info


## Structure
```
my_blog/
├── LICENSE.txt
├── README.md
├── app.js (for Express)
├── server
│   ├── model 
│   ├── route 
│   ├── view  
│   ├── settings.js 
│   └── www 
├── package.json
├── public
│   ├── common
│   │   ├── css
│   │   │   ├── lib
│   │   │   ├── plugins
│   │   ├── js
│   │   │   ├── lib
│   │   │   ├── plugins
│   ├── css
│   ├── js
│   ├── fonts
│   └── img 
├── project（will be moved from my_blog）
│   ├── labroom
│   ├── my_cv
│   ├── task
│   ├── [my_dashboard](https://github.com/pengkobe/my_dashboard)（todo）
│   ├── [my_countdown](https://github.com/pengkobe/my_countdown)（todo）
│   ├── thought（todo）
│   └── movie_comment（todo）
├── test (todo)
├── webpack.config.js
├── humans.txt
├── commit
└── sitemap.js
```

## Install
```
git clone https://github.com/pengkobe/my_blog.git
cd my_blog
npm install
cd server
# before you run this. you got to start mongodb.
node www
```

## Config
settings.js is in server. my config for example:
```
module.exports = { 
   cookieSecret: 'myblog', 
   db: 'blog', 
   host: 'localhost',
   port: 27017,
   dbUrl:'mongodb://localhost/blog'
}; 

```

## Finished
* countdown
* task
* labroom page

## Todo
* finish thoughts record page 
* a chatting room
* use redis
* test case
* movie comments page
* ~~build with webpack(Abandoned)~~

           
## License

Released under the [MIT Licenses](http://spdx.org/licenses/MIT)
