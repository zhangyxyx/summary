var path=require('path');//node的模块 可以获取文件的路径
var HtmlWebpackPlugin=require('html-webpack-plugin')//可以设置html模板
var ExtractTextPlugin=require('extract-text-webpack-plugin')//将文件单独打包成一个文件
var glob=require('glob')//全局
var webpack=require('webpack')
var CleanWebpackplugin=require('clean-webpack-plugin')//清空
//获取到全部的入口文件进行设置
function getfile(){
    var entry=[];
    //在当前全局中获取到对应的文件，循环全部的文件，对每一个文件进行设置
    glob.sync(__dirname+'/web/*.js').forEach(function(file){
        var name=file.split('main')[1]
        if(name){
            var filename=file.split('main')[0]+"main"+name;
            entry.push(filename)
        }
    })
    
    var arr=['webpack/hot/dev-server'];//webpack/hot/dev-server是热更新的时候入口文件需要添加的
    for(var i=0;i<entry.length;i++){
        arr.push(entry[i])
    }
    return arr
}
module.exports={
    entry:{//入口文件
        index:getfile(),
        vendor:['./web/jquery']
    },
    output:{//出口文件
        path:path.resolve(__dirname,'dist'),
        filename:'[name].[hash].js',//设置一个带hash的文件
    },
    resolve:{//js文件可以省略后缀
        extensions:['.js'],
    },
    module:{
        rules:[
            {//es6转es5
                test:/\.js$/,
                exclude:/node_modules/,
                loader:'babel-loader',
                query:{
                    presets:['es2015']
                }
            },
            {//css
                test:/\.css$/,
                exclude:/node_modules/,
                loader:ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
                //loader:ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader'),

            },
            {//图标转为base64
                test:/\.(png|jpg|gif)$/,
                exclude:/node_modules/,
                loader:'url-loader'
            }
        ]
    },
    //热更新
    devServer: {
        inline: true,
        port: 8099
      },
    plugins:[
        new HtmlWebpackPlugin({//自动生成一个html模板
            template:'./index.html'
        }),
        new ExtractTextPlugin('style.css'),//将css单独生成
        new webpack.optimize.CommonsChunkPlugin({//第三方插件
            name:['vendor','manifest']
        }),
        new CleanWebpackplugin(//在生成目标文件的时候，先清空目标文件夹
            ['dist/index.*.js'],
            {
                root:__dirname,
                verbose:true,
                dry:true
            }
        ),
        new webpack.HotModuleReplacementPlugin(),//热更新
    ]
    
}