import twemoji from 'twemoji'

const IMG_KEY = '[[img]]'
const BR_KEY = '[[br]]'
const SPLITTER_KEY = '[[/]]'

export default {
  /**
   * Insert splitted content to splitted innerHTML content
   * and fill area with it
   * @param {Object} ref Html reference
   * @param {String} data Data to insert
   * @param {Object} caretPosition
   * @param {Number} emojiSize
   * @returns {Object} caret position to set
   */
  insertToChildNode (ref, data, caretPosition, emojiSize) {
    const innerHTMLContent = this.getSplittedContent(ref.innerHTML)
    const insertingContent = this.getSplittedContent(data)
    const combinedSplittedContent = this.getCombinedContent(innerHTMLContent, insertingContent, caretPosition)
    ref.innerHTML = ''
    this.fillArea(combinedSplittedContent, ref, emojiSize)

    const caretPositionStep = getCaretPositionStep(innerHTMLContent, combinedSplittedContent, insertingContent)
    return caretPositionStep
  },
  /**
   * Fill referenced area with parsed content.
   * Create text, img or <br> tag nodes
   * @param {Array} splittedContent
   * @param {Object} ref Html reference
   * @param {Number} emojiSize
   */
  fillArea (splittedContent, ref, emojiSize) {
    for (let i = 0; i < splittedContent.length; i++) {
      // text
      if (splittedContent[i].text) {
        // boolean value is need for setting carret position after emoji
        ref.append(typeof splittedContent[i].text === 'boolean' ? '' : splittedContent[i].text)

      // emoji
      } else if (splittedContent[i].img) {
        this.appendEmoji(splittedContent[i].img, ref, emojiSize)

      // <br> tag
      } else if (splittedContent[i].br) {
        ref.append(document.createElement('br'))
      }
    }
  },
  /**
   * Prepare data to split string to array with text, img or br nodes
   * @param {String} data
   * @returns { data: {Array}, imageList: {Array} }
   */
  prepareToSplitContent (data) {
    let imageList = getImageList(data)
    // if it already has imageList we don't need to parse data with twemoji
    if (imageList.length === 0) {
      data = twemoji.parse(data)
      imageList = getImageList(data)
    }

    for (let i = 0; i < imageList.length; i++) {
      data = data.replace(imageList[i], SPLITTER_KEY + IMG_KEY + SPLITTER_KEY)
    }
    data = data.replace(/<br>/g, SPLITTER_KEY + BR_KEY + SPLITTER_KEY)
    data = escapeHtml(data)
    data = data.split(SPLITTER_KEY)
    data = data.filter(element => element !== '')
    return { data, imageList }
  },
  /**
   * Split data to array with text, img or br nodes
   * @param {String} data
   * @returns {Array}
   * @example
   * [
   *  {text: "some text"},
   *  {br: true},
   *  {img: '<img src=".../>'}
   * ]
   */
  getSplittedContent (data) {
    let imageCounter = 0
    const preparedData = this.prepareToSplitContent(data)
    const imageList = preparedData.imageList
    data = preparedData.data
    for (let i = 0; i < data.length; i++) {
      if (data[i] === IMG_KEY) {
        data[i] = {
          img: imageList[imageCounter]
        }
        imageCounter++
      } else if (data[i] === BR_KEY) {
        data[i] = {
          br: true
        }
      } else {
        data[i] = {
          text: data[i]
        }
      }
    }
    return data
  },
  /**
   * Append emoji to referenced html tag
   * @param {String} emoji Image tag
   * @param {Object} ref Html reference
   * @param {Number} emojiSize
   * @returns {any}
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
  * Returns attribute value from tag in string format
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
    const imagesList = getImageList(value)
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
    const ending = nodeData.slice(caretPosition.textIndex, nodeData.length) || ''
    return beginngin + text + ending
  },
  /**
   * Combine content to fill area with it
   * Retunrs beginning + insertingContent + ending
   * 1. If beginning[last element].text && ending[firs element].text =>
   *    split string and paste insertingContent between
   * 2. beginning[last element][br || img] && ending[firs element][br || img] =>
   *    just concat elements with insertingContent between
   * 3. beginning[last element].text.length >= caretPosition.textIndex =>
   *    ending[firs element] = beginning[last element + 1]
   * @param {Array} innerHTMLContent
   * @param {Array} insertingContent
   * @param {Object} caretPosition
   * @returns {Array}
   */
  getCombinedContent (innerHTMLContent, insertingContent, caretPosition) {
    if (typeof caretPosition.nodeIndex !== 'number') {
      return innerHTMLContent.concat(insertingContent)
    }
    let result = []
    const beginning = innerHTMLContent.slice(0, caretPosition.nodeIndex + 1)
    const beginningContent = beginning[beginning.length - 1] || []
    const endingNodeIndex = getEndingNodeIndex(beginningContent, caretPosition)
    const ending = innerHTMLContent.slice(endingNodeIndex, innerHTMLContent.length)
    const endingContent = ending[0] || { text: '' }

    // text
    if (beginningContent.text && endingContent.text) {
      const beginningText = beginningContent.text.slice(0, caretPosition.textIndex)
      const endingText = endingContent.text.slice(caretPosition.textIndex, endingContent.text.length)
      beginning.pop()
      beginning.push({ text: beginningText })
      ending.shift()
      ending.unshift({ text: endingText })
    }
    result = beginning.concat(insertingContent, ending)
    result = mergeTextElements(result)
    result = appendTextElement(result, caretPosition)
    return result
  }
}

/**
 * Parses string and returns images array
 * @param {String} string
 * @returns {Array}
 */
function getImageList (string) {
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
/**
 * Returns array of merged repeating text elements
 * @param {Array} array
 * @returns {Array}
 */
function mergeTextElements (array) {
  const result = []
  for (let i = 0; i < array.length; i++) {
    if (array[i].text) {
      let combinedText = array[i].text
      while (array[i + 1] && array[i + 1].text) {
        combinedText = combinedText + array[i + 1].text
        i++
      }
      result.push({ text: combinedText })
    } else {
      result.push(array[i])
    }
  }
  return result
}
/**
 * Ending node index depends on beginning element type and caret position inside it
 * @param {Array} beginningContent
 * @param {Object} caretPosition
 * @returns {Number}
 */
function getEndingNodeIndex (beginningContent, caretPosition) {
  let endingNodeIndex = 0
  if (beginningContent.text && beginningContent.text.length >= caretPosition.textIndex) {
    endingNodeIndex = caretPosition.nodeIndex
  } else {
    endingNodeIndex = caretPosition.nodeIndex + 1
  }
  return endingNodeIndex
}
/**
 * Returns step from prev. caret position
 * @param {Array} insertingContent
 * @returns {Object}
 */
function getCaretPositionStep (innerHTMLContent, combinedSplittedContent, insertingContent) {
  let nodesDiff = 0
  let textCount = 0
  nodesDiff = combinedSplittedContent.length - innerHTMLContent.length
  insertingContent.forEach((element) => {
    if (element.text) { textCount = element.text.length }
  })
  nodesDiff = nodesDiff - 1 > 0 ? nodesDiff - 1 : 0
  return {
    nodeCount: nodesDiff,
    textCount
  }
}
/**
 * Add text element to the end of array
 * to allow set caret position after img and br elements
 * @param {Array} array Combined splitted content
 * @returns {Array}
 */
function appendTextElement (array, caretPosition) {
  const targetIndex = array[caretPosition.nodeIndex + 1] ? caretPosition.nodeIndex + 1 : caretPosition.nodeIndex
  const tergetElement = array[targetIndex]
  const isEmptyTextElement = tergetElement.hasOwnProperty('text') && tergetElement.text.length === 0
  if (tergetElement.img || isEmptyTextElement || tergetElement.br) {
    const beginning = array.slice(0, targetIndex + 1)
    const ending = array.slice(targetIndex + 1, array.length)
    beginning.push({ text: true })
    array = beginning.concat(ending)
  }
  return array
}
