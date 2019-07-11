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
    <h1>Text with emoji</h1>
    <section class="with-emoji">
      <span
        v-for="(text, key) in textWithEmoji"
        :key="key"
        class="with-emoji__item with-emoji__item_native"
      >
        {{ text }}
      </span>
      <text-with-emoji
        v-for="(text, key) in textWithEmoji"
        :key="key"
        class="with-emoji__item with-emoji__item_twitter"
        :text="text"
      />
    </section>
  </div>
</template>

<script>
import ContentEditable from '@/components/ContentEditable'
import EmojiPicker from '@/components/EmojiPicker'
import TextWithEmoji from '@/components/TextWithEmoji'

export default {
  components: {
    ContentEditable,
    EmojiPicker,
    TextWithEmoji
  },
  data () {
    return {
      contentEditableText: '',
      selectedEmoji: '',
      textWithEmoji: [
        'Hi! 🙂 What\'s up? It\'s nice to read you! 🤗',
        'It was so brilliant idea 💎, thank\'s a lot! 👏',
        'Vue is awesome🤟'
      ]
    }
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
  align-items center

  section {
    padding 10px 20px
    display flex
    justify-content center
    flex-direction column
    padding 40px 100px
    background #eee

    p {
      font-size 15px
      padding-bottom 10px
    }
  }

  .contentEditable {
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

  .with-emoji {
    &__item {
      position relative
      margin 5px 0

      &:nth-child(3) {
        margin-bottom 15px
      }

      &:before {
        position absolute
        top 50%
        left -60px
        transform translateY(-50%)
        display inline-block
        padding 3px
        border-radius 3px
        font-family monospace
        font-size 11px
        font-weight 600
      }

      &_native {
        &:last-child {
          margin-bottom 15px
        }
        &:before {
          content: 'native'
          background #ffc83d
        }
      }
      &_twitter:before {
        content: 'twitter'
        background #00acee
      }
    }
  }
}
</style>
