import { defaultConfig, requiredArgs, horizontal, vertical } from '../const/index';

//次数节流
export const frequencyThrottle = (num) => {
    // [true,false,false]
    let arr = new Array(num).fill(true).fill(false, 1);
    let index = 0;
    return function () {
        return arr[index++ % arr.length];
    };
};
export const wLog = function (...arg) {
    return console.warn(...arg);
};

export const insertUserSelectNoneStyleSheet = () => {
    let styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = '.__user-select-none { user-select: none }';
    document.head.appendChild(styleElement);
};

export const openOrforbidUserSelect = (flag) => {
    // 修改selectNode
    const addOrRemove = flag ? 'add' : 'remove';
    document.body.classList[addOrRemove]('__user-select-none');
};

export const toCamelCase = (str) => {
    return str.replace(/-([a-z])/g, function (match, letter) {
        return letter.toUpperCase();
    });
};
export const utilSetCssProperty = (el, key, val) => {
    el.style.setProperty(key, val + 'px');
};


export const computedStyleCssValue = (el, cssProperty) => {
    return getComputedStyle(el)?.[toCamelCase(cssProperty)]?.slice(0, -2) ?? 0;
};

export const getMemoryPositionString = (item) => {
    return JSON.stringify({
        setCssProperty: item.setCssProperty,
        setCssPropertyValue: computedStyleCssValue(item.rootEl, item.setCssProperty),
        cascadeCssPropertyList: item.cascadeElCssList.map(cascadeItem => {
            return {
                cssSelector: cascadeItem.cssSelector,
                setCssProperty: cascadeItem.setCssProperty,
                setCssPropertyValue: computedStyleCssValue(cascadeItem.el, cascadeItem.setCssProperty),
            };
        })
    });
};

export const getMouseUpComputedStyle = (item) => {
    return {
        rootEl: item.rootEl,
        [item.setCssProperty]: computedStyleCssValue(item.rootEl, item.setCssProperty) + 'px',
        cascadeCssProperty: item.cascadeElCssList.map(cascadeItem => {
            return {
                el: cascadeItem.el,
                [cascadeItem.setCssProperty]: computedStyleCssValue(cascadeItem.el, cascadeItem.setCssProperty) + 'px'
            };
        })
    };

};

export const getType = (target) => {
    return Object.prototype.toString.call(target).split(' ')[1].slice(0, -1);
};


//检查el是否为relative
export const checkElisStatic = (el) => {
    return window.getComputedStyle(el).getPropertyValue('position') !== 'static';
};

// 参数合并
export const argsMerge = (optionsArr = []) => {
    return optionsArr.map(item => {
        // 将所有的选择器转换为dom节点
        item.mouseMoveContentEl = document.querySelector(item.mouseMoveContentCssSelector);
        item.cascadeElCssList?.forEach(cascadeItem => {
            cascadeItem.el = document.querySelector(cascadeItem.cssSelector);
        });
        return {
            ...defaultConfig,
            ...item,
        };
    });
};
// 必填字段
export const argsArrItemCheck = (args) => {
    return args.every(item => {
        for (let i = 0; i < requiredArgs.length; i++) {
            if (!item.hasOwnProperty(requiredArgs[i])) {
                return false;
            }
        }
        return true;
    });
};

export const helpCreateDragLine = (rootEl, item) => {
    let dragLine = document.createElement('div');
    // 公共样式
    dragLine.style.position = 'absolute';
    dragLine.style[item.dragBorder] = '0';
    //特定样式
    if (horizontal.includes(item.dragBorder)) {
        // 水平拖动
        dragLine.style.width = item.dragAreaSize;
        dragLine.style.height = '100%';
        dragLine.style.cursor = 'ew-resize';
        dragLine.style.top = '0';
    }
    if (vertical.includes(item.dragBorder)) {
        //垂直方向拖动
        dragLine.style.height = item.dragAreaSize;
        dragLine.style.width = '100%';
        dragLine.style.cursor = 'ns-resize';
        dragLine.style.left = '0';
    }
    // 用户自定义样式注入
    Object.entries(item.customDragLineStyle).forEach(([key, value]) => {
        dragLine.style[toCamelCase(key)] = value;
    });

    rootEl.appendChild(dragLine);
    return dragLine;
};

// 调整计算的方向
export const justComputedDirection = (direction, val) => {
    switch (direction) {
        case 'top':
            return -val;
        case 'bottom':
            return val;
        case 'left':
            return -val;
        case 'right':
            return val;
    }
};

// 数据的合规性校验
export const checkData = (rootEl, args) => {
    // 判断el是否为static
    if (!checkElisStatic(rootEl)) {
        console.error('v-dragresize el element position should not static');
        return false;
    }
    // 判断入参是否为数组
    if (!Array.isArray(args)) {
        console.error('options must be an array');
        return false;
    }
    // 判断必填字段
    if (!argsArrItemCheck(args)) {
        console.error(`Array item must have ${requiredArgs.join(',')} property`);
        return false;
    }
    return true;
};