var postsData = require('../../../data/posts-data.js')
var app = getApp()

Page({
  data: {
    isPlayingMusic: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var postId = options.id
    this.data.currentPostId = postId
    var postData = postsData.postList[postId]

    this.setData({
      postData: postData
    })

    // 读取收藏状态缓存
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync('posts_collected', postsCollected)
    }
    
    if (app.globalData.g_isPlayingMusic && app.globalData.g_isPlayingMusic === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setAudioMonitor()
  },

  onCollectionTap: function(event) {
    var postsCollected = wx.getStorageSync('posts_collected')
    var postCollected = postsCollected[this.data.currentPostId]
    postCollected = !postCollected
    postsCollected[this.data.currentPostId] = postCollected
    // // 更新收藏状态
    // wx.setStorageSync('posts_collected', postsCollected)
    // // 更新数据绑定，实现图标切换
    // this.setData({
    //   collected: postCollected
    // })
    // wx.showToast({
    //   title: postCollected ? '收藏成功' : '取消收藏'
    // })
    this.showToast(postsCollected, postCollected)
  },

  // 提示是否收藏消息框
  showToast: function(postsCollected, postCollected) {
    // 更新收藏状态
    wx.setStorageSync('posts_collected', postsCollected)
    // 更新数据绑定，实现图标切换
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏'
    })
  },

  // 音乐播放
  onMusicTap: function(event) {
    var backgroundAudioManager = wx.getBackgroundAudioManager()
    var isPlayingMusic = this.data.isPlayingMusic
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId]

    // console.log(currentPostId)

    if (isPlayingMusic) {
      // 暂停
      backgroundAudioManager.pause()

      this.setData({
        isPlayingMusic: false
      })
    } else {
      backgroundAudioManager.title = postData.music.title
      backgroundAudioManager.coverImgUrl = postData.music.coverImg
      backgroundAudioManager.src = postData.music.url

      this.setData({
        isPlayingMusic: true
      })
    }
  },

  setAudioMonitor: function() {
    // 总控音乐播放
    wx.getBackgroundAudioManager().onPlay(() => {
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_isPlayingMusic = this.data.currentPostId
    })

    // 总控音乐暂停
    wx.getBackgroundAudioManager().onPause(() => {
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_isPlayingMusic = null
    })

    // 音乐停止
    wx.getBackgroundAudioManager().onStop(() => {
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_isPlayingMusic = null
    })
  }
})