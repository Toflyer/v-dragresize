
// 必填参数
export const requiredArgs = ['dragBorder', 'setCssProperty'];
// 竖向
export const vertical = ['top', 'bottom'];
// 横向
export const horizontal = ['left', 'right'];

// 每条边的参数模版配置
export const defaultConfig = {
    // 必填项目
    dragBorder: 'top', // enum: top left bottom right
    setCssProperty: 'height', // '' || String  如果为''就取消setProperty

    // 非必填写
    min: Number.NEGATIVE_INFINITY, // min和max限制 针对当前拖动的边 + cascadeElCssList同时生效
    max: Number.POSITIVE_INFINITY,
    cascadeElCssList: [], // 级联属性 [{cssSelector,setCssProperty,follow }] el,activeCssPropertyValue会在为代码运行后添加,无需传递
    dragAreaSize: '5px', //热区大小，默认5px
    eventPropagation: false, //  默认不冒泡/不捕获
    mouseMoveContentCssSelector: '', //鼠标移动触发监听的区域，默认为全局
    customDragLineStyle: {}, // 覆盖拖拽线的原有样式
    resizeHandle: '', // '' || function  // 
    dragDoneHandle: '', // '' || function  //
    frequencyThrottleNum: 2, // 0为不节流,默认2,mouseMove触发每隔3次执行一次, 1: 50% 2:66% <16>  3:75% <9>
    memoryPositionKey: '', // 是否记录位置信息，如果记录传入一个key，放入localStorage中
    log: false, // 默认不打日志


    // 目前所有的css单位都支持，只不过会使用px进行拖动计算
    // 运算时添加的属性
    // rootEl 指令所在的el
    // oldElCssPropertyValue
    // mouseMoveContentEl
    // dragLineEl
    // activeCssPropertyValue:
    // throttleFn 节流器fn
};