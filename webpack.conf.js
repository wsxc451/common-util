const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode:'development',
    entry:{
        index:'./index.js'
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js',
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        inline:true,
        open:true,
        port:3000
    },
    resolve:{
        alias:{
            'vue$':'vue/dist/vue.js'
        }
    },
    plugins: [ //数组：放着所有的webpack插件
               // 配置
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            inject: true

        })
    ]

}