/**
 * Markdown 前端化组件
 * @prerequisite maic_md.css
 * @workbench General
 * @description 该脚本属于格式化的 Markdown 组件，为前端可视化提供支撑，在文档加载完成后执行。
 * @version 20250423
 * @date 2025-4-23
 * @license https://github.com/zomaii/myMarkDown/blob/main/License
*/



// myMarkDown > markdown.js 推荐的最佳实践如下：
// 1. 网页展示情况下 element.markdown 推荐写法是 div.markdown，而非 body.markdown。
// 2. CSS 选择器应该对 element.markdown 的子元素进行 all:initial 处理，避免影响其他元素。
// 3. JavaScript Doc 的 workbench 标识在非 General.* 情况下不推荐引用此文件，避免与其他组件冲突。
// 4. 遵循最基础的数据清洗要求，应当处理单纯的数据，避免直接在复杂环境下运行。
// 5. 如果 GUI 部分出现问题，请尝试将该文件放在最后执行，部分开发者不会采用 monitorDOMChanges 处理动态变化问题，同时也不会考虑业务工作队列问题。
// 6. 建议将此文件的引入放在 HTML 的底部，确保 DOM 元素已经加载完成。同时放到 myMarkDown 的起始部分，确保组件顺序加载无误。



// 全局对象注册，如果有 module，则注册为模块
var my_markdown = {};



/**
 * XPath 选择器函数
 * @description 该函数用于在文档中使用 XPath 选择器选择元素。
 * @param {string} xpath - XPath 表达式。
 * @param {Element} context - 上下文元素，默认为 document。
 * @return {Array} 选择到的元素数组。
 * @example 
 * - xpath('//*[@id="copy-btn"]', document); // 选择 ID 为 copy-btn 的元素
 * - xpath('//div[@class="markdown"]'); // 选择 class 为 markdown 的 div 元素
*/
function xpath(xpath, context) {
    var result = [];
    try {
        // 验证 context 是否为合法的 DOM 元素，尝试避免复杂情况攻击
        if (context && !(context instanceof Element) && !(context instanceof Document)) {
            throw new Error('提供给 XPath 的上下文不是有效的 DOM 元素或文档。');
        }

        // 验证 xpath 是否为非空字符串
        if (typeof xpath !== 'string' || xpath.trim() === '') {
            throw new Error('XPath 表达式必须是非空字符串。');
        }

        // 如果 context 是 iframe 元素，尝试使用其 contentDocument
        if (context && context.tagName === 'IFRAME') {
            try {
                context = context.contentDocument || context.contentWindow.document;
            } catch (error) {
                console.error('iframe 跨域请求被拒绝:', error);
                return result; // 返回空数组，避免进一步操作
            }
        }

        // 执行 XPath 查询
        var nodesSnapshot = (context || document).evaluate(xpath, context || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
            result.push(nodesSnapshot.snapshotItem(i));
        }
    } catch (error) {
        console.error('XPath 无法解析:', error);
    }
    return result;
};



/**
 * 监控指定 DOM 的变化
 * @description 该函数使用 MutationObserver 监控指定 DOM 元素的变化，并在变化发生时调用回调函数。
 * @param {Element} targetNode - 要监控的 DOM 元素，可通过传空值或 null 来停止监控。
 * @param {Function} callback - 当 DOM 发生变化时的回调函数，推荐写法：(mutation) => {}
 */
function monitorDOMChanges(targetNode, callback) {
    if (!(targetNode instanceof Element)) {
        throw new Error('传入的参数必须是一个有效的 DOM 元素。');
    }

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            callback(mutation); // 调用回调函数，传递变化信息
        }
    });

    // 配置观察选项
    const config = {
        childList: true,        // 监听子节点的添加或删除
        // attributes: true,       // 监听属性的变化
        // subtree: true,          // 监听整个子树的变化
        // characterData: true     // 监听节点内容或文本的变化
    };

    // 开始监控目标节点
    observer.observe(targetNode, config);

    // 返回一个停止监控的函数
    return () => observer.disconnect();
}