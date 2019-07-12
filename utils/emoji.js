import twemoji from 'twemoji'

export default {
  /**
   *
   */
  addInsideChildNodes (ref, data, caretPosition, emojiSize) {
    const childNodes = ref.childNodes
    const splittedContent = this.getSplittedContent(data)
    for (let i = 0; i < splittedContent.length; i++) {
      // text
      if (splittedContent[i].text) {
        if (childNodes.length === 0) {
          ref.append(splittedContent[i].text)
          return null
        }

        const combinedText = this.getCombinedNodeText(childNodes, caretPosition, splittedContent[i].text)
        childNodes[caretPosition.nodeIndex].data = combinedText
      // emoji
      } else if (splittedContent[i].img) {
        // this.appendEmoji(splittedContent[i].img, ref, emojiSize)
      }
    }

    debugger

    console.log(caretPosition, childNodes, splittedContent)
  },
  /**
   * Fill referenced area with parsed content
   * @param {String} text
   * @param {Object} ref Html reference
   * @param {Number} emojiSize
   */
  fillArea (text, ref, emojiSize) {
    const splittedContent = this.getSplittedContent(text)
    for (let i = 0; i < splittedContent.length; i++) {
      // text
      if (splittedContent[i].text) {
        ref.append(splittedContent[i].text)

      // emoji
      } else if (splittedContent[i].img) {
        this.appendEmoji(splittedContent[i].img, ref, emojiSize)
      }
    }
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
   * Append emoji to reference
   * @param {String} emoji Image tag
   * @param {Object} ref Html reference
   * @param {Number} emojiSize
   */
  appendEmoji (emoji, ref, emojiSize) {
    if (!emoji || emoji.length === 0) { return null }
    const img = document.createElement('img')
    img.src = this.getAttrValue('src', emoji)
    img.alt = this.getAttrValue('alt', emoji)
    img.setAttribute('style',
      'width: ' + emojiSize + 'px;' +
      'height: ' + emojiSize + 'px;' +
      'display: inline-block;' +
      'vertical-align: text-bottom;' +
      'margin: 0 1px;'
    )
    ref.appendChild(img)
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
   * Returns string emoji's image tag
   * @param {String} emojiNative
   * @returns {String}
   */
  getEmojiImageTag (emojiNative) {
    return twemoji.parse(emojiNative)
  },
  /**
   * Returns text to change text node with it
   * @param {Object} childNodes
   * @param {Object} caretPosition
   * @param {String} text
   * @returns {String}
   */
  getCombinedNodeText (childNodes, caretPosition, text) {
    const nodeData = childNodes[caretPosition.nodeIndex].data || ''
    const beginngin = nodeData.slice(0, caretPosition.textIndex) || ''
    const ending = nodeData.slice(caretPosition.textIndex, nodeData.length - 1) || ''
    return beginngin + text + ending
  }
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
/**
 * Replace symbols and html tags to equivalent string values
 * @param {String} data
 * @returns {String}
 */
function escapeHtml (data) {
  return data.replace(/&nbsp;|<br>/g, ' ')
}
