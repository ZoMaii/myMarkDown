/**
 * markdown 代码视图
 * @preprequisite maic_md.css、markdown.code.runner.js
 * @workbench Private
 * @description 此脚本为 markdown pre code 元素提供额外的显示功能，例如 .csv 文件。需要和 markdown.code.runner.js 配合使用。
 * @version 20250506
 * @date 2025-5-6
 * @license https://github.com/zomaii/myMarkDown/blob/main/License
*/

/**
 * callPannel 初级界面绘制
 * @param {Element} who pre 父元素
 * @param {boolean} once 是否为流传输
 * @param {any} text 添加的数据内容  
 */
function callPannel(who,once,text) {
    // 这里是展示运行结果的逻辑
    try{
        const code = who.querySelector('code');
        if(!who.querySelector('view')){
            code.style.display = 'none';
            view = document.createElement('view');
            view.innerHTML = text;
            who.appendChild(view);
        }else if(!once){
            view = who.querySelector('view');
            view.innerHTML += '<br>';
            view.innerHTML += text;
        }
    }catch(e){
        console.log(e);
        alert('发生错误，请在控制台查看报告');
    }
    
}