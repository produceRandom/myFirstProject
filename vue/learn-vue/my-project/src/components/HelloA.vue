<template>
  <div class="hello">
    <h1>{{ msgfromapp }}</h1>
		
  </div>
</template>

<script>
module.exports = {
  name: 'hello',
  data:  function () {
    return {
      msg: 'this is helloA page'
    }
    
  },
  props:["msgfromapp"]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
