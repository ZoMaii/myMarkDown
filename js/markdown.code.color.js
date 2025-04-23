/**
 * Markdown 代码块高亮
 * @prerequisite maic_md.css、markdown.js
 * @workbench Private
 * @description 该脚本用于对 Markdown 中的代码块进行高亮显示，此文件依赖于 myMarkDown>markdown.js 的初始化。
 * @version 20250423
 * @date 2025-4-23
 * @license https://github.com/zomaii/myMarkDown/blob/main/License
*/



// 此文件主要用于对 Markdown 中的代码块进行高亮显示，新增支持下述功能：
// 1. 静态更新：在页面加载完成后，对所有的代码块进行高亮处理。
// 2. 动态更新：对新增的代码块进行高亮处理。



// 规避 type=module 的 CORS 以及 类型推导不可用 的问题
if (typeof my_markdown === 'object') {
    my_markdown.code = my_markdown.code || {};
    my_markdown.code.color = 
    {
        RegExp:
        {
            string: /".*"|'.*'/g,                          // 字符串
            set: /\b=\b|==|>=|<=|!=/g,                     // 赋值运算符
            function: /\S+\(.*\)/g,                        // 函数定义
            parme: /\(.*\)/g,                              // 函数参数
            number: /\b\d+(\.\d+)?\b/g,                    // 数字
            notes: /\/\/.*|\/\*[\s\S]*?\*\//g,             // 注释
            boolean: /\b(true|True|false|False)\b/g,       // 布尔值
        },
        colors:
        {
            function: '#ff6347',    // Tomato
            string: '#32cd32',      // LimeGreen
            parme: '#a9a9a9',       // DarkGray
            number: '#4682b4',      // SteelBlue
            boolean: '#8a2be2',     // BlueViolet
            notes: '#808080',       // Gray
            set: '#0000FF',         // Blue
            give: '#0000FF',        // Blue
        }
    };
} else {
    console.error('请先加载前置库 myMarkDown>markdown.js');
}


console.log(my_markdown);



const workQueue = []; // 工作队列，用于存储需要处理的元素



// 将静态数据加入工作队列
xpath('//pre').forEach(function (element) {
    workQueue.push(element); // 将元素加入队列

    /*
     * Warning:  主题开发错误例子提醒！
     * 
     * 以下代码适用于 markdown.code.color.js 在最后的位置引入的情况，否则只能在个数上发现足够的元素
     * 但是额外的元素无法被读取到，因为对浏览器安全而言，即便引用是以明文方式写出，按顺序依旧是不予以加载的！
     */
    // console.log(element.querySelectorAll("code")[0].children); 
    // Array.from(element.querySelectorAll("code")[0].children).forEach(child => {
    //     console.log(child); // 输出每个子元素
    //     // 在这里可以对每个子元素进行处理
    // });
});



// 定义一个函数，用于处理队列中的元素
function processWorkQueue() {
    while (workQueue.length > 0) {
        const element = workQueue.shift(); // 从队列中取出第一个元素
        console.log('处理元素:', element); // 输出当前处理的元素

        const codeElement = element.querySelector('code');
        if (!codeElement || !(codeElement instanceof Element)) {
            console.warn('未找到有效的 <code> 元素:', element);
            continue;
        }

        // 获取所有的 span 元素
        const spans = codeElement.querySelectorAll('span');
        // console.log('静态处理的 span 元素:', spans);

        // 遍历每个 span 元素
        spans.forEach(span => {
            let text = span.innerHTML; // 获取文本内容

            // 遍历正则表达式类型
            if (my_markdown.code.color.RegExp && typeof my_markdown.code.color.RegExp === 'object') {
                Object.keys(my_markdown.code.color.RegExp).forEach(key => {
                    const regex = my_markdown.code.color.RegExp[key];
                    const color = my_markdown.code.color.colors[key];

                    // 如果匹配，修改颜色
                    if (regex && regex.test(text)) {
                        text = text.replace(regex, match => {
                            return `<font color="${color}">${match}</font>`;
                        });
                    }
                });
            } else {
                console.warn('my_markdown.code.color.RegExp 未定义或不是对象');
            }

            // 将处理后的文本插回 span 元素
            span.innerHTML = text;
        });
    }
}


// 处理队列中的静态数据
processWorkQueue();

// 动态监听更新，只对动态有变更的部分进行颜色重解析
xpath('//pre/code').forEach(function (codeElement) {
    if (!codeElement || !(codeElement instanceof Element)) {
        return;
    }

    monitorDOMChanges(codeElement, function (mutation) {
        // 处理子节点的变化
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.matches('span')) { 
                console.log('新增的 <span> 节点:', node); // 输出新增的 <span> 节点

                // 处理新增的 <span> 节点内容
                let text = node.innerHTML; // 获取文本内容

                // 遍历正则表达式类型
                if (my_markdown.code.color.RegExp && typeof my_markdown.code.color.RegExp === 'object') {
                    Object.keys(my_markdown.code.color.RegExp).forEach(key => {
                        const regex = my_markdown.code.color.RegExp[key];
                        const color = my_markdown.code.color.colors[key];

                        // 如果匹配，修改颜色
                        if (regex && regex.test(text)) {
                            text = text.replace(regex, match => {
                                return `<font color="${color}">${match}</font>`;
                            });
                        }
                    });
                } else {
                    console.warn('my_markdown.code.color.RegExp 未定义或不是对象');
                }

                // 将处理后的文本插回 <span> 元素
                node.innerHTML = text;
            }
        });
    });
});

