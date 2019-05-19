//index.js
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    username:'',
    userhead:'/images/login.png',
    userschool:'',
    usernum:'',
    useracademy:'',
    usercredit:'',
    islogin:false  //是否禁用授权按钮
  },
  /**
   * 跳转到修改个人信息页面
   */
  changeInfo:function(){
    var that = this
    wx.navigateTo({
      url: '../completeInform/completeInform?username="that.data.username"&usernum={{usernum}}',
    })
  },
  /**
   * 跳转到积分排名页面
   */
  showRank:function(){
    var that = this
    wx.navigateTo({
      url: '../creditRank/creditRank?username='+that.data.username+'&usercredit='+that.data.usercredit
    })
  },
  showHistory:function(){
    wx.navigateTo({
      url: '../historyPosts/historyPosts',
    })
  },
  //用户授权后创建用户
  getInfo:function(){
    var that = this
    wx.getUserInfo({
      success: res => {
        app.globalData=({
          openid:app.globalData.openid,
          isLogin:true
        })
        that.setData({
          username: res.userInfo.nickName,
          usercredit: 200,
          userhead: res.userInfo.avatarUrl,
          islogin:true
        });
        var tempObj = {
          _id:app.globalData.openid,
          _openid:app.globalData.openid,
          useracademy:"",
          usercredit:200,
          userhead:res.userInfo.avatarUrl,
          username:res.userInfo.nickName,
          usernum:"",
          userschool:""
        }
        //写入数据库
        db.collection('userInfo').add({
          data: {
            _id: app.globalData.openid,
            username: res.userInfo.nickName,
            userhead: res.userInfo.avatarUrl,
            usernum: '',
            usercredit: 200,
            useracademy: '------',
            userschool: '------',
          }
        })
        //写入缓存
        wx.setStorage({
          key: 'myself',
          data: tempObj,
        })
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'myself',
      success: function(res) {
        var resData=res.data
        console.log(resData)
        console.log(resData.username)
        that.setData({
          username: resData.username,
          usernum: resData.usernum,
          userschool: resData.userschool,
          useracademy: resData.useracademy,
          usercredit: resData.usercredit,
          userhead: resData.userhead,
          islogin: true
        });
        console.log(that.data.username)
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  clear:function(){
    wx.clearStorage()
  }
})
