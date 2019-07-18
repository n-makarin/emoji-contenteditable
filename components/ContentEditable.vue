<template>
  <div class="no-flex-wrapper">
    <div
      ref="contentEditable"
      class="content-editable"
      :placeholder="placeholder"
      contenteditable
      v-on="listeners"
    />
  </div>
</template>

<script>
/**
 * @component @/components/ContentEditable
 */
import emoji from '@/utils/emoji'
import caret from '@/utils/caret'

export default {
  name: 'ContentEditable',
  props: {
    value: {
      type: String,
      default: ''
    },
    emoji: {
      type: String,
      default: () => null
    },
    emojiSize: {
      type: Number,
      default: 18
    },
    placeholder: {
      type: String,
      default: 'Введите текст...'
    }
  },
  data () {
    return {
      event: null,
      caretPosition: null
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: this.input,
        paste: this.paste,
        drop: this.drop,
        keyup: this.setCaretPosition,
        click: this.setCaretPosition
      }
    }
  },
  watch: {
    /**
     * Add emoji from emojiPicker
     */
    emoji (newValue, oldValue) {
      if (newValue.length === 0) { return null }
      const emojiImage = emoji.getEmojiImageTag(newValue)
      this.addInside(emojiImage)
      this.updateValue('selectEmoji', newValue)
      this.$emit('clearEmoji')
    },
    caretPosition (newValue, oldValue) {
      console.log(newValue.nodeIndex, newValue.textIndex)
    }
  },
  methods: {
    input (e) {
      this.updateValue(e.type)
      e.preventDefault()
    },
    paste (e) {
      const pasteData = (e.clipboardData || window.clipboardData).getData('text')
      this.addInside(pasteData)
      this.updateValue(e.type, pasteData)
      e.preventDefault()
    },
    drop (e) {
      const dropData = e.dataTransfer.getData('Text')
      this.addInside(dropData)
      this.updateValue(e.type, dropData)
      e.preventDefault(dropData)
    },
    /**
     * Update value binded with v-model
     * @param {String} eventType
     */
    updateValue (eventType, data) {
      this.event = eventType
      const ref = this.$refs.contentEditable
      const addInsideEventTeypes = ['paste', 'drop', 'selectEmoji']
      if (addInsideEventTeypes.includes(eventType)) {
        this.$emit('input', emoji.parseToString(ref.innerHTML))
        return null
      }
      this.$emit('input', emoji.parseToString(ref.innerHTML) + (data || ''))
    },
    /**
     * Append data to contentEditable
     * @param {String} data
     */
    appendContent (data) {
      this.removeLastBrTag()
      emoji.fillArea(data, this.$refs.contentEditable, this.emojiSize)
      caret.setEndPosition(this.$refs.contentEditable)
    },
    /**
     * Add inserting data inside existing node
     * @param {String} data
     */
    addInside (data) {
      const ref = this.$refs.contentEditable
      const caretPosition = caret.getPosition(ref)
      emoji.insertToChildNode(ref, data, caretPosition, this.emojiSize)
      this.removeLastBrTag()
    },
    /**
     * Replace double <br> tags to one <br>
     */
    removeLastBrTag () {
      const ref = this.$refs.contentEditable
      const brTag = '<br>'
      if (ref.innerHTML.slice(-brTag.length) === brTag) {
        ref.innerHTML = ref.innerHTML.slice(0, ref.innerHTML.length - brTag.length)
        caret.setEndPosition(ref)
      }
    },
    /**
     * Combine child nodes and return string with it's values
     * @param {Object} childNodes nodeList
     * @returns {String}
     */
    childNodesToString (childNodes) {
      childNodes = Array.prototype.slice.call(childNodes)
      let combinedNodes = ''
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeName === '#text') {
          combinedNodes = combinedNodes + childNodes[i].data
        } else if (childNodes[i].nodeName === 'BR') {
          combinedNodes = combinedNodes + ' '
        } else if (childNodes[i].nodeName === 'IMG') {
          combinedNodes = combinedNodes + childNodes[i].alt
        }
      }
      return combinedNodes
    },
    /**
     * Set current caret position
     */
    setCaretPosition () {
      this.caretPosition = caret.getPosition(this.$refs.contentEditable)
    }
  }
}
</script>

<style lang="stylus" scoped>
.content-editable {
  // it's necessary for contenteditable to be displayed in inline-block
  display inline-block
  width 100%
  background white
  cursor text
  outline none
}

// parent container must't be displayed flex
.no-flex-wrapper {
  display inline-block
}

/* modifiers */
.look-like-textarea {
  .content-editable {
    min-width 400px
    min-height 60px
    padding 3px
    border 1px solid grey
  }
}

/* placeholder */
.content-editable:empty:before{
  content: attr(placeholder);
  display: block; /* For Firefox */
  color gray
}
</style>
