// pages/order/order.js
const app = getApp()

var util = require('../../utils/util.js');  

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectMeetingRoom: [],
    selectTime: [{
      "id": "1",
      "name": "08:00"
    }, {
      "id": "2",
       "name": "09:00"
    }, {
      "id": "3",
      "name": "10:00"
    }, {
      "id": "4",
      "name": "11:00"
    }, {
      "id": "5",
      "name": "12:00"
    }, {
      "id": "6",
      "name": "13:00"
    }, {
      "id": "7",
      "name": "14:00"
    }, {
      "id": "8",
      "name": "15:00"
    }, {
      "id": "9",
      "name": "16:00"
    }, {
      "id": "10",
      "name": "17:00"
    }, {
      "id": "11",
      "name": "18:00"
    }],
    
    meetingRoom : {
      "id": "1",
      "text": '会议室一'
      },
    startTimt: {
      "id": "1",
      "text": "08:00"
    },
    endTime: {
      "id": "2",
      "text": "09:00"
    },
    startDay: '2019-1-1',
    endDay: '2019-1-1',
    day: '2019-1-1',

    //用户信息，是否授权
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log(this.data.startDay + ' ' + this.data.endTime.text);

    var that = this;
    //判断开始时间 < 结束时间 且添加前缀
    if(parseInt(this.data.startTimt.id) - parseInt(this.data.endTime.id) >= 0){
      wx.showToast({
        title: '时间不正确',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
    } else {
      if (e.detail.value.contents == "" || e.detail.value.host == "" || e.detail.value.organizer == "" || e.detail.value.participants == ""){
        wx.showToast({
          title: '内容不能为空',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      } else {
        //提交预约请求
        wx.request({
          url: 'https://ldzandsmile.work:8443/ssm_meeting/insertOrders',
          data: {
            username: that.data.userInfo.nickName,
            start: that.data.startDay + ' ' + that.data.startTimt.text,
            end: that.data.startDay + ' ' + that.data.endTime.text,
            meetingroom: that.data.meetingRoom.text,
            host: e.detail.value.host,
            contents: e.detail.value.contents,
            participants: e.detail.value.participants,
            organizer: e.detail.value.organizer,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.showToast({
              title: '预约成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          },
          fail: function (err) {
            console.log(err);
          }
        })
      }
    }
  },

  back(){
    wx.switchTab({
      url: '../index/index'
    })
  },

  setMeetingRoom: function (e) {
    console.log(e.detail);
    this.setData({
      meetingRoom: e.detail
    })
  },

  setStartTime: function (e) {
    console.log(e.detail);
    this.setData({
      startTime: e.detail
    })
  },

  setEndTime: function (e) {
    console.log(e.detail);
    this.setData({
      endTime: e.detail
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    wx.request({
      url: 'https://ldzandsmile.work:8443/ssm_meeting/selectMeetingRoomList',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          selectMeetingRoom: res.data.extend.meetingRoomList
        });
      },
      fail: function (err) {
        console.log(err);
      }
    })

    //获取登录信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          console.log(res.userInfo);
        }
      })
    }

    let startDay = util.formatDay(new Date());
    let endDay = util.formatDay(new Date(Date.parse(new Date()) + 6*24*60*60*1000));
    
    this.setData({
      startDay: startDay,
      endDay: endDay,
      day:startDay
    })
  },

  bindDateChange(e) {
    console.log('aa');
    this.setData({
      day: e.detail.value
    })
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