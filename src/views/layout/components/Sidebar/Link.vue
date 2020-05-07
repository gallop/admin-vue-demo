
<template>
  <!-- eslint-disable vue/require-component-is-->
  <div @click="clickLink(to)">
    <slot/>
  </div>
</template>

<script>
import { isExternal } from '@/utils'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    linkProps(url) {
      if (this.isExternalLink(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }

      return {
        is: 'test'
        // is: 'router-link',
        // to: url
      }
    },
    clickLink(path) {
      // console.log('current url:' + path)
      // console.log('current route:' + this.$route.path)
      this.$router.push({
        path,
        query: {
          t: +new Date()
        }
      })
    }
  }
}
</script>
