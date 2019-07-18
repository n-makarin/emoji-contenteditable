<template>
  <div class="emoji-picker">
    <span
      ref="btn"
      class="emoji-picker__btn icon icon_smile"
      @mouseover="btnMouseover()"
      @mouseleave="btnMouseleave()"
    />

    <float-position
      v-model="modalOpened"
      :position="modalPosition"
      :target-offset="modalTargetOffset"
      :no-ssr-loaded="loaded"
      @mouseover="modalMouseover()"
      @mouseleave="modalMouseleave()"
    >
      <no-ssr placeholder="Loading...">
        <no-ssr-loaded @loaded="loaded = true" />
        <picker set="twitter" @select="select($event)" />
      </no-ssr>
    </float-position>
  </div>
</template>

<script>
/**
 * @component @/components/EmojiPicker
 */
import { Picker } from 'emoji-mart-vue'
import FloatPosition from '@/components/modal/FloatPosition'
import NoSsrLoaded from '@/components/NoSsrLoaded'

export default {
  name: 'EmojiPicker',
  components: {
    FloatPosition,
    NoSsrLoaded,
    Picker
  },
  props: {
    // emoji
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
      loaded: false,
      modalHovered: false
    }
  },
  watch: {
    modalOpened (newValue, oldValue) {
      const activeClass = 'emoji-picker__btn_active'
      if (newValue) {
        this.$refs.btn.classList.add(activeClass)
      } else {
        this.$refs.btn.classList.remove(activeClass)
      }
    }
  },
  methods: {
    btnMouseover () {
      this.modalOpened = true
    },
    btnMouseleave () {
      const delay = 200 + (this.modalTargetOffset * 1.5)
      setTimeout(function () {
        if (!this.modalHovered) { this.modalOpened = false }
      }.bind(this), delay)
    },
    modalMouseover () {
      this.modalHovered = true
    },
    modalMouseleave () {
      this.modalHovered = false
      this.modalOpened = false
    },
    toggleModal () {
      this.modalOpened = !this.modalOpened
    },
    /**
     * Add selected emoji to the text and close picker modal
     * @param {Object} emoji Selected emoji's data object
     */
    select (emoji) {
      this.$emit('input', emoji.native)
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
  vertical-align top
  &__btn {
    cursor pointer
    vertical-align top
    &_active {
      filter brightness(0.7)
      transition filter .05s easy-in
    }
  }
}

.on-mousedown {
  filter brightness(0.7)
  transition filter .05s easy-in
}

/* emoji-picker styles remolding */
.emoji-mart {
  height: 260px !important
}
.emoji-mart-bar {
  display none !important
}
</style>
