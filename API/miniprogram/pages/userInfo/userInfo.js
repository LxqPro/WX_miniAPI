//index.js
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    username:'',
    userhead:'',
    userschool:'',
    usernum:'',
    useracademy:'',
    usercredit:''
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
  onShow: function () {
    var that = this;
    //查询数据库，根据id
    db.collection('userInfo').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        let resData = res.data[0];
        //如果没有该用户，则创建用户
        if(resData===undefined){
          wx.getUserInfo({
            success: res => {
              that.setData({
                username: res.userInfo.nickName,
                usercredit:500,
                userhead: res.userInfo.avatarUrl
              });
              //写入数据库
              db.collection('userInfo').add({
                data: {
                  _id: app.globalData.openid,
                  username: res.userInfo.nickName,
                  userhead: res.userInfo.avatarUrl,
                  usernum: '',
                  usercredit: 500,
                  useracademy: '',
                  userschool: '',
                }
              })
            }
          });
        }
        //否则显示该用户信息
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
