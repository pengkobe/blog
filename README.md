# [yipeng.info](https://yipeng.info)
> a light weight blog based on nodejs&&mongodb. this blog mainly built for myself.
if you curious about how to build this. you can go there: https://github.com/nswbmw/N-blog.git

## Dependency
* node
* mongodb
* redis(todo)

## Feature
this project use these frameworks or middlewares you may concern:  
1. express  
2. ejs  
3. multer  
how it looks? just click:  https://yipeng.info


## Structure
```
my_blog/
├── app.js (for Express)
├── server
│   ├── model 
│   ├── route 
│   ├── view  
│   ├── settings.js 
│   └── www 
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
├── test (todo)
├── package.json
├── humans.txt
├── commit
├── LICENSE.txt
├── README.md
├── robots.txt
└── sitemap.js
```

## Install
```bash
git clone https://github.com/pengkobe/my_blog.git
cd blog
npm install
cd server
# notice : you got to start mongodb first.
node www
```

## Config
mongodb config is in settings.js under server/. for your data safety. 
you must have some security authentication strategy :
```javascript
module.exports = { 
   cookieSecret: 'secret', 
   db: 'blog', 
   host: 'locahostlhost',
   port: port,
   dbUrl:'mongodb:username:pwd//localhost:port/blog?your_options'
}; 

```

## Subproject
* [countdown](http://countdown.yipeng.info)
* [task](http://task.yipeng.info)
* [labroom](http://labroom.yipeng.info)
* [crawler](http://crawler.yipeng.info) 

## Todo
* use redis
* a chatting room
* ~~test case~~

           
## License
Released under the [MIT Licenses](http://spdx.org/licenses/MIT)
