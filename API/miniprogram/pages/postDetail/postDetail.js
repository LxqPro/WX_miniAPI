const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    postId:'',   //标识帖子的主键
    userHead: '', //用户头像
    postStatus: '', //帖子状态
    username: '', //用户名
    postCredit:0, //帖子积分
    postDate: '', //帖子上传时间
    postTitle: '', //帖子标题
    postContent: '', //帖子内容
    postImg: [],  //帖子的图片
    postSchool:'',  //帖子所属学校
    postAcademy:'', //帖子所属学院
    postComment:[],  //帖子评论
    senderName:'',  //发帖人姓名
    senderHead:[],  //发帖人头像
    isTapReply:false,  //是否进入写回复界面
    chooseList:[],  //评论时选择的图片
    replyContent:'',   //回复内容
    commentList:[], //评论列表
    prefix:'',  //图片地址的前缀
    prevlock:true, //预览图片地址
    canIadopt:false,  //是否被采纳
    isDisabled:false  //采纳按钮是否禁用,默认可用
  },
  
  // 编辑评论
  post:function(){
    this.setData({
      isTapReply:true
    })
  },
  //发表评论
  push:function(){
    var that = this;
    wx.showLoading({
      title: '发表中',
      mask:true,
      success:function(){
        //保存图片到云储存
        var date = new Date();  //获取系统当前日期
        var cloudPath;
        var pathArr = [];
        that.data.chooseList.forEach(function (value, index) {
          cloudPath = app.globalData.openid + '/' + Date.parse(date) + index + value.match(/\.[^.]+?$/)[0];
          wx.cloud.uploadFile({
            filePath: value, // 小程序临时文件路径
            cloudPath: cloudPath,
            success: res => {
              
            },
            fail: res => {
            }
          });
          pathArr[index] = cloudPath;
        })
        //创建评论对象
        var commentObj = {
          content: that.data.replyContent,
          imgs: pathArr,
          sender: app.globalData.openid
        };
        //同步读取用户信息缓存，完善评论对象
        var myself = wx.getStorageSync('myself');
        // 由于读写权限，向非创建者写入需要调用云函数
        wx.cloud.callFunction({
          name: 'saveComment',
          data: {
            _id: that.data.postId,
            commentObj: commentObj
          },
          success: res => {
            commentObj.username = myself.username
            commentObj.userhead = myself.userhead
            that.data.commentList.push(commentObj)
            wx.hideLoading();
            that.setData({
              isTapReply: false,
              commentList:that.data.commentList
            })
          },
          fail: err => {
            console.log(err)
          }
        })
      }
    })
  },
  //返回
  cancel:function(){
    this.setData({
      isTapReply:false
    })
  },
  //选择图片
  chooseImg:function(){
    var that = this;
    wx.chooseImage({
      success: function (res) {
        that.setData({
          chooseList: res.tempFilePaths
        });
      }
    })
  },
  //预览图片（发帖区）
  previewImg:function(e){
    var that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: that.data.chooseList,
    });
  },
  //保存内容
  saveContent:function(e){
    this.setData({
      replyContent:e.detail.value
    })
  },
  //预览图片（帖子详情）
  previewpost:function(e){
    var that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: that.data.postImg,
    })
  },
  //预览图片(评论区)
  preview:function(e){
    var that = this;
    var srcs = this.data.commentList[e.currentTarget.dataset.index].imgs
    //只执行一次
    if(this.data.prevlock){
      srcs.forEach(function (value, index, array) {
        array[index] = that.data.prefix + value;
      })
      that.setData({
        prevlock:false
      })
    }
    wx.previewImage({
      current: that.data.prefix+e.currentTarget.dataset.src,
      urls:srcs
    });
  },
  //采纳回复
  adopt:function(e){
    var that = this;
    //将帖子状态改为已回复，并且禁用采纳按钮
    db.collection('Posts').doc(this.data.postId).update({
      data:{
        status:'success'
      },
      success:function(){
        that.setData({
          postStatus:'success',
          isDisabled:true
        })
      }
    })
    //增加被采纳评论者的积分(由于数据库读写权限，只能采用云函数进行)
    wx.cloud.callFunction({
      name: 'incCredit',
      data: {
        _id: e.currentTarget.dataset.commer,
        credit: that.data.postCredit
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
    console.log(e);
  },
  onLoad: function () {
    var that = this;
    this.setData({
      prefix: 'cloud://cqu-se-06class-f9b488.6371-cqu-se-06class-f9b488/'
    })
    var tempPath = [];
    var tempCom = [];
    //获取缓存中的postdata
    const data = wx.getStorageSync('postdata');
    const poster = wx.getStorageSync('userInfo');
    if(data._openid === app.globalData.openid){
      that.setData({
        canIadopt:true
      })
      if (data.status === 'success') {
        that.setData({
          isDisabled: true
        })
      }
    }
    if(data.imgurl!=undefined){
      tempPath = data.imgurl;
    }
    if (data.comments != undefined){
      tempCom = data.comments;
    }
    //将帖子图片的URL加上前缀，才能访问
    tempPath.forEach(function (value, index, arr) {
      arr[index] = that.data.prefix + value;
    })
    //当前的评论，信息不完整，需要加上评论者头像和名称
    tempCom.forEach(function (value, index, array) {
      db.collection('userInfo').doc(value.sender).get({
        success: res => {
          array[index].username = res.data.username;
          array[index].userhead = res.data.userhead;
          array[index].isIn = that.data.postSchool===res.data.userschool;
          //注意这里是异步API，需要写在回调函数
          that.setData({
            commentList: tempCom
          });
        }
      })
    })
    that.setData({
      postId: data._id,
      postCredit:data.credits,
      postStatus: data.status,
      postDate: data.startDate.slice(5, 10),
      postTitle: data.title,
      postContent: data.content,
      postSchool: data.school,
      postAcademy: data.academy,
      postImg: tempPath,
      username:poster.name,
      userHead:poster.head
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    db.collection('Posts').doc(wx.getStorageSync('postdata')._id).get({
      success:res=>{
        console.log(res)
        wx.setStorageSync('postdata', res.data)
        that.onLoad();
      }
    })
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
})