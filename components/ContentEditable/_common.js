import twemoji from 'twemoji'

export default {
  /**
   * Returns unicode value from string with <img>'s tags
   * @param {String} value
   * @returns {String}
   */
  parseToString (value) {
    const imagesList = getImagesList(value)
    for (let i = 0; i < imagesList.length; i++) {
      const emoji = this.getAttrValue('alt', imagesList[i])
      value = value.replace(imagesList[i], emoji)
    }
    value = escapeHtml(value)
    return value
  },
  /**
   * Parse value and split it on text and image content
   * @param {String} data
   * @returns {Array}
   */
  getSplittedContent (data) {
    data = twemoji.parse(data)
    const imageList = getImagesList(data)
    const imgKey = '[[img]]'
    const splitter = '[[/]]'
    let imageCounter = 0

    for (let i = 0; i < imageList.length; i++) {
      data = data.replace(imageList[i], splitter + imgKey + splitter)
    }
    data = data.split(splitter)
    data = data.filter(el => el !== '')
    for (let i = 0; i < data.length; i++) {
      if (data[i] === imgKey) {
        data[i] = {
          img: imageList[imageCounter]
        }
        imageCounter++
      } else {
        data[i] = {
          text: data[i]
        }
      }
    }
    return data
  },
  /**
  * Returns attribute value from tag, represented as string
  * @param {String} attr
  * @param {String} tagString
  * @returns {String}
  */
  getAttrValue (attr, tagString) {
    const attribute = attr + '="'
    const beginning = tagString.indexOf(attribute) + attribute.length
    const content = tagString.slice(beginning, tagString.length)
    const ending = content.indexOf('"')
    return content.slice(0, ending)
  },
  /**
   * Returns string emoji's image tag
   * @param {String} emojiNative
   * @returns {String}
   */
  getEmojiImageTag (emojiNative) {
    return twemoji.parse(emojiNative)
  }
}

/**
 * Replace symbols and html tags to equivalent string values
 * @param {String} data
 * @returns {String}
 */
function escapeHtml (data) {
  const regexp = new RegExp('&nbsp;|<br>', 'g')
  return data.replace(regexp, ' ')
}
/**
 * Parses string and returns images array
 * @param {String} string
 * @returns {Array}
 */
function getImagesList (string) {
  const imageRegex = /<img[^>]* src="([^"]*)"[^>]*>/ig
  return string.match(imageRegex) || []
}
