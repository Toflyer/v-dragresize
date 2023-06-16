# v-dragresize

In Vue, the v-dragresize instruction will help you conveniently drag the edges of Doms to change the size of elements, while also supporting the optional linkage of CSS attributes of other Doms while changing them simultaneously<br><br>
在Vue中，v-dragresize指令会帮助您，便捷的拖动Dom的边来改变元素的大小，同时支持可选联动其他Dom的css属性同时改变

## 写在最前

在拖动元素边框的时候，我们最关心的无非就是元素的哪条边可以拖动，以及拖动之后，修改的是哪一个css属性，以及可能存在联动其他元素的css属性


## 目录

- [下载](#下载)
- [使用](#使用)
- [最简单的使用](#最简单的使用)
- [其他配置项](#其他配置项)
    - [多条边可拖动](#多条边可拖动)
    - [min && max](#min--max)
    - [cascadeElCssList && follow](#cascadeelcsslist--follow)
    - [dragAreaSize](#dragareasize)
    - [eventPropagation](#eventpropagation)
    - [mouseMoveContentCssSelector](#mousemovecontentcssselector)
    - [customDragLineStyle](#customdraglinestyle)
    - [frequencyThrottleNum](#frequencythrottlenum)
    - [memoryPositionKey](#memorypositionkey)
    - [log](#log)
- [事件](#事件)
    - [resizeHandle](#resizehandle)
    - [dragDoneHandle](#dragdonehandle)


## 下载

```sh
npm i v-dragresize --save
```

## 使用
ES引入
```js
import dragresize from 'v-dragresize';
```
或者
```js
const dragresize = require("v-dragresize");
```

然后在Vue中注册为全局指令

```js
Vue.use(dragresize);
```

### 最简单的使用

1. 指令所在元素的position不为static
2. 传入dragBorder && setCssProperty

在vue的单文件组件中，通过指令的方式，按照个人喜好，v-dragresize需要传入一个配置，可用计算属性或者函数return出来：

dragBorder用于告诉v-dragresize，这个元素那条边是可拖动的<br>
setCssProperty用于设定在拖动时，v-
dragresize需要修改元素的什么css属性


```html
<div class="playground" v-dragresize="dragConfig"></div>
```

```js
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: "top",
          setCssProperty: "padding-top",
        },
      ];
    },
  },
```
为什么返回的是数组，因为你可以设置元素的四条边都可拖动..



### 其他配置项
v-dragresize支持很多配置项，让我们来一一介绍

#### 多条边可拖动
当拖动元素的上边框时，修改元素的padding-top<br>
当拖动元素的左边框时，修改元素的width

```js
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: "top",
          setCssProperty: "padding-top",
        },
        {
          dragBorder: "left",
          setCssProperty: "width",
        },
      ];
    },
  },
```

#### min && max
约束 min <  padding-top < max;

```js
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: "top",
          setCssProperty: "padding-top",
          min:150,
          max:500,
        },
      ];
    },
  },
```

#### cascadeElCssList && follow
当然，我们的页面一定不是由一个dom构成的，例如当你通过拖动让页面中的某一个div变大/缩小了，那么可能其他的div就要相应的缩小/变大（注意是可能哦，因为布局不确定）这个时候你就需要cascadeElCssList来协助你完成其他div的css变动，同样的cascadeElCssList也是一个数组，这就意味着你可以联动多个div

1. cssSelector是你需要传入的css选择器，内部使用document.querySelector实现，所以cssSelector的值应该传递什么，你应该不会陌生
2. setCssProperty就是需要设定的css属性了，上面提到过
3. follow是一个很有意思的字段，当你指令所在的dom通过拖动变大了，但是你想要级联的div也变大，follow就派上用场了<br>

比如下面这个例子：<br>
follow字段为true,通过鼠标拖动dom的右边框使得dom的width增加时，app-container的padding-left会相应的增加<br>
当follow为false的时候，app-contaiiner的padding-left会减小

```js
  computed: {
    dragresizeConfig() {
      return [
        {
          dragBorder: 'right',
          setCssProperty: 'width',
          cascadeElCssList: [
            {
              cssSelector: '.app-container',
              setCssProperty: 'padding-left',
              follow: true
            }
          ]
        }
      ];
    },
  },
```


#### dragAreaSize

当鼠标hover到指令所在元素的边框的时候，会自动变成可拖拽的双箭头样式
https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor

```css
.demoCss {
  cursor: ew-resize || ns-resize;
}
```
目前这个hover热区默认是5px，可以使用dragAreaSize调整


#### eventPropagation
当鼠标点击边框的时候，这个点击事件默认是不传播的，如果需要这个点击事件，可以设置eventPropagation为true


#### mouseMoveContentCssSelector

在用户拖动时，监听mouseMove的区域，默认是window，如果你需要让鼠标在一个固定区域内拖动，可以给
mouseMoveContentCssSelector一个选择器，内部依旧使用document.querySelector实现

#### customDragLineStyle

可能你会对开头的postion不为static有所疑惑。没关系，在这里可以帮助你解决这个疑问，当你传入配置时候，v-dragresize会在你的元素内部手动append添加一个拖拽线，这条拖拽线会根据你传入的配置，相对应的吸附在元素的一条边框上。

而当你对这样的交互有所不满，或者你想要注入一些自定义的样式，customDragLineStyle就派上用场了
```js
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: 'top',
          setCssProperty: 'padding-top',
          customDragLineStyle: {
            background: 'pink' //我想让我的拖拽线变成猛男粉！！
            ...
          }
        }
      ];
    },
  },
```



#### frequencyThrottleNum
性能优化节流方向，因为mouseMove的触发频率非常高，所以拖拽时你的元素边框才能紧紧的跟着你的鼠标，让交互体验变得非常好，但有些时候你会对性能要求比较高，这个时候frequencyThrottleNum就是一个权衡器，让你在性能和交互体验上有所取舍。


通常我们的节流都是用时间为单位，不断触发，但是N毫秒内只执行一次，但在这个交互上可能不太适用，所以我们用次数作为节流单位


目前插件内部内置frequencyThrottleNum为3
意为：当mouseMove事件触发三次，我们才执行一次计算并且调整你传入配置的所有css属性
当frequencyThrottleNum为0时，意为不节流

frequencyThrottleNum越小交互越流畅但是性能消耗会随之增加

```js
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: "top",
          setCssProperty: "padding-top",
          frequencyThrottleNum：3，
        },
      ];
    },
  },
```



#### memoryPositionKey
一个令PM非常喜欢的功能，如果你需要下次进入页面时，记录上一次用户拖动后的信息，那么你只需要给memoryPositionKey传入一个不重复的key即可

元素被拖动边框后的值，以及级联的所有css属性都将被记录进localStorage，当页面下次重新载入的时候，元素将被还原回上一次的拖动位置，而不需要你做任何操作。
```js
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: "top",
          setCssProperty: "padding-top",
          memoryPositionKey：'myText'，
        },
      ];
    },
  },
```


#### log
当您调试vue的代码时，有chrome以及vue的devtools，对于绝大部分功能的调试都会得心应手，但是当面对一个封装好的指令时候，调试工具好像不太擅长应对这种情况，你无法得知指令进行到哪里被卡住了，以及你传入的参数是否让指令正常工作

这个时候，您需要显示的传入log为true，v-dragresize会在关键节点打出相关日志，方便问题的排查。











### 事件


#### resizeHandle

虽然指令内部提供了cascadeElCssList来实现联动其他dom的css属性变更，但我想现实中的情况一定会更加的复杂，没关系。v-dragresize还提供了resizeHandle事件来协助您解决这个问题


当mouseMove经过节流器的限制，触发了一次css属性更新，resizeHandle会紧随其后被调用，resizeHandle会帮助您拿到一个computedMoveOffset的参数，这个值就是在拖动时，元素应该增加/减少的px值

举个例子：一个input框高度为100px，用鼠标拖动上边框往上不断移动，当移动到60px时，此时input高度160px，
resizeHandle被触发时，computedMoveOffset就是60；

```js
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: 'top',
          setCssProperty: 'padding-top',
          resizeHandle: computedMoveOffset => {
            // 自定义一些操作
          }
        }
      ];
    }
  },
```



#### dragDoneHandle

当用户完成拖拽，鼠标mouseUp的时候，dragDoneHandle会被触发，并拿到两个参数

1. 完成拖拽后，被拖拽元素以及级联元素的el以及最终的css属性值
2. 这条边的所有配置信息

```js
  computed: {
    dragConfig() {
      return [
        {
          dragBorder: 'top',
          setCssProperty: 'padding-top',
          dragDoneHandle: (mouseUpComputedStyle, configItem) => {
            // 自定义一些操作
          }
        }
      ];
    }
  },

```

