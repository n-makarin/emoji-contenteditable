<template>
  <span ref="container" class="text-with-emoji" />
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
  mounted () {
    emoji.fillArea(this.text, this.$refs.container, this.emojiSize)
  }
}
</script>
