//index.js
//获取应用实例
const app = getApp()

var util = require('../../utils/util.js');  

Page({
  data: {
    //所有时间点
    timeList: [
      "08:00-09:00",
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "13:00-14:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
      "17:00-18:00",
    ],

    //显示的集合
    showList: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],

    //周几
    weekList: [],

    //会议室集合
    meetingRoomList: [],

    //一个会议室 接下来一周 预约时间集合
    orderArray: [[],[],[],[],[],[],[]],

    //选中的会议室名
    selectMeetingRoomName: '会议室一',

    //用户信息，是否授权
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  setMeetingRoom(e){
    var that = this;

    this.setData({
      selectMeetingRoomName: e.detail.text
    })

    //刷新预约信息
    wx.request({
      url: 'https://ldzandsmile.work:8443/ssm_meeting/selectOrdersNextWeek',
      data: {
        'meetingroom': that.data.selectMeetingRoomName,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let array = [[], [], [], [], [], [], []];
        for (let i = 0; i < 7; i++) {
          array[i] = res.data.extend.orderArray[i];
        }
        that.setData({
          orderArray: array,
        });
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  //预约
  orderBtn(e) {
    console.log("s");
    wx.redirectTo({
      url: '../order/order'
    })
    console.log("ss");
  },


  onShow: function () {
    var that = this;

    //获取所有会议室信息
    wx.request({
      url: 'https://ldzandsmile.work:8443/ssm_meeting/selectMeetingRoomList',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let list = [];
        for (let i = 0; i < res.data.extend.meetingRoomList.length; i++) {
          list[i] = res.data.extend.meetingRoomList[i].name;
        }

        that.setData({
          selectData: list,
          meetingRoomList: res.data.extend.meetingRoomList
        });
      },
      fail: function (err) {
        console.log(err);
      }
    })

    //显示当前会议室预约信息
    wx.request({
      url: 'https://ldzandsmile.work:8443/ssm_meeting/selectOrdersNextWeek',
      data: { 
        'meetingroom': that.data.selectMeetingRoomName,
      },
      header: {},
      success: function (res) {
        let array = [[], [], [], [], [], [], []];
        for(let i=0;i<7;i++){
          array[i] = res.data.extend.orderArray[i]; 
        }
        that.setData({
          orderArray: array,
          weekList: res.data.extend.week,
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
    
  }
})
