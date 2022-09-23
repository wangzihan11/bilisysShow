module.exports = {

    configureWebpack: {
    },

    devServer: {
        // host:'0.0.0.0',
        // port:8080,
        open:true, 

        public: '10.46.29.1:8080',//这里使用的是自己的ip,可以修改端口

        hot: true,

        disableHostCheck: true,

    }

};