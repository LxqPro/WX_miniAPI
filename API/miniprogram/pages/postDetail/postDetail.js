Page({

  /**
   * 页面的初始数据
   */
  data: {
    // outschool_recList:[],
    recList:[],
    isReply:false,
    id:'',
  },
  // 控制回复框出现
  replybutton:function(e){
    this.setData({
      isReply:true,
    })
  },
  // 发送回复内容给数据库
  formSubmit(e) {
    //云开发初始化
    wx.cloud.init({
      env: 'cqu-se-06class-f9b488', //确认云环境ID
      traceUser: true,
    })

    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    console.log(e.detail.value)
    db.collection('Posts').doc(this.data.id).update({
      data:{
        reply: e.detail.value,
      },
      success: res => {
        console.log('[数据库] [回复] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [回复] 失败：', err)
      },
    });
//把回复隐藏
    this.setData({
      isReply: false,
    })
  },


  onLoad: function (options) {
    
    wx.cloud.init({
      env: 'cqu-se-06class-f9b488', //确认云环境ID
      traceUser: true,
    })
    const db = wx.cloud.database()

    db.collection('Posts').where({
      _id:options.title
    }).get({
      success: res => {
        this.setData({
          recList: res.data,  //将查询结果的所有信息都扔给academic_recList
          id:options.title,
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      },
    });
  }
})