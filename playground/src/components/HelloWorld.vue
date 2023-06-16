<template>
  <div class="playground" v-dragresize="dragConfig"></div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: "right",
          setCssProperty: "width",
          memoryPositionKey:'test',
        },
      ];
    },
  },
};
</script>


<style scoped>
.playground {
  width: 100px;
  height: 100px;
  padding-left: 40px;
  background: red;
  position: relative;
}
</style>
