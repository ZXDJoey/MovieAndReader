var util = require('../../utils/util.js')
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inTheater: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var base = app.globalData.doubanBase
    var inTheaterUrl = base + '/v2/movie/in_theaters' + '?start=0&count=3'
    var comingSoonUrl = base + '/v2/movie/coming_soon' + '?start=0&count=3'
    var top250Url = base + '/v2/movie/top250' + '?start=0&count=3'

    this.getMovieListData(inTheaterUrl, 'inTheater', '正在热映')
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映')
    this.getMovieListData(top250Url, 'top250', 'Top 250')
  },

  // 请求电影数据
  getMovieListData: function (url, settedKey, categoryTitle) {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/text'
      },
      success: ((res) => {
        this.processDoubanData(res.data, settedKey, categoryTitle)
      })
    })
  },

  // 处理需要电影数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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

    var readyData = {}
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }

    this.setData(readyData)
  },

  // 更多电影
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category

    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },

  // 关闭搜索页面
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },

  // 显示搜索页面
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  // 搜索
  onBindChange: function (event) {
    var text = event.detail.value
    var base = app.globalData.doubanBase
    var searchUrl = base + '/v2/movie/search?q=' + text

    this.getMovieListData(searchUrl, 'searchResult', '')
  }
})