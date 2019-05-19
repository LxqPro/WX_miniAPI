// pages/indexOthers/indexOthers.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    otherList:[],
    pageIndex:0
  },
  /**
   * 寻找数组不同元素的个数
   */
  findComplex: function (arr) {
    var now, old;
    var complex = 1;
    now = arr[0];
    old = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] != now && arr[i] != old) {
        complex++;
        old = now;
        now = arr[i];
      }
    }
    return complex;
  },
  /**
   * 数组arr从index处向前移动一个位置，最后一个空位用value补齐
   */
  moveForward: function (arr, index, value) {
    for (let i = index; i < arr.length; i++) {
      if (i != arr.length - 1) {
        arr[i] = arr[i + 1]
      }
      else {
        arr[i] = value;
      }
    }
  },
  /**
   * 点击跳转
   */
  navTo:function(e){
    console.log(e);
    var that = this;
    var userobj = {
      name: that.data.otherList[e.currentTarget.dataset.index].postername,
      head: that.data.otherList[e.currentTarget.dataset.index].posterhead
    }
    var userLabel = wx.getStorageSync('userLabel');
    var thisSchool = that.data.otherList[e.currentTarget.dataset.index].school;
    var tempArr;
    var fence = 0;
    /**
     * 无论即将入队的值在以前队列里面有没有，都先试探性从首部入队，
     * 如果入队后队列不相同元素个数大于三，则从下一个与队首元素不
     * 同的地方开始前移，同样以此类推，直到从某个地方开始前移后队
     * 列不同元素个数小于等于3
     * 在app.js里实现了寻找队列复杂度（不同元素个数）的算法，这里只需要调用
     */
    if(userLabel.length===0){
      for(let i=0;i<5;i++){
        userLabel[i] = thisSchool
      }
      wx.setStorageSync('userLabel', userLabel);
    }
    else{
      while (true) {
        tempArr = userLabel.concat();
        that.moveForward(tempArr, fence, thisSchool);
        if (that.findComplex(tempArr) <= 3) {
          break;
        }
        else {
          //如果插入后复杂度大于3，则把栅栏后移到第一个与上一个栅栏处值不同的地方
          for (let i = fence + 1; i < tempArr.length; i++) {
            if (tempArr[fence] != tempArr[i]) {
              fence = i;
              break;
            }
          }
        }
      }
      wx.setStorageSync('userLabel', tempArr);
    }

    wx.setStorage({
      key: 'postdata',
      data: that.data.otherList[e.currentTarget.dataset.index],
      success: function () {
        wx.setStorage({
          key: 'userInfo',
          data: userobj
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    var that = this;
    var tempRes = [];
    var mySchool = wx.getStorageSync('myself').userschool;
    const cmd = db.command;
    var userLabel = wx.getStorageSync('userLabel');
    if(userLabel.length===0){
      db.collection('Posts').orderBy('startDate', 'desc').limit(15).where({
        school: cmd.neq(mySchool)
      }).get({
        success: res => {
          tempRes = res.data;
          //如果数组长度为0，即没有帖子
          if (tempRes.length === 0) {
            that.setData({
              otherList: tempRes
            })
          }
          tempRes.forEach(function (value, index, self) {
            db.collection('userInfo').doc(value._openid).get({
              success: res => {
                self[index].postername = res.data.username;
                self[index].posterhead = res.data.userhead;
                that.setData({
                  otherList: tempRes  //将查询结果的所有信息都扔给academic_recList
                })
              }
            })
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
        },
      });
    }
    else{
      console.log('yyy')
      var slot = [{
        name:'',
        freq:0
      },{
        name:'',
        freq:0
      },{
        name: '',
        freq: 0
      }];
      //初始化槽
      userLabel.forEach(function(value,index){
        for(let i=0;i<slot.length;i++){
          if(slot[i].name === value){
            slot[i].freq++;
            break;
          }
          else if(slot[i].name === ''){
            slot[i].name = value;
            slot[i].freq = 1;
            break;
          }
        }
      })
      //根据用户喜好拉取数据
      for(let k=0;k<3;k++){
        if (slot[k].freq>0){
          db.collection('Posts').orderBy('startDate', 'desc').limit(2 * slot[k].freq).where           ({
            school: slot[k].name
          }).get({
            success: res => {
              tempRes = tempRes.concat(res.data);
              //如果数组长度为0，即没有帖子
              if (tempRes.length === 0) {
                that.setData({
                  otherList: tempRes
                })
              }
              tempRes.forEach(function (value, index, self) {
                db.collection('userInfo').doc(value._openid).get({
                  success: res => {
                    self[index].postername = res.data.username;
                    self[index].posterhead = res.data.userhead;
                    that.setData({
                      otherList: tempRes  //将查询结果的所有信息都扔给academic_recList
                    })
                  }
                })
              })
            }
          })
        }
      }
      //再拉五条额外的
      db.collection('Posts').skip(that.data.pageIndex).limit(5).where({
        school: cmd.and(cmd.neq(mySchool),cmd.neq(slot[0].name),cmd.neq(slot[1].name),cmd.neq(slot[2].name))
      }).get({
        success: res => {
          tempRes = tempRes.concat(res.data);
          //如果数组长度为0，即没有帖子
          if (tempRes.length === 0) {
            that.setData({
              otherList: tempRes
            })
          }
          tempRes.forEach(function (value, index, self) {
            db.collection('userInfo').doc(value._openid).get({
              success: res => {
                self[index].postername = res.data.username;
                self[index].posterhead = res.data.userhead;
                that.setData({
                  otherList: tempRes  //将查询结果的所有信息都扔给academic_recList
                })
              }
            })
          })
        }
      })
    }
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
    var that = this;
    this.setData({
      otherList:[],
      pageIndex:that.data.pageIndex+5
    })
    this.onLoad();
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