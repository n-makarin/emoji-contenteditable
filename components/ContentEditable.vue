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
  computed: {
    listeners() {
      return { ...this.$listeners, input: this.onInput }
    },
    unicodeValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  beforeUpdate() {
    if (this.value.length === 0) {
      this.$refs.contentEditable.innerHTML = ''
      return null
    }
    // emoji.fillArea(this.$refs.contentEditable, this.value, this.emojiSize)
  },
  methods: {
    onInput(e) {
      const innerHTML = e.target.innerHTML
      // if (dataHelpers.specSymbols.isEndingOnSpec(innerHTML)) {
      //   return null
      // }
      // const inputValue = dataHelpers.specSymbols.escape(innerHTML)
      // this.unicodeValue = emoji.parseToUnicodeValue(inputValue)
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
