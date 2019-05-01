// pages/completeInform/completeInform.js


Page({
  data: {
    user_name: '',
    user_schoolid: '',
    user_school: '',
    user_academy: '',
    school: [' ', '重庆大学', '清华大学', '野鸡大学','甜蜜高校'],
    schoolindex: 0,
    academy: [' ', '大数据与软件学院', '法学院', '计算机学院', '生物工程学院','冯焱华学院'],
    academyindex: 0,

    //临时变量 
    temp_user_name: '',
    temp_user_schoolid: '',
    temp_user_school: '',
    temp_user_academy: '', 
    temp_user_schoolIndex: 0,
    temp_user_academyIndex: 0,
  },

//选择学校
  bindPickerSchool:function(e){
    this.setData({
      schoolindex: e.detail.value,
      temp_user_school: this.data.school[e.detail.value],
      temp_user_schoolIndex: e.detail.value,
    })
     var app = getApp();
     app.globalData.schoolindex=e.detail.value;
    // app.globalData.user_school=this.data.school[e.detail.value];

  },

//姓名
  bindInputName:function(e){
    this.setData({
      temp_user_name:e.detail.value
    })
    console.log(e.detail.value)
  },
  // 学号
  bindInputSchoolid:function(e){
    this.setData({
      temp_user_schoolid: e.detail.value
    })
  },
  //学院
  bindPickerAcademy:function(e){
    this.setData({
      academyindex: e.detail.value,
      temp_user_academy : this.data.academy[e.detail.value],
      temp_user_academyIndex: e.detail.value,
    })
     var app = getApp();
     app.globalData.academyindex=e.detail.value;
    // app.globalData.user_academy = this.data.academy[e.detail.value];
    
  },

  //保存信息
  SaveInfo:function(e){
    
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认修改信息',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          var app = getApp();
          if (that.data.temp_user_academy) {
            app.globalData.user_academy = that.data.temp_user_academy;
          }
          if (that.data.temp_user_schoolid) {
            app.globalData.user_schoolid = that.data.temp_user_schoolid;
          }
          if (that.data.temp_user_name) {
            app.globalData.user_name = that.data.temp_user_name;
          }
          if (that.data.temp_user_school) {
            app.globalData.user_school = that.data.temp_user_school;
          }
          // 保存信息后返回上1页面
          wx.navigateBack({
          })
        } else {//这里是点击了取消以后

        }
      }
    })
   
       //------------------------------------------------------------在userInfo中添加一条记录
  
    const db = wx.cloud.database()  //获取数据库引用

    db.collection('userInfo').doc(that.data.openid).set({
      data: {
        username: that.data.temp_user_name,
        studentID: that.data.temp_user_schoolid,
        school: that.data.temp_user_school,
        academy: that.data.temp_user_academy,
        schoolIndex: that.data.temp_user_schoolIndex,
        academyIndex: that.data.temp_user_academicIndex,
        point: 0,
      },
      success(res) {
        console.log('牛逼')
        // console.log(that.data.openid)
      }
    })   
  },
  onShow: function () {
    var app = getApp();
    this.setData({
      // 在页面展示之后先获取一次数据
      user_school: app.globalData.user_school,
      user_academy: app.globalData.user_academy,
      user_name: app.globalData.user_name,
      user_schoolid: app.globalData.user_schoolid,
      schoolindex:app.globalData.schoolindex,
      academyindex:app.globalData.academyindex,
      /*给冯哥擦屁股的代码 */
      temp_user_name: app.globalData.user_name,
      temp_user_schoolid: app.globalData.user_schoolid ,
      temp_user_school: app.globalData.user_school ,
      temp_user_academy: app.globalData.user_academy,
      
    });
    console.log(app.globalData)
  },
  
})