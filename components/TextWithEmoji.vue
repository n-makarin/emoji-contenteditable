<template>
  <span
    ref="container"
    class="text-with-emoji"
    :style="styleObject"
  >
    {{ showText ? text : '' }}
  </span>
</template>

<script>
import emoji from '@/utils/emoji'
/**
 * @component components/TextWithEmoji
 */
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
      // it's allows to reserve content space
      // while page is not loaded yet
      styleObject: { visibility: 'hidden' },
      showText: true
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
    this.showText = false
    emoji.fillArea(this.text, this.$refs.container, this.emojiSize)
    this.isReady = true
  }
}
</script>
