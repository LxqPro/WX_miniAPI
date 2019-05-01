//app.js
App({
  globalData:{
    openid:''
  },
  onLaunch:function(){
    // 云开发初始化
    wx.cloud.init({
      env: 'cqu-se-06class-f9b488', //确认云环境ID
      traceUser: true,
    }); 
    /**
     * 获取用户openid
     */
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        this.globalData=({
          openid: res.result.openid
        })
      }
    })
  }
})
