/**
 * 星级评分 [1, 1, 1, 1, 1], [1, 1, 1, 0, 0]
 */
function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1)
  var array = []

  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }

  return array
}

/**
 * http请求
 */
function http(url, callback) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-Type': 'application/text'
    },
    success: ((res) => {
      callback(res.data)
    })
  })
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http
}