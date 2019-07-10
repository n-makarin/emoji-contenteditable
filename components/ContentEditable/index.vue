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

export default {
  name: 'ContentEditable',
  props: {
    value: {
      type: String,
      default: ''
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
  beforeUpdate () {
    console.log('beforeUpdate')
  },
  methods: {
    input (e) {
      this.updateValue(e.type)
      e.preventDefault()
      console.log('input')
    },
    paste (e) {
      const pasteData = (e.clipboardData || window.clipboardData).getData('text')
      this.updateValue(e.type, pasteData)
      this.append(pasteData)
      e.preventDefault()
    },
    drop (e) {
      const dropData = e.dataTransfer.getData('Text')
      this.$refs.contentEditable.append(dropData)

      this.updateValue(e.type)
      e.preventDefault(dropData)
    },
    /**
     * Update value binded with v-model
     * @param {String} eventType
     */
    updateValue (eventType, data) {
      this.event = eventType
      const ref = this.$refs.contentEditable
      switch (eventType) {
        case 'paste':
          this.$emit('input', common.parseToString(ref.innerHTML) + data)
          break
        default:
          this.$emit('input', common.parseToString(ref.innerHTML))
      }
    },
    /**
     *
     * @param {String} data
     */
    append (data) {
      const splittedContent = common.getSplittedContent(data)
      for (let i = 0; i < splittedContent.length; i++) {
        // text
        if (splittedContent[i].text) {
          this.$refs.contentEditable.append(splittedContent[i].text)

        // image
        } else if (splittedContent[i].img) {
          const img = document.createElement('img')
          img.src = common.getAttrValue('src', splittedContent[i].img)
          img.alt = common.getAttrValue('alt', splittedContent[i].img)
          img.width = this.emojiSize
          img.height = this.emojiSize
          this.$refs.contentEditable.appendChild(img)
        }
      }
      common.setCaretEndPosition(this.$refs.contentEditable)
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
