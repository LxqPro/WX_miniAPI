// pages/indexAcademic/indexAcademic.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName: '',
    academyName:'',
    academyIndex: -1,
    academyList: ['------','大数据与软件学院', '法学院', '计算机学院', '生物工程学院', '冯焱华学院', '王天岗学院'],
    acaList: [],
    postList: [],
    type:'academicPosts',
    pagenum:0
  },

  /**
   * 选择学院更新数据
   */
  ensureSelect: function (e) {
    this.setData({
      academyIndex: e.detail.value
    })
    this.onLoad()
  },
  /**
   * 跳转页面并缓存数据
   */
  navTo:function(e){
    var that = this;
    var userobj = {
      name: that.data.acaList[e.currentTarget.dataset.index].postername,
      head: that.data.acaList[e.currentTarget.dataset.index].posterhead
    }
    wx.setStorage({
      key: 'postdata',
      data: that.data.acaList[e.currentTarget.dataset.index],
      success:function(){
        wx.setStorage({
          key: 'userInfo',
          data: userobj
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面出现
   * 读取缓存，如果是以发帖状态返回，则刷新页面
   */
  onShow() {
    var res = wx.getStorageSync('postCreate');
    if (res == 1) {
      wx.setStorage({
        key: 'postCreate',
        data: 0,
        success:res=>{
          this.onLoad()
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面出现
   */
  onLoad: function (options) {
    //如果未登录，提示去登录
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '未登录',
        content: '请先登录',
        confirmText: '立即登录',
        cancelColor: '#ff0000',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '../userInfo/userInfo',
            })
          }
          else if (res.cancel) {
            console.log(app.globalData)
          }
        }
      })
    }
    else{
      //拉取学术帖部分内容
      var tempRes = [];
      var that = this;
      /**
       * 初始化页面个人信息
       */
      wx.getStorage({
        key: 'myself',
        success: function(res) {
          var resData = res.data;
          console.log(resData)
          //实现查看其他学院帖子功能
          if (that.data.academyIndex == -1) {
            that.setData({
              academyIndex: app.getIndex(that.data.academyList, resData.useracademy),
            })
          }
          console.log()
          
          if(resData.userschool=='------'||resData.useracademy=='------'){
            console.log(resData)
            wx.showModal({
              title: '无数据',
              content: '请先完善个人信息',
              confirmText:'去完善',
              confirmColor:'#0000ff',
              showCancel:false,
              success:res=>{
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../completeInform/completeInform',
                  })
                }
                else if (res.cancel) {
                  console.log(app.globalData)
                }
              }
            })
          }
          else {
            that.setData({
              schoolName: resData.userschool,
              pagenum: 20
            })
          }
          console.log(that.data)
          //拉取本校的当前学院的学术帖
          db.collection('Posts').where({
            type: 'academicPosts',    //学术帖
            school: that.data.schoolName,   
            academy: that.data.academyList[that.data.academyIndex]
          }).orderBy('startDate', 'desc').get({
            success: res => {
              tempRes = res.data;
              //如果数组长度为0，即没有该类型帖子
              if (tempRes.length === 0) {
                that.setData({
                  acaList: tempRes  //将查询结果的所有信息都扔给academic_recList
                })
              }
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
      })
    }
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
    this.onLoad()
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
      type: 'academicPosts',    //学术帖
      school: that.data.schoolName,
      academy: that.data.academyList[that.data.academyIndex]
      //分页拉取20条
    }).orderBy('startDate','desc').skip(that.data.pagenum).get({
      success: res => {
        tempRes = res.data;
        //完善数组内容
        tempRes.forEach(function (value, index, self) {
          console.log(index)
          db.collection('userInfo').doc(value._openid).get({
            success: res => {
              console.log(res)
              self[index].postername = res.data.username;
              self[index].posterhead = res.data.userhead;
              console.log(index)
              that.setData({
                //分页数加一，数组加长
                pagenum:that.data.pagenum+20,
                acaList: that.data.acaList.concat(tempRes)  
              })
            },
            fail:err=>{
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