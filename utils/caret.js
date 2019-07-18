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
   * Set caret end position in editable area
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
  }
}

/**
 * Returns contentEditable node index of caret position
 * @param {Object} selection
 * @returns {Number}
 */
function getNodeIndex (selection) {
  const anchorNode = selection.anchorNode
  const anchorClassName = anchorNode.parentNode.className
  if (anchorClassName.includes('no-flex-wrapper')) {
    const index = selection.anchorOffset - 1
    return index > 0 ? index : 0
  }
  // TODO-nmak: temporary for events without selection on content-editable
  // allows to past emoji in the end of content from emoji-picker
  if (
    !anchorClassName.includes('no-flex-wrapper') &&
    !anchorClassName.includes('content-editable')
  ) {
    return null
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
