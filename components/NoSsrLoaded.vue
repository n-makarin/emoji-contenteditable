<template>
  <div v-show="false" class="no-ssr-loaded" />
</template>

<script>
export default {
  name: 'NoSsrLoaded',
  mounted() {
    debugger
    this.$emit('loaded')
  }
}
</script>
