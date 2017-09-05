const cheerio = require('cheerio')
// const html = require('../../../test-html.js')
const moment = require('moment')

function parseMutual (mfStr) {
  var numMutual = 0
  if (mfStr.indexOf('other mutual friends') > -1) {
    numMutual = mfStr.split(' ')
    var index = numMutual.length - 4
    numMutual = parseInt(numMutual[index]) + 1
  } else if (mfStr.indexOf('are mutual friends') > -1) {
    numMutual = 2
  } else if (mfStr.indexOf('is a mutual friend') > -1) {
    numMutual = 1
  }
  return numMutual
}

export const parsePymk = (html) => {
  const $ = cheerio.load(html)
  return $('li.friendBrowserListUnit').toArray().map(el => {
    const name = $('div.friendBrowserNameTitle', el).children('a').text()
    const url = $('div.friendBrowserNameTitle', el).children('a').attr('href').replace('&hc_location=friend_browser&fref=pymk', '')
    const mfStr = $('.friendBrowserSocialContext', el).children('span').contents().text()
    const mutualFriends = parseMutual($('.friendBrowserSocialContext', el).children('span').contents().text())
    const job = $('.friendBrowserMarginTopMini', el).contents().text()
    const session = moment().format()
    return {name, url, mfStr, mutualFriends, job, session}
  })
}