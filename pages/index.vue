<template>
  <div class="page page-index">
    <h1>Contenteditable component with twitter emoji picker</h1>
    <section class="contentEditable">
      <div class="contentEditable__item">
        <p>Contenteditable</p>
        <content-editable
          v-model="contentEditableText"
          :emoji="selectedEmoji"
          class="look-like-textarea"
          @clearEmoji="selectedEmoji = ''"
        />
        <emoji-picker
          v-model="selectedEmoji"
          modal-position="bottom-right"
        />
      </div>
      <div class="contentEditable__item">
        <p>Contenteditable output from v-model</p>
        <textarea
          v-model="contentEditableText"
          type="text"
        />
      </div>
    </section>
  </div>
</template>

<script>
import ContentEditable from '@/components/ContentEditable/index'
import EmojiPicker from '@/components/EmojiPicker'

export default {
  components: {
    ContentEditable,
    EmojiPicker
  },
  data () {
    return {
      contentEditableText: '',
      selectedEmoji: ''
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
  font-size 25px
  text-align center
  margin 25px
  color #413737
}
.page-index {
  display flex
  flex-direction column

  section {
    padding 10px 20px
    display flex
    justify-content center

    p {
      font-size 15px
      padding-bottom 10px
    }
  }

  .contentEditable {
    flex-direction column
    margin-left auto
    margin-right auto
    padding 40px 100px
    background #eee

    .emoji-picker {
      margin 0 5px
    }

    textarea {
      min-width 400px
      min-height 60px
    }
    &__item:first-child {
      margin-bottom 30px
    }
  }
}
</style>
