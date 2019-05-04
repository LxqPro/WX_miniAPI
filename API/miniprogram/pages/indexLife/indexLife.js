// pages/indexLife/indexLife.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName: '',
    academyName: '',
    academyIndex: 0,
    academyList: ['大数据与软件学院', '法学院', '计算机学院', '生物工程学院', '冯焱华学院', '王天岗学院'],
    lifeList: [],
    postList: [],
    type:'lifePosts'
  },

  /**
   * 选择学院更新数据
   */
  ensureSelect: function (e) {
    this.setData({
      academyIndex: e.detail.value
    })
  },
  /**
   * 跳转页面并缓存数据
   */
  navTo: function (e) {
    var that = this;
    var userobj = {
      name: that.data.lifeList[e.currentTarget.dataset.index].postername,
      head: that.data.lifeList[e.currentTarget.dataset.index].posterhead
    }
    wx.setStorage({
      key: 'postdata',
      data: that.data.lifeList[e.currentTarget.dataset.index],
      success: function () {
        wx.setStorage({
          key: 'userInfo',
          data: userobj
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面出现
   */
  onShow: function (options) {
    //拉取学术帖部分内容
    var tempRes = [];
    var that = this;
    db.collection('Posts').where({
      type: 'lifePosts'    //学术帖
    }).get({
      success: res => {
        tempRes = res.data;
        tempRes.forEach(function (value, index, self) {
          db.collection('userInfo').doc(value._openid).get({
            success: res => {
              self[index].postername = res.data.username;
              self[index].posterhead = res.data.userhead;
              that.setData({
                lifeList: tempRes  //将查询结果的所有信息都扔给academic_recList
              })
            }
          })
        })
        console.log('[学术帖] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    /**
     * 初始化页面个人信息
     */
    db.collection('userInfo').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        let resData = res.data[0];
        this.setData({
          schoolName: resData.userschool,
          academyIndex: app.getIndex(this.data.lifeList, resData.useracademy),
        })
      }
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    db.collection('Posts').where({
      type: 'lifePosts'    //学术帖
    }).get({
      success: res => {
        this.setData({
          acaList: res.data  //将查询结果的所有信息都扔给acaList
        })
        console.log('刷新成功，nb!')
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    });

    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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