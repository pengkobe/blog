# [yipeng.info](https://yipeng.info)

> A light weight blog based on nodejs&&mongodb. this blog mainly built for myself.
if you curious about how to build this. you can go there: https://github.com/nswbmw/N-blog.git

## Dependency

* Mongodb

## Feature

this project use these frameworks or middlewares:  

1. Express
2. EJS
3. Multer

how it looks? here to see:  https://yipeng.info

## Code Structure

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
│   │   │   ├── vendors
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
# you need to start mongodb first.
node www
```

## Configuration

mongodb config is in settings.js under server/. for your data safety. 
you must have some security authentication strategy :

```javascript
module.exports = { 
   cookieSecret: 'cookie_secret', 
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

## License

Released under the [MIT Licenses](http://spdx.org/licenses/MIT)
