var postsData = require('../../data/posts-data.js')

Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      postList: postsData.postList
    })
  },

  /**
   * 文章详情跳转
   */
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },

  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})