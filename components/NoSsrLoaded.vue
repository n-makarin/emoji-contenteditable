<template>
  <div v-show="false" class="no-ssr-loaded" />
</template>

<script>
/**
 * @component @/components/NoSsrLoaded
 */
export default {
  name: 'NoSsrLoaded',
  mounted () {
    this.$emit('loaded')
  }
}
</script>
