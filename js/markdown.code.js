/**
 * Markdown Code 组件
 * @prerequisite maic_md.css
 * @workbench General.Private
 * @description 该脚本为代码块元素(pre>code)添加语言标签和复制按钮功能。
 * @version 20250423
 * @date 2025-4-23
 * @license https://github.com/zomaii/myMarkDown/blob/main/License
*/


// MaicWorkbench > General.* 意味着此模块脚本代码可以独立运行
document.querySelectorAll('.markdown pre').forEach(pre => {
    const code = pre.querySelector('code');
    if (!code) {return;} // 如果没有代码块，跳过

    // 获取语言类型（例如 'language-javascript'）
    const languageClass = Array.from(pre.classList).find(className => className.startsWith('language-'));
    const language = languageClass ? languageClass.replace('language-', '') : 'Unknown';

    // 创建语言标签元素
    const languageLabel = document.createElement('span');
    languageLabel.classList.add('language-label');
    languageLabel.textContent = language;

    // 将语言标签添加到代码块左上角
    if (!pre.querySelector('.language-label')) {
        pre.appendChild(languageLabel);
    }

    // 创建复制按钮
    const button = document.createElement('button');
    button.textContent = 'Copy';
    button.title = '复制代码';
    button.classList.add('copy-btn');
    pre.appendChild(button);

    // 复制按钮功能
    button.addEventListener('click', () => {
        const code = pre.querySelector('code');
        const text = code.textContent || code.innerText;

        // 使用 Clipboard API 复制内容
        navigator.clipboard.writeText(text)
            .then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            })
            .catch(err => {
                console.error('复制失败:', err);
                button.textContent = 'Failed!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
    });
});
