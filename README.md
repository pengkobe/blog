# [kobepeng's site](new.kobepeng.com)
> a light weight blog based on nodejs&&mongodb. this blog mainly built for myself.
if you curious about how to build this. you can go there: https://github.com/nswbmw/N-blog.git

## Dependency
* node
* mongodb

## Feature
this project use these frameworks or midwares you may concern:  
1. express  
2. ejs  
3. multer  
how it looks? just click:  https://yipeng.info


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

## Subprojects
* countdown
* task
* labroom page

## Todo
* twitter page 
* use redis
* ~~a chatting room~~
* ~~test case~~
* ~~movie comments page~~
* ~~build with webpack(Abandoned)~~

           
## License
Released under the [MIT Licenses](http://spdx.org/licenses/MIT)
