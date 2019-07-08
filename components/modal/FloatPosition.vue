<template>
  <div ref="container" :class="classObject">
    <slot />
  </div>
</template>

<script>
const positionTypes = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  topRight: 'top-right',
  topLeft: 'top-left',
  bottomRight: 'bottom-right',
  bottomLeft: 'bottom-left'
}
const px = 'px'

export default {
  name: 'FloatPosition',
  props: {
    // trigger of modal opening
    value: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'top-right'
    },
    noSsrLoaded: {
      type: Boolean,
      default: true
    },
    targetOffset: {
      type: Number,
      default: 0
    }
  },
  computed: {
    classObject() {
      const main = 'float-position'
      const mainOpened = main + '_opened'
      const dir = {
        [positionTypes.top]: main + '_top',
        [positionTypes.right]: main + '_right',
        [positionTypes.bottom]: main + '_bottom',
        [positionTypes.left]: main + '_left'
      }
      const positionList = Object.assign(dir, {
        [positionTypes.topRight]: dir.top + '-right',
        [positionTypes.topLeft]: dir.top + '-left',
        [positionTypes.bottomRight]: dir.bottom + '-right',
        [positionTypes.bottomLeft]: dir.bottom + '-left'
      })
      return {
        [main]: true,
        [mainOpened]: this.value,
        [positionList[this.position]]: true
      }
    }
  },
  watch: {
    noSsrLoaded(newValue, oldValue) {
      if (newValue) {
        this.setStyle()
      }
    }
  },
  methods: {
    setStyle() {
      if (!this.position) {
        return null
      }
      if (typeof this.targetOffset !== 'number') {
        this.targetOffset = 0
      }
      // top, right, bottom, left
      const mainDirection = this.position.split('-')[0]
      // top-left, top-right, bottom-left, bottom-right
      const subDirection = this.position.split('-')[1]
      const refHeight = this.$refs.container.offsetHeight + this.targetOffset
      const refWidth = this.$refs.container.offsetWidth + this.targetOffset

      switch (mainDirection) {
        case positionTypes.top:
          this.$refs.container.style.top = -refHeight + px
          break
        case positionTypes.right:
          this.$refs.container.style.right = -refWidth + px
          break
        case positionTypes.bottom:
          this.$refs.container.style.bottom = -refHeight + px
          break
        case positionTypes.left:
          this.$refs.container.style.left = -refWidth + px
          break
        default:
      }

      switch (subDirection) {
        case positionTypes.left:
          this.$refs.container.style.left = -refWidth + px
          break
        case positionTypes.right:
          this.$refs.container.style.right = -refWidth + px
          break
        default:
      }
    }
  }
}
</script>

<style lang="stylus">
$z-index-overlay = 999
.float-position {
  opacity 0
  position absolute
  z-index -10
  transition opacity .2s

  &_opened {
    z-index $z-index-overlay
    opacity 1
  }

  &_top, &_bottom {
    left 50%
    transform translateX(-50%)
  }

  &_left, &_right {
    top 50%
    transform translateY(-50%)
  }
}
</style>
