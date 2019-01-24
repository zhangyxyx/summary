# My-Webpack
## 说一下webpack的前期准备
先是下载npm和node这些下载可以都知道，然后新建一个webpack,在这个文件夹npm install webpack --save-dev 紧接着npm init初始化一路回车就可以了，然后就会出现package.json这里面回放一些指令和下载的插件</br>
打开webpack文件夹，新建一个webpack.config.js文件，我们主要的webpack配置代码就是在这个文件夹里面</br>
## base一些基本功能
1.多入口文件</br>
```
function getfile(){
    var entry=[];
    glob.sync(__dirname+'/web/*.js').forEach(function(file){
        var name=file.split('main')[1]
        if(name){
            var filename=file.split('main')[0]+"main"+name;
            entry.push(filename)
        }
    })
    for(var i=0;i<entry.length;i++){
        arr.push(entry[i])
    }
    return arr
}
module.exports={
    entry:{
        index:getfile(),
        vendor:['./web/jquery']
    },
    xxxx
}
```
2.将css文件单独成文件</br>
```
var ExtractTextPlugin=require('extract-text-webpack-plugin')
xxx
module:{
        rules:[
            xxx
            {
                test:/\.css$/,
                exclude:/node_modules/,
                loader:ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
                //loader:ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader'),

            },
            xxx
        ]
    },
xxx
plugins:[
        xxx
        new ExtractTextPlugin('style.css'),
        xxx
    ]
```
3.设置一个html模板</br>
```
var HtmlWebpackPlugin=require('html-webpack-plugin')
xxx
plugins:[
        new HtmlWebpackPlugin({
            template:'./index.html'
        }),
       xxx
    ]
xxx
```
4.将ES6代码用babel转成ES5</br>
这里面注意的是使用babrl的时候需要在根目录下设置一个page.babelrc文件里面{"presets" : ["es2015"]}写一段这个
```
{
                test:/\.js$/,
                exclude:/node_modules/,
                loader:'babel-loader',
                query:{
                    presets:['es2015']
                }
},
```
5.将图片转成base64</br>
```
{
                test:/\.(png|jpg|gif)$/,
                exclude:/node_modules/,
                loader:'url-loader'
}
```
6.将第三方文件单程成一个文件</br>
```
entry:{
        index:getfile(),
        vendor:['./web/jquery']
},
xxx
new webpack.optimize.CommonsChunkPlugin({
            name:['vendor','manifest']
}),
```
7.热更新</br>
```
xxx

function getfile(){
    var entry=[];
    glob.sync(__dirname+'/web/*.js').forEach(function(file){
        var name=file.split('main')[1]
        if(name){
            var filename=file.split('main')[0]+"main"+name;
            entry.push(filename)
        }
    })
    var arr=['webpack/hot/dev-server'];
    for(var i=0;i<entry.length;i++){
        arr.push(entry[i])
    }
    return arr
}
module.exports={
    entry:{
        index:getfile(),
        vendor:['./web/jquery']
    },
    xxx
    module:{
       xxx
    },
    devServer: {
        inline: true,
        port: 8099
      },
    plugins:[
        xxx
        new webpack.HotModuleReplacementPlugin(),
    ]
    
}
```
### 具体代码可以看base文件夹里面
