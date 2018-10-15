var util = require('../../../utils/util.js')
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: '',
    movies: {},
    requesUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var category = options.category
    this.data.navigateTitle = category

    var base = app.globalData.doubanBase
    var dataUrl = ''
    switch (category) {
      case '正在热映':
        dataUrl = base + '/v2/movie/in_theaters'
        break
      case '即将上映':
        dataUrl = base + '/v2/movie/coming_soon'
        break
      case 'Top 250':
        dataUrl = base + '/v2/movie/top250'
        break
    }

    this.data.requesUrl = dataUrl
    util.http(dataUrl, this.processDoubanData)
  },

  /**
   * 下拉加载更多电影数据
   */
  // onScrollLower: function(event) {
  //   var nextUrl = this.data.requesUrl + '?start=' + this.data.totalCount + '&count=20'

  //   util.http(nextUrl, this.processDoubanData)
  //   wx.showNavigationBarLoading()
  // },

  /**
   * 请求成功数据处理回调函数
   */
  processDoubanData: function(moviesDouban) {
    var movies = []
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx]
      var title = subject.title

      // 限制电影标题长度
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...'
      }

      var temp = {
        movieId: subject.id,
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        stars: util.convertToStarsArray(subject.rating.stars)
      }
      movies.push(temp)
    }

    var totalMovies = {}
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }
    this.setData({
      movies: totalMovies
    })

    this.data.totalCount += 20
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(event) {
    wx.setNavigationBarTitle({
      // 动态设置当前标题
      title: this.data.navigateTitle
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var nextUrl = this.data.requesUrl + '?start=0&count=20'

    this.data.movies = {}
    this.data.isEmpty = true
    this.data.totalCount = 0
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  /**
   * 下拉加载更多电影数据
   */
  onReachBottom: function(event) {
    var nextUrl = this.data.requesUrl + '?start=' + this.data.totalCount + '&count=20'

    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  }
})