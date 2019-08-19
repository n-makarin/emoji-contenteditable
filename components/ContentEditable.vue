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
import emoji from '@/utils/emoji'
import caret from '@/utils/caret'

const brTag = '<br>'

export default {
  name: 'ContentEditable',
  props: {
    value: {
      type: String,
      default: ''
    },
    // emoji to pasting in unicode format 👩‍💻
    emoji: {
      type: String,
      default: () => null
    },
    // in 'px'
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
      /**
       * Content is separated to child nodes, like:
       * "some text" - text node - nodeIndex[0]
       * "<br>" - one else node - nodeIndex[1]
       * "<img>" - else node etc.  - nodeIndex[2 ...]
       *
       * Text nodes has caret position inside them, like:
       * "som<caret position>e text" - textIndex[2]
       * (caret is appending after specified character)
       *
       * The result of this content is:
       * "
       * some text
       * <br>
       * <img ... />
       * some el<caret position>se text
       * "
       * caretPosition: {
       *  nodeIndex: 3,
       *  textIndex: 6
       * }
       *
       */
      caretPosition: {
        nodeIndex: 0,
        textIndex: 0
      }
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: this.input,
        keydown: this.keydown,
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
      this.addInsideChildNode(emojiImage)
      this.updateValue('selectEmoji', newValue)
      this.$emit('clearEmoji')
    },
    /**
     * Reset content, if value from v-model is empty
     */
    value (newValue, oldValue) {
      if (newValue) { return null }
      this.$refs.contentEditable.innerHTML = ''
      this.caretPosition = { nodeIndex: 0, textIndex: 0 }
    }
  },
  methods: {
    input (e) {
      if (!e.data) { return null }
      this.updateValue(e.type)
      e.preventDefault()
    },
    /**
     * Handle Enter's keydown to prevent adding <div> on line breaking
     * @param {Object} e Event
     * @issueDiscussion https://stackoverflow.com/questions/18552336/prevent-contenteditable-adding-div-on-enter-chrome
     * @returns {any}
     */
    keydown (e) {
      const enterKeyCode = 13
      if (e.keyCode === enterKeyCode) {
        document.execCommand('insertHTML', false, brTag + brTag)
        e.preventDefault()
      }
    },
    paste (e) {
      const pasteData = (e.clipboardData || window.clipboardData).getData('text')
      this.addInsideChildNode(pasteData)
      this.updateValue(e.type, pasteData)
      e.preventDefault()
    },
    drop (e) {
      const dropData = e.dataTransfer.getData('Text')
      this.addInsideChildNode(dropData)
      this.updateValue(e.type, dropData)
      e.preventDefault(dropData)
    },
    /**
     * Update value binded with v-model
     * and emit this data with 'input' action
     * @param {String} eventType Which event is occured
     * @param {String} data Data to concat it with innerHTML content
     * e.g.: emoji, paste data or drop data
     * @returns {any}
     */
    updateValue (eventType, data) {
      let bubblingData = emoji.parseToString(this.$refs.contentEditable.innerHTML)
      if (data && !['paste', 'drop', 'selectEmoji'].includes(eventType)) {
        bubblingData = bubblingData + data
      }
      this.$emit('input', bubblingData)
    },
    /**
     * Add data inside existing node
     * @param {String} data Data to add
     * @returns {any}
     */
    addInsideChildNode (data) {
      const ref = this.$refs.contentEditable
      this.removeLastBrTag()
      // insertToChildNode and get caretPositionStep
      const caretPositionStep = emoji.insertToChildNode(ref, data, this.caretPosition, this.emojiSize)
      this.caretPosition = {
        nodeIndex: this.caretPosition.nodeIndex + caretPositionStep.nodeCount,
        textIndex: this.caretPosition.textIndex + caretPositionStep.textCount
      }
      caret.setPosition(ref, this.caretPosition)
    },
    /**
     * Remove last <br> tag
     * @returns {any}
     */
    removeLastBrTag () {
      const ref = this.$refs.contentEditable
      if (ref.innerHTML.slice(-brTag.length) === brTag) {
        ref.innerHTML = ref.innerHTML.slice(0, ref.innerHTML.length - brTag.length)
        caret.setEndPosition(ref)
      }
    },
    /**
     * Set current caret position
     * @returns {any}
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
