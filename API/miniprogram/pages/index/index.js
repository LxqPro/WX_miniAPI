//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data:{
    num: 0,     //三个导航项的序号
    pageIndex: 0,  //
    recList:[], //用于记录帖
  },
  //点击某个导航触发的事件
  navigateTo:function(e){
    this.setData({
      num: e.currentTarget.dataset.num
    })
    
  },
  //查看帖子详情
  toDetail:function(e){
    var that = this;
    var userobj = {
      name: that.data.recList[e.currentTarget.dataset.index].postername,
      head: that.data.recList[e.currentTarget.dataset.index].posterhead
    }
    wx.setStorage({
      key: 'postdata',
      data: that.data.recList[e.currentTarget.dataset.index],
      success: function () {
        wx.setStorage({
          key: 'userInfo',
          data: userobj
        })
      }
    })
  },
  onShow:function(){
    var tempRes = [];
    var that = this;
    db.collection('Posts').skip(that.data.pageIndex).orderBy('startDate', 'desc').where({
      status:'waiting',         //筛选条件为仍未结帖的帖子
      type:'lifePosts'
    }).get({
      success: res => {
        tempRes = res.data;
        tempRes.forEach(function (value, index, self) {
          db.collection('userInfo').doc(value._openid).get({
            success: e => {
              self[index].postername = e.data.username;
              self[index].posterhead = e.data.userhead;
              that.setData({
                recList: tempRes  //将查询结果的所有信息都扔给academic_recList
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
      },
    });
    //还原点击的样式
    this.setData({
      num: 0
    });
  },
  onLoad:function(){
    var tempArr = wx.getStorageSync('userLabel')
    if(tempArr == ''){
      wx.setStorageSync('userLabel',[])
    }
    else{
      wx.setStorageSync('userLabel', tempArr)
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    this.setData({
      pageIndex: that.data.pageIndex+20
    })
    this.onShow();
  },
})

