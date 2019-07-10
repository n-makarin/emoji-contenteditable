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
 * @component @/components/ContentEditable/index
 */
import common from '@/components/ContentEditable/_common'
// import caret from '@/utils/caret'

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
      this.updateValue('selectEmoji', newValue)
      const emojiImage = common.getEmojiImageTag(newValue)
      this.appendEmoji(emojiImage)
      this.$emit('clearEmoji')
    }
  },
  methods: {
    input (e) {
      // const ref = this.$refs.contentEditable
      // const caretPosition = caret.getPosition(ref)
      // const childNodes = ref.childNodes
      // childNodes[caretPosition.nodeIndex].data = 'yo test'

      this.updateValue(e.type)
      e.preventDefault()
      console.log('input')
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
      this.$emit('input', common.parseToString(ref.innerHTML) + (data || ''))
    },
    /**
     * Append data to contentEditable
     * @param {String} data
     */
    appendContent (data) {
      const splittedContent = common.getSplittedContent(data)
      for (let i = 0; i < splittedContent.length; i++) {
        // text
        if (splittedContent[i].text) {
          this.$refs.contentEditable.append(splittedContent[i].text)

        // emoji
        } else if (splittedContent[i].img) {
          this.appendEmoji(splittedContent[i].img)
        }
      }
      common.setCaretEndPosition(this.$refs.contentEditable)
    },
    /**
     * Append emoji to contentEditable
     * @param {String} emoji Image tag
     */
    appendEmoji (emoji) {
      const img = document.createElement('img')
      img.src = common.getAttrValue('src', emoji)
      img.alt = common.getAttrValue('alt', emoji)
      img.width = this.emojiSize
      img.height = this.emojiSize
      this.$refs.contentEditable.appendChild(img)
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
