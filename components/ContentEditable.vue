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
      event: null
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: this.input,
        paste: this.paste,
        drop: this.drop
      }
    }
  },
  watch: {
    emoji (newValue, oldValue) {
      if (newValue.length === 0) { return null }
      this.updateValue('selectEmoji', newValue)
      this.removeLastBrTag()
      const emojiImage = emoji.getEmojiImageTag(newValue)
      emoji.appendEmoji(emojiImage, this.$refs.contentEditable, this.emojiSize)
      this.$emit('clearEmoji')
    }
  },
  methods: {
    input (e) {
      this.updateValue(e.type)
      e.preventDefault()
    },
    paste (e) {
      const pasteData = (e.clipboardData || window.clipboardData).getData('text')
      this.updateValue(e.type, pasteData)
      this.appendContent(pasteData)
      e.preventDefault()
    },
    drop (e) {
      const dropData = e.dataTransfer.getData('Text')
      this.updateValue(e.type, dropData)
      this.appendContent(dropData)
      e.preventDefault(dropData)
    },
    /**
     * Update value binded with v-model
     * @param {String} eventType
     */
    updateValue (eventType, data) {
      this.event = eventType
      const ref = this.$refs.contentEditable
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
     * TODO-nmak: figure out with pasting data to nodes
     */
    addContentTo (data) {
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
     *
     */
    getNode (childNodes, caretPosition) {
      if (childNodes.length === 0) { return null }
      return {
        name: childNodes[caretPosition.nodeIndex].nodeName || null,
        data: childNodes[caretPosition.nodeIndex].data || null
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
