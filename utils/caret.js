export default {
  /**
   * Get contentEditable caret's position
   * @param {Object} editableDiv Html reference
   * @returns { nodeIndex: {Number}, position: {Number} }
   */
  getPosition (editableDiv) {
    let caretPos = 0
    let selection = null
    let range = null

    if (window.getSelection) {
      selection = window.getSelection()

      if (selection.rangeCount) {
        range = selection.getRangeAt(0)
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
      nodeIndex: getNodeIndex(selection),
      textIndex: caretPos
    }
  },
  /**
   * Set caret end position in contentEditable
   * @param {Object} el Element target
   */
  setEndPosition (el) {
    el.focus()
    if (!(window.getSelection && document.createRange)) {
      return null
    }
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  },
  /**
   * Set caret position in contentEditable
   * @param {Object} el Html reference
   * @param {Object} caretPosition
   */
  setPosition (el, caretPosition) {
    let nodeIndex = caretPosition.nodeIndex
    let textIndex = 0
    const nodeList = [...el.childNodes]
    if (nodeList[nodeIndex].nodeName === '#text') {
      textIndex = caretPosition.textIndex
    } else {
      textIndex = 0
      if (nodeList[nodeIndex].nodeName === 'IMG' || el.childNodes[nodeIndex + 1]) {
        nodeIndex = nodeIndex + 1
      }
    }

    const range = document.createRange()
    const sel = window.getSelection()
    try {
      range.setStart(el.childNodes[nodeIndex], textIndex)
    } catch (err) {
      console.error(err)
    }
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

/**
 * Returns contentEditable node index of caret position
 * @param {Object} selection
 * @returns {Number}
 */
function getNodeIndex (selection) {
  const anchorNode = selection.anchorNode
  if (!anchorNode) { return null }
  const anchorClassName = anchorNode.parentNode.className
  if (anchorClassName.includes('no-flex-wrapper')) {
    const index = selection.anchorOffset - 1
    return index > 0 ? index : 0
  }
  const parentChildNodes = [...anchorNode.parentNode.childNodes]
  const selectionNodeName = anchorNode.nodeName
  const nextSibiling = anchorNode.nextElementSibling
  const prevSibiling = anchorNode.previousElementSibling
  let nodeIndex = 0

  parentChildNodes.forEach((element, key) => {
    if (
      element.nodeName === selectionNodeName &&
      element.nextElementSibling === nextSibiling &&
      element.previousElementSibling === prevSibiling
    ) {
      nodeIndex = key
    }
  })
  return nodeIndex
}
