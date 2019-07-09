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
    console.log(this.event, 'on beforeUpdate')
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

      const selection = window.getSelection()
      if (!selection.rangeCount) { return false }
      selection.deleteFromDocument()
      selection.getRangeAt(0).insertNode(document.createTextNode(pasteData))
      selection.removeAllRanges()

      this.updateValue(e.type)
      e.preventDefault()
    },
    drop (e) {
      const dropData = e.dataTransfer.getData('Text')
      this.$refs.contentEditable.append(dropData)

      this.updateValue(e.type)
      e.preventDefault(dropData)
    },
    /**
     *
     */
    updateValue (eventType) {
      this.event = eventType
      this.$emit('input', this.$refs.contentEditable.textContent)
    },
    /**
     *
     */
    insertNodeInSelection (data) {
      const selection = window.getSelection()
      if (!selection.rangeCount) { return false }
      selection.deleteFromDocument()
      selection.getRangeAt(0).insertNode(document.createTextNode(data))
      selection.removeAllRanges()
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
