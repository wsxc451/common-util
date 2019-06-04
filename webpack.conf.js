const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')


module.exports = {
    mode:'development',
    entry:{
        index:'./index.js'
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js',
    },
    resolve:{
        alias:{
            'vue$':'vue/dist/vue.js'
        },
        extensions: ['.js', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' },
            // 它会应用到普通的 `.js` 文件
            // 以及 `.vue` 文件中的 `<script>` 块
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
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
        new VueLoaderPlugin(),
               // 配置
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            inject: true

        })
    ]

}