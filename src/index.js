import { vertical, horizontal } from './const/index';
import {
    wLog,
    getType,
    checkData,
    argsMerge,
    frequencyThrottle,
    helpCreateDragLine,
    computedStyleCssValue,
    justComputedDirection,
    openOrforbidUserSelect,
    getMemoryPositionString,
    getMouseUpComputedStyle,
    insertUserSelectNoneStyleSheet,
    utilSetCssProperty
} from './utils/index';

// 创建一个拖动线
const createDragLine = function (rootEl, configArr) {
    return configArr.map(item => {
        // 创建拖动线 && 设置启动监听
        return {
            ...item,
            dragLineEl: helpCreateDragLine(rootEl, item)
        };
    });
};

// 获取到el和级联el在鼠标点击时的css属性
const getElAndcascadeElOldCssValue = function (item) {
    item.oldElCssPropertyValue = computedStyleCssValue(
        item.rootEl,
        item.setCssProperty
    );
    item.cascadeElCssList.forEach(cascadeItem => {
        cascadeItem.oldElCssPropertyValue = computedStyleCssValue(
            cascadeItem.el,
            cascadeItem.setCssProperty
        );
    });
};

// 设置级联的css属性
const handleCascadeElCssList = function (
    cascadeElCssList,
    computedMoveOffset,
    item
) {
    cascadeElCssList.forEach(cascadeItem => {
        if (!cascadeItem.el) return;
        let move =
            +cascadeItem.oldElCssPropertyValue +
            (cascadeItem.follow ? computedMoveOffset : -computedMoveOffset);
        // 设置css属性
        utilSetCssProperty(cascadeItem.el, cascadeItem.setCssProperty, move);
        //log区域
        item.log && wLog(`拖动设置级联${cascadeItem.setCssProperty}:${move}px`);
    });
};

// 拖动的时候设置css属性
const handleSetProperty = (moveOffset, item) => {
    let computedMoveOffset = justComputedDirection(item.dragBorder, moveOffset);
    //计算偏移量
    let move = +item.oldElCssPropertyValue + computedMoveOffset;
    // 范围限制
    if (move < item.min || move > item.max) return;
    // log区域
    item.log && wLog(`拖动设置${item.setCssProperty}:${move}px`);
    // debugger;
    // 如果非空，修改setProperty
    item.setCssProperty && utilSetCssProperty(item.rootEl, item.setCssProperty, move);
    // 设置级联的css属性
    item.cascadeElCssList.length !== 0 &&
        handleCascadeElCssList(item.cascadeElCssList, computedMoveOffset, item);
    // 处理拖动回调
    item.resizeHandle &&
        getType(item.resizeHandle) === 'Function' &&
        item.resizeHandle(computedMoveOffset);
};

// 鼠标移动事件
const handleMouseMove = function (event, item, oldX, oldY, isMouseDown) {
    if (item.throttleFn && !item.throttleFn()) {
        item.log && wLog('-------节流--------',);
        return;
    }
    item.log && wLog('%c-------mouseMoveSetting--------', 'font-weight: bold;  color:#ef11ff;');
    !item.eventPropagation && event.stopPropagation();
    if (!isMouseDown) return;
    // 获取鼠标移动的距离
    let moveY = event.clientY - oldY;
    let moveX = event.clientX - oldX;
    //水平方向移动
    if (horizontal.includes(item.dragBorder)) {
        item.log && wLog(`鼠标水平方向移动:${moveX}px`);
        handleSetProperty(moveX, item);
    }
    //垂直方向移动
    if (vertical.includes(item.dragBorder)) {
        item.log && wLog(`鼠标垂直方向移动:${moveY}px`);
        handleSetProperty(moveY, item);
    }
};
const memoryPositionInLocalStorage = function (item) {
    localStorage.setItem(item.memoryPositionKey, getMemoryPositionString(item));
    item.log && wLog('已经记录拖动位置到localStorage，记录信息:', localStorage.getItem(item.memoryPositionKey));
};

const setMemoryPosition = function (item) {
    try {
        const memoryPositionStr = localStorage.getItem(item.memoryPositionKey);
        if (!memoryPositionStr) return;
        const memoryPositionObj = JSON.parse(memoryPositionStr);
        // 首选设定rootEl的样式
        utilSetCssProperty(item.rootEl, memoryPositionObj.setCssProperty, memoryPositionObj.setCssPropertyValue);
        // 然后设置级联样式
        memoryPositionObj.cascadeCssPropertyList.forEach(cascadeItem => {
            const cascadeItemEl = document.querySelector(cascadeItem.cssSelector);
            utilSetCssProperty(cascadeItemEl, cascadeItem.setCssProperty, cascadeItem.setCssPropertyValue);
        });
        item.log && wLog('已经回显记忆的拖动位置到页面，回显信息:', localStorage.getItem(item.memoryPositionKey));
    } catch (e) {
        console.warn('记忆位置回显失败');
        localStorage.setItem('____v-dragResizeErrorRecord', e);
    }
};

const handleMouseUp = function (event, item, addEventListenerControl) {
    item.log && wLog('mouseup');
    item.log && wLog('dragBorderConfig', item);
    !item.eventPropagation && event.stopPropagation();
    // 移除监听
    addEventListenerControl.abort();
    // 移除body的user-select:none
    openOrforbidUserSelect(false);
    // 单次拖拽结束
    item.dragDoneHandle &&
        getType(item.dragDoneHandle) === 'Function' &&
        item.dragDoneHandle(getMouseUpComputedStyle(item), item);
    item.memoryPositionKey && memoryPositionInLocalStorage(item);
    // 做一些reset的操作
    return {
        isMouseDown: false,
        oldY: 0,
        oldX: 0,
    };
};


function install(Vue, options = {}) {
    //向页面插入UserSelectNone样式表
    insertUserSelectNoneStyleSheet();
    // 添加全局指令
    Vue.directive('dragresize', {
        inserted(rootEl, binding) {
            if (!checkData(rootEl, binding.value)) return;
            // 配置信息;
            let configArr = [];
            let isMouseDown = false;
            // 上一次的鼠标的X或者Y坐标
            let oldY = 0;
            let oldX = 0;
            // 参数合并
            configArr = argsMerge(binding.value);
            // 创建拖动线 && 添加到页面
            configArr = createDragLine(rootEl, configArr);
            // 启动监听
            configArr.forEach(item => {
                //每条边的item配置下，保存操作的el
                item.rootEl = rootEl;
                // 如果记录了历史位置，就设置历史位置
                item.memoryPositionKey && setMemoryPosition(item);
                item.dragLineEl.addEventListener('mousedown', mouseEvent => {
                    item.log && wLog('mousedown');
                    // 注册节流器
                    item.frequencyThrottleNum !== 0 &&
                        (item.throttleFn = frequencyThrottle(
                            item.frequencyThrottleNum + 1
                        ));
                    // 事件传播
                    !item.eventPropagation && mouseEvent.stopPropagation();
                    let addEventListenerControl = new AbortController();
                    // 获取拖动时候需要改变css属性的原始值，单位PX,放到item里面
                    getElAndcascadeElOldCssValue(item);
                    // 设定user-select为none
                    openOrforbidUserSelect(true);
                    // 鼠标按下开始
                    isMouseDown = true;
                    oldY = mouseEvent.clientY;
                    oldX = mouseEvent.clientX;
                    let mousemoveContext = item.mouseMoveContentEl ?? window;
                    // 多次注册，只会触发一次
                    mousemoveContext.addEventListener(
                        'mousemove',
                        e => {
                            handleMouseMove(e, item, oldX, oldY, isMouseDown);
                        },
                        {
                            signal: addEventListenerControl.signal
                        }
                    );
                    window.addEventListener(
                        'mouseup',
                        e => {
                            let { isMouseDown: resetM, oldX: resetX, oldY: resetY } = handleMouseUp(e, item, addEventListenerControl);
                            isMouseDown = resetM;
                            oldX = resetX;
                            oldY = resetY;
                        },
                        {
                            signal: addEventListenerControl.signal
                        }
                    );
                });
            });
        }
    });
}
export default {
    install
};
