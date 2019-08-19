module.exports = {
  transpileDependencies: [
    /\bvue-echarts\b/,
    /\bresize-detector\b/
  ],
  baseUrl: './',
  productionSourceMap: false,
  devServer:{
    proxy:{
      // '/api':{
      //   target: 'http://192.168.1.95:8080/webserver-haitong/',
      //   // target: 'http://192.168.30.48:8088/webserver/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': '/'
      //   }
      // },
      '/api':{
        target: 'http://192.168.1.151/webserver-guotai/',
        // target: 'http://192.168.30.48:8088/webserver/',
        changeOrigin: true,
        pathRewrite: {
              '^/api': '/'
            }
      }
    }
  }
}