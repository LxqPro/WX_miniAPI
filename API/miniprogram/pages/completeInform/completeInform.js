// pages/completeInform/completeInform.js
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    user_name:'',
    user_num:'',
    schoolIndex:'0',
    academyIndex:'0',
    school: ['------','重庆大学', '清华大学', '野鸡大学','甜蜜高校','冯焱华大学'],
    academy: ['------','大数据与软件学院', '法学院', '计算机学院', '生物工程学院','冯焱华学院','王天岗学院'],
    tempObj:{}
  },

//选择学校
  bindPickerSchool:function(e){
    this.setData({
      schoolIndex: e.detail.value
    })
  },

//姓名
  bindInputName:function(e){
    this.setData({
      user_name:e.detail.value
    })
    console.log(e.detail.value)
  },
  // 学号
  bindInputSchoolid:function(e){
    this.setData({
      user_num: e.detail.value
    })
  },
  //学院
  bindPickerAcademy:function(e){
    this.setData({
      academyIndex: e.detail.value
    })
  },

  //保存信息
  SaveInfo:function(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认修改信息',
      success: function (res) {
        wx.showLoading({
          title: '保存中',
        })
        if (res.confirm) {//这里是点击了确定以后
        //更新数据到数据库
          db.collection('userInfo').doc(app.globalData.openid).update({
          data:{
            username:that.data.user_name,
            usernum:that.data.user_num,
            useracademy: that.data.academy[that.data.academyIndex],
            userschool: that.data.school[that.data.schoolIndex]
            },
          })
          //更新缓存
          that.data.tempObj.username=that.data.user_name
          that.data.tempObj.usernum = that.data.user_num
          that.data.tempObj.userschool = that.data.school[that.data.schoolIndex]
          that.data.tempObj.useracademy = that.data.academy[that.data.academyIndex]
          wx.setStorage({
            key: 'myself',
            data: that.data.tempObj,
            success:function(){
              // 保存信息后返回上1页面
              wx.hideLoading()
              wx.switchTab({
                url: '../userInfo/userInfo',
              })
            }
          })
        }
          else {//这里是点击了取消以后
        }
      }
    })
  },
  //页面显示时同步信息
  onShow: function () {
    let that = this;
    wx.getStorage({
      key: 'myself',
      success: function(res) {
        var resData = res.data;
        that.setData({
          user_name:resData.username,
          user_num:resData.usernum,
          schoolIndex: app.getIndex(that.data.school, resData.userschool),
          academyIndex: app.getIndex(that.data.academy, resData.useracademy),
          tempObj:resData
        })
        console.log(that.data.tempObj)
      },
    })
  }
})