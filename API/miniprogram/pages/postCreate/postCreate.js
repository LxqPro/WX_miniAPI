// pages/postCreate/postCreate.js
const app=getApp();
const db = wx.cloud.database();  //获取数据库引用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school:'',
    academy:'',
    imgList:[],   //图片的临时文件路径
    creditList:[1,2,3,4,5],
    creditVal:1,   //悬赏的积分
    title:'',
    content:'',
    imgurl:[],  //图片的储存路径
    openid:'',
    type:'',
    oldcredit:0   //旧的用户积分
  },
  
  /**
   * 同步标题信息
   */
  titleSet:function(e){
    this.setData({
      title:e.detail.value
    });
  },
  /**
   * 同步内容信息
   */
  contentSet: function (e) {
    this.setData({
      content:e.detail.value
    });
  },
  /**
   * 选择图片
   */
  chooseImg:function(){
    var that = this;
    wx.chooseImage({
      success: function (res) {
        that.setData({
          imgList:res.tempFilePaths
        });
      }
    })
  },
  /**
   * 预览图片
   */
  previewImg:function(e){
    var that = this;
    wx.previewImage({
      current:e.currentTarget.dataset.src,
      urls: that.data.imgList,
    });
  },
  /**
   * 设置积分
   */
  creditChange:function(e){
    this.setData({
      creditVal:e.detail.value[0]+1
    });
  },
  /**
   * 发布帖子
   */
  postPublish:function(){
    var that = this;
    var date = new Date();  //获取系统当前日期
    var cloudPath;
    var pathArr=[];
    that.data.imgList.forEach(function(value,index){
      cloudPath = app.globalData.openid + '/' + Date.parse(date) + index + value.match(/\.[^.]+?$/)[0];
      wx.cloud.uploadFile({
        filePath: value, // 小程序临时文件路径
        cloudPath: cloudPath,
        success: res => {
        },
        fail: res => {
        }
      });
      pathArr[index]=cloudPath;
    })
    /**
     * 初始化帖子图片地址
     */
    this.setData({
      imgurl:pathArr
    })
  
    // doc(that.data.openid);
    db.collection('Posts').add({
      data: {
        type:that.data.type,  //帖子类型
        status: 'waiting',  //是否已被解决
        school: that.data.school, //学校
        academy: that.data.academy, //学院
        credits: that.data.creditVal,  //悬赏分
        title: that.data.title,   //帖子标题
        content: that.data.content,  //帖子内容
        startDate: date,  //帖子上传时间
        imgurl:that.data.imgurl  //帖子关联图片的id
      },
      success(res) {
        wx.showToast({
          title: '上传成功'
        });
        //修改用户积分
        let userdb = db.collection('userInfo').doc(app.globalData.openid);
        userdb.get({
          success:res=>{
            that.setData({
              oldcredit:res.data.usercredit
            });
            userdb.update({
              data: {
                usercredit: that.data.oldcredit - that.data.creditVal
              }
            })
          }
        });
        
        setTimeout(function () {
          wx.navigateBack()
        }, 1000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      school: options.school,
      academy: options.academy,
      type: options.type
    });
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