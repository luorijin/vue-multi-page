<template>
<div class="wrapper">
 <app-header></app-header>
 <app-footer></app-footer>
</div>
</template>
<script>
import header from '@/components/pc/header.vue'
import footer from '@/components/pc/footer.vue'
export default {
  name: 'test',
  components: {
    'app-header': header,
    'app-footer': footer
  }
}
</script>
<style lang="less" type="stylesheet/less" scoped>
</style>
