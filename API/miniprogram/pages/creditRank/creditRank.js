// pages/creditRank/creditRank.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.cloud.callFunction({
      name: 'pullDB',
      data: {},
      success: function (res) {
        console.log(res.result);
        that.setData({
          userList:res.result.data
        })
      }, fail: function (res) {
        console.log(res)
      }
    })
    // const cmd = db.command;
    // db.collection('userInfo').where({
    //   // usercredit: cmd.gte(100)
    // }).get({
    //   success:res=>{
    //     console.log(res);
    //     that.setData({
    //       userList:res.data
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})