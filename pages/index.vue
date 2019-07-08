<template>
  <div class="page page-index">
    <h1>Contenteditable component with twitter emoji picker</h1>
    <section>
      <content-editable 
        class="look-like-textarea"
      />
    </section>
  </div>
</template>

<script>
import ContentEditable from '../components/ContentEditable'

export default {
  components: {
    ContentEditable
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
  font-family monospace
}
h1 {
  margin 20px
  color #413737
}
.page-index {
  section {
    padding 10px 20px
  }
}
</style>
