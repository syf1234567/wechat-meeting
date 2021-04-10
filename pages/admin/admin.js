// pages/admin/admin.js
//获取应用实例
const app = getApp()

var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //所有待审核信息
    orderList:[],

    //是否是管理员
    isAdmin: false,

    //未审核信息
    unauditedList: [],

    //用户信息，是否授权
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  unaudited(e) {
    wx.request({
      url: 'https://ldzandsmile.work:8443/ssm_meeting/examine',
      data: {
        id: e.target.dataset.id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
      },
      fail: function (err) {
        console.log(err);
      }
    })

    wx.reLaunch({
      url: 'admin',
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

    wx.request({
      url: 'https://ldzandsmile.work:8443/ssm_meeting/selectUserByName',
      data: {
        name: this.data.userInfo.nickName
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          isAdmin: res.data.extend.is_admin
        });

        wx.request({
          url: 'https://ldzandsmile.work:8443/ssm_meeting/selectOrdersByIsSuccess',
          data: {
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var list = res.data.extend.UnauditedList;
            for(let i=0;i<list.length;i++){
              list[i].startTime = util.formatTime(new Date(list[i].startTime));
              list[i].endTime = util.formatTime(new Date(list[i].endTime));
            }

            that.setData({
              unauditedList: list
            });
          },
          fail: function (err) {
            console.log(err);
          }
        })

      },
      fail: function (err) {
        console.log(err);
      }
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