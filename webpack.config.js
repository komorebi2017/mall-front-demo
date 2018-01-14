/**
 * @Author: 陌北有棵树
 * @Date: 2018/1/13 21:05
 */
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');  //分离css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name, title){
    return {
        template    : './src/view/' + name + '.html',
        filename    : 'view/' + name + '.html',
        title       : title,
        inject      : true,
        hash        : true,
        chunks      : ['common', name]
    };
};


var config ={
    entry: {
        'common' :['./src/page/common/index.js'],
        'index' : ['./src/page/index/index.js'],
        'login' : ['./src/page/login/index.js']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath : '/dist',
        filename: 'js/[name].js'   //注意此处要这样写，不然会报错
    },
    externals: {
        'jquery' : 'window.jQuery'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader',
                    use: ['css-loader'],
                    publicPath: '../'}) },
            { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]' },
        ]
    },
    plugins:[
        // 独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
        }),
        // 把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css", {allChunks: true}),
        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页'))
    ]
};

if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8089/');
}

module.exports = config;