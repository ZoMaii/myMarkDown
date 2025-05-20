/**
 * Markdown 私有化代码组件 - 废案
 * @prerequisite maic_md.css
 * @workbench General.Private
 * @description 危险代码内容，导入它之前确认代码仅限于虚拟机使用而不影响宿主机！
 * @version 20250520
 * @date 2025-5-20
 * @license https://github.com/zomaii/myMarkDown/blob/main/License
*/

//  Dangerous code content,
//  before importing,
//  please make sure that the operating environment is segmented from the host to avoid potential threats!


// 劫持事件监听器，将事件添加到新属性 __events__ 中供其他代码使用
// 这违背了原本的设计意图，但在个人使用的情况下可能是有用的，例如对 attr.* 提供一定的监听能力
(function() {
    const originAdd = Element.prototype.addEventListener;
    Element.prototype.addEventListener = function(type, listener, options) {
        if (!this.__events__) this.__events__ = {};
        if (!this.__events__[type]) this.__events__[type] = [];
        this.__events__[type].push(listener);
        originAdd.call(this, type, listener, options);
    };
})();
