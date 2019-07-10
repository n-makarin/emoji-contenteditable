export default {
  /**
   * Get contentEditable caret's position
   * @param {Object} editableDiv Html reference
   * @returns { nodeIndex: {Number}, position: {Number} }
   */
  getPosition (editableDiv) {
    let caretPos = 0
    let sel = null
    let range = null

    if (window.getSelection) {
      sel = window.getSelection()

      if (sel.rangeCount) {
        range = sel.getRangeAt(0)
        if (range.commonAncestorContainer.parentNode === editableDiv) {
          caretPos = range.endOffset
        }
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange()
      if (range.parentElement() === editableDiv) {
        const tempEl = document.createElement('span')
        editableDiv.insertBefore(tempEl, editableDiv.firstChild)
        const tempRange = range.duplicate()
        tempRange.moveToElementText(tempEl)
        tempRange.setEndPoint('EndToEnd', range)
        caretPos = tempRange.text.length
      }
    }
    return {
      nodeIndex: getNodeIndex(editableDiv, sel.anchorNode.data),
      position: caretPos
    }
  }
}

/**
 * Returns selected node index
 * @param {Object} element Html reference
 * @param {String} selData Data of current node
 * @returns {Number}
 */
function getNodeIndex (element, selData) {
  const childNodes = element.childNodes
  let index = 0
  childNodes.forEach((element, key) => {
    if (element.data === selData) {
      index = key
    }
  })
  return index
}
