# [kobepeng个人站](new.kobepeng.com)

##      	目录

*   [dependency](#dependency)
*	[install](#install)
*	[features](#features)
*	[config](#config)
*	[ToDo](#ToDo)
*	[Protocol](#Protocol)


## dependency
*   nodejs
*   mongodb
*   redis(to do)

### features
just click it:  
http://new.kobepeng.com

## install
```
git clone https://github.com/pengkobe/my_blog.git
cd my_blog
npm install
cd server
node  www
```

## config
edit settings.js at /blogroot/server  
mine for example:
```
module.exports = { 
   cookieSecret: 'myblog', 
   db: 'blog', 
   host: 'localhost',
   port: 27017,
   dbUrl:'mongodb://localhost/blog'
}; 

```


## ToDo
*	movie comments page
*	finish thoughts record page 
*	finish labroom page
*   a chatting room
*   build with webpack
*   test case

           
## Protocol

Released under the MIT, BSD, and GPL Licenses