// pages/update/update.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);

    if (options.id) {
      var id = options.id;
      this.setData({
        id: id
      });
    }
    wx.request({
      url: 'https://ldzandsmile.work:8443/ssm_shower/updateShowerRoomById',
      data: {
        id: this.data.id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.switchTab({
          url: '../index/index'
        })
      }
      
    })
  },
})