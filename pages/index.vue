<template>
  <div class="page page-index">
    <h1>Contenteditable component with twitter emoji picker</h1>
    <section>
      <div>
        <p>contenteditable</p>
        <content-editable
          v-model="contentEditableText"
          class="look-like-textarea"
        />
        <emoji-picker
          v-model="contentEditableText"
          modal-position="bottom-right"
        />
      </div>
      <div>
        <p>text output</p>
        <textarea
          v-model="contentEditableText"
          type="text"
        />
      </div>
    </section>
  </div>
</template>

<script>
import ContentEditable from '../components/ContentEditable/index'
import EmojiPicker from '../components/EmojiPicker'

export default {
  components: {
    ContentEditable,
    EmojiPicker
  },
  data () {
    return {
      contentEditableText: ''
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="stylus">
* {
  margin 0
  padding 0
  font-family sans-serif
  box-sizing: border-box;
}
h1 {
  margin 20px
  color #413737
}
.page-index {
  section {
    padding 10px 20px
    display flex
    .emoji-picker {
      margin 0 15px
    }
    textarea {
      min-width 400px
      min-height 60px
    }
    p {
      font-size 14px
      padding-bottom 10px
    }
  }
}
</style>
