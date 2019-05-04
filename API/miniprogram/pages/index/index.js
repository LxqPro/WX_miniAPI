//index.js
const app = getApp()
Page({
  data:{
    num: 0,     //三个导航项的序号
    number: 6,  //显示在推荐帖区域中的帖子数目
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
    const db = wx.cloud.database()
    //-------------------------------------------拉取帖子内容
    var tempRes = [];
    var that = this;
    db.collection('Posts').where({
    // status:'waiting'         //筛选条件为仍未结帖的帖子
    }).get({
      success: res => {
        console.log(res.data)
        tempRes = res.data;
        tempRes.forEach(function (value, index, self) {
          db.collection('userInfo').doc(value._openid).get({
            success: res => {
              self[index].postername = res.data.username;
              self[index].posterhead = res.data.userhead;
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

  }
})
