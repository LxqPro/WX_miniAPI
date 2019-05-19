//app.js
App({
  globalData:{
    openid:'',

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
    var db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log(res)
        db.collection('userInfo').doc(res.result.openid).get({
          success:data=>{
            wx.setStorage({
              key: 'myself',
              data: data.data,
            })
            this.globalData=({
              openid: res.result.openid,
              isLogin:true
            })
          },
          fail:err=>{
            console.log(res.result.openid)
            this.globalData=({
              openid: res.result.openid,
              isLogin:false
            })
          }
        })
      }
    });
  },
  getIndex: function (arr, content) {
    var Index = 0;
    arr.forEach(function (value, index) {
      if (value == content) {
        Index = index;
      }
    })
    return Index;
  },
  
})
