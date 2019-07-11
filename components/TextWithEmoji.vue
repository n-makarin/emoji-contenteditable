<template>
  <span
    ref="container"
    class="text-with-emoji"
    :style="styleObject"
  />
</template>

<script>
import emoji from '@/utils/emoji'

export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    emojiSize: {
      type: Number,
      default: 18
    }
  },
  data () {
    return {
      styleObject: { visibility: 'hidden' }
    }
  },
  computed: {
    isReady: {
      get () {
        return false
      },
      set (newValue) {
        this.styleObject = { visibility: 'visible' }
      }
    }
  },
  mounted () {
    emoji.fillArea(this.text, this.$refs.container, this.emojiSize)
    this.isReady = true
  }
}
</script>
