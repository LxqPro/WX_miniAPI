// pages/indexAcademic/indexAcademic.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName: '',
    academyName: '',
    academyList: ['大数据与软件学院', '计算机学院', '自动化学院', '微电子与通信学院'],
    acaList: [],
    postList: []
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
   * 生命周期函数--监听页面出现
   */
  onShow: function (options) {
    const db = wx.cloud.database()
    //-------------------------------------------拉取生活帖部分内容
    db.collection('Posts').where({
      type: 'academicPosts'    //学术帖
    }).get({
      success: res => {
        this.setData({
          acaList: res.data  //将查询结果的所有信息都扔给academic_recList
        })
        console.log('[学术帖] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      },
    });
    /**
     * 初始化页面个人信息
     */
    db.collection('userInfo').where({
       _openid:app.globalData.openid
    }).get({
      
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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