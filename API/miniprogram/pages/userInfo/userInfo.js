//index.js
const app = getApp()

console.log(app);

Page({
  data: {
    username:'',
    userschool:'',
    usernum:'',
    useracademy:'',
    usercredit:''
  },
  /**
   * 跳转到修改个人信息页面
   */
  changeInfo:function(){
    wx.navigateTo({
      url: '../completeInform/completeInform?username={{username}}&usernum={{usernum}}',
    })
  },
  onShow: function () {
    const db = wx.cloud.database()
    var that = this;
    db.collection('userInfo').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        let resData = res.data[0];
        if(resData===undefined){
          wx.getUserInfo({
            success: res => {
              that.setData({
                username: res.userInfo.nickName
              })
            }
          })
        }
        else{
          that.setData({
            username: resData.username,
            usernum: resData.usernum,
            userschool: resData.userschool,
            useracademy: resData.useracademy,
            usercredit: resData.usercredit
          });
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        });
        wx.getUserInfo({
          success: res => {
            that.setData({
              username: res.userInfo.nickName
            })
          }
        })
      },
    });
  },

})
