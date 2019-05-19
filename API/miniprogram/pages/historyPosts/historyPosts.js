// pages/indexAcademic/indexAcademic.js
const app = getApp();
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    acaList: [],
    typeIndex: 0,
    typeList: ['学术帖', '生活帖'],
    dbtype:['academicPosts','lifePosts'],
    type: '',
    pagenum:20
  },

  navTo: function (e) {
    var that = this;
    var userobj = {
      name: that.data.acaList[e.currentTarget.dataset.index].postername,
      head: that.data.acaList[e.currentTarget.dataset.index].posterhead
    }
    wx.setStorage({
      key: 'postdata',
      data: that.data.acaList[e.currentTarget.dataset.index],
      success: function () {
        wx.setStorage({
          key: 'userInfo',
          data: userobj
        })
      },
      fail:err=>{
        console.log(err)
      }
    })

  },
  /**
   * 删帖
   */
  postDelete:function(e){
    console.log(e);
    var that = this
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor:'red',
      success:res=>{
        wx.showModal({
          title: '提示',
          content: '是否删除',
          success:res=>{
            if(res.confirm){
              let temid = this.data.acaList[e.currentTarget.dataset.index]._id;
              wx.cloud.database().collection('Posts').doc(temid).remove({
                success:function(){
                  wx.showToast({
                    title: '删除成功',
                    success:function(){
                      that.onLoad();
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  /**
   * 选择帖子类型更新数据
   */
  ensureSelect: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面出现
   */
  onLoad: function (options) {
    var tempRes = [];
    var that = this;
    //获取本人发的所有帖子
    db.collection('Posts').where({
      type: that.data.dbtype[that.data.typeIndex],
      _openid: app.globalData.openid
    }).orderBy('startDate', 'desc').get({
      success: res => {
        console.log(res)
        tempRes = res.data;
        //如果数组长度为0，即没有发帖纪录
        if (tempRes.length === 0) {
          that.setData({
            acaList: tempRes  //将空数组赋值给列表渲染数组
          })
        }
        //不为0则添加其他信息
        tempRes.forEach(function (value, index, self) {
          db.collection('userInfo').doc(value._openid).get({
            success: res => {
              self[index].postername = res.data.username;
              self[index].posterhead = res.data.userhead;
              that.setData({
                acaList: tempRes  //将查询结果的所有信息都扔给academic_recList
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
    //拉取帖子
    this.postSearch();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    //接收刷新出的数组，然后合并到原数组，实现加载
    var tempRes;
    //拉取帖子
    db.collection('Posts').where({
      type: that.data.dbtype[that.data.typeIndex],
      _openid:app.globalData.openid
      //分页拉取20条
    }).orderBy('startDate', 'desc').skip(that.data.pagenum).get({
      success: res => {
        tempRes = res.data;
        //完善数组内容
        tempRes.forEach(function (value, index, self) {
          db.collection('userInfo').doc(value._openid).get({
            success: res => {
              console.log(res)
              self[index].postername = res.data.username;
              self[index].posterhead = res.data.userhead;
              console.log(index)
              that.setData({
                //分页数加一，数组加长
                pagenum: that.data.pagenum + 20,
                acaList: that.data.acaList.concat(tempRes)
              })
            },
            fail: err => {
              console.log(err)
            }
          })
        })
        console.log('[学术帖] [查询记录] 成功: ', res)
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})