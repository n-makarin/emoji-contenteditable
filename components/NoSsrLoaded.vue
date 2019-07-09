<template>
  <div v-show="false" class="no-ssr-loaded" />
</template>

<script>
export default {
  name: 'NoSsrLoaded',
  mounted () {
    this.$emit('loaded')
  }
}
</script>
