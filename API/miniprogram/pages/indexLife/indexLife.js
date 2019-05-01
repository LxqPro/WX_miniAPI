// pages/indexLife/indexLife.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resList:[],
    schoolName: '重庆大学',
    academyName: '大数据与软件学院',
    academyList: ['大数据与软件学院', '计算机学院', '化工学院', '微电子与通信学院']
  },

  /**
   * 选择学院更新数据
   */
  ensureSelect: function (e) {
    this.setData({
      academyName: this.data.academyList[e.detail.value]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.cloud.init({
    //   env: 'cqu-se-06class-f9b488', //确认云环境ID
    //   traceUser: true,
    // })
    // const db = wx.cloud.database()

    // //-------------------------------------------拉取生活帖部分内容
    // db.collection('Posts').where({
    //   done: false,        //筛选条件为仍未结帖的帖子
    //   type: 'lifePosts'    //并且是生活帖
    // }).get({
    //   success: res => {
    //     this.setData({
    //       //   num:0,
    //       recList: res.data,  //将查询结果的所有信息都扔给academic_recList
    //     })
    //     console.log('[数据库] [查询记录] 成功: ', res)
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //     console.error('[数据库] [查询记录] 失败：', err)
    //   },
    // });
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