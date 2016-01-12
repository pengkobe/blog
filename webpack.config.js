module.exports = {
    entry: "./src/js/myblog.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
	        { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=[path][name].[ext]'},
            //{test: require.resolve('./src/js/jquery.js'), loader: 'expose?jQuery'}
        ]
    },

    // 配置别名
    resolve: {
        root: '/Users/pengyi/pengyi_project/my_blog/src', //绝对路径
        extensions: ['', '.js', '.css', '.scss'],
        alias: {
            // js
            mobileDetect : 'js/helper/mobileDetect',
            jQueryCookie : 'js/jquery-plugins/jQuery-Cookie',
            tplEngine : 'js/helper/tplEngine',
            jquery : 'js/jquery',

            //css
            style : 'css/style',
        }
    }
};
