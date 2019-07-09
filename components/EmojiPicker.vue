<template>
  <div
    v-on-clickaway="closeModal"
    class="emoji-picker"
  >
    <span
      class="emoji-picker__btn icon icon_smile"
      @click="toggleModal()"
    />

    <float-position
      v-model="modalOpened"
      :position="modalPosition"
      :target-offset="modalTargetOffset"
      :no-ssr-loaded="loaded"
    >
      <no-ssr placeholder="Loading...">
        <no-ssr-loaded @loaded="loaded = true" />
        <picker set="twitter" @select="select($event)" />
      </no-ssr>
    </float-position>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { Picker } from 'emoji-mart-vue'
import FloatPosition from './modal/FloatPosition'
import NoSsrLoaded from './NoSsrLoaded'

export default {
  name: 'EmojiPicker',
  components: {
    FloatPosition,
    NoSsrLoaded,
    Picker
  },
  mixins: [ clickaway ],
  props: {
    // data of contenteditable field
    value: {
      type: String,
      default: () => ''
    },
    // modal position regarding picker's button
    modalPosition: {
      type: String,
      default: 'top-right'
    },
    // offset from picker's button
    modalTargetOffset: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      modalOpened: false,
      loaded: false
    }
  },
  computed: {
    combinedText: {
      get () {
        return this.value
      },
      set (newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  methods: {
    toggleModal () {
      this.modalOpened = !this.modalOpened
    },
    closeModal () {
      this.modalOpened = false
    },
    /**
     * add selected emoji to the text and close picker modal
     * @param {Object} emoji Selected emoji's data object
     */
    select (emoji) {
      this.combinedText = this.combinedText + emoji.native
      this.toggleModal()
    }
  }
}
</script>

<style lang="stylus">
.icon {
  display inline-block
  background-size contain
  background-position center center
  background-repeat no-repeat
  border 0
  outline none
}
.icon_smile
  background-image: url(../assets/icon_smile.svg)
  width: 20px
  height: 20px

.emoji-picker {
  position relative
  display inline-block
  &__btn {
    cursor pointer
    vertical-align top
  }
}

/* emoji-picker styles remolding */
.emoji-mart {
  height: 260px !important
}
.emoji-mart-bar {
  display none !important
}
</style>
