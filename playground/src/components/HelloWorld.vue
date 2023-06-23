<template>
  <div class="playground" v-dragresize="dragConfig">
    <input type="text" />
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    var textarea = document.createElement('textarea');
var isAppendSupported = false;

if (typeof textarea.append === 'function') {
  // 验证是否为真正的 append() 方法，而不是从原型链继承的
  var testElement = document.createElement('div');
  textarea.append(testElement);
  isAppendSupported = (textarea.lastChild === testElement);
}

console.log(isAppendSupported); // 输出 true 或 false，表示是否支持 append() 方法

  },
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: "right",
          setCssProperty: "width",
          log: true,
        },
      ];
    },
  },
};
</script>


<style scoped>
* {
  padding: 0;
  margin: 0;
}
.playground {
  width: 400px;
  height: 100px;
  background: red;
  position: relative;
}
input {
  width: 100%;
  height: 100%;
}
</style>
