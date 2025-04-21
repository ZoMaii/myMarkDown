document.querySelectorAll('.markdown pre').forEach(pre => {
    const code = pre.querySelector('code');
    if (!code) {return;} // 如果没有代码块，跳过

    // 获取语言类型（例如 'language-javascript'）
    const languageClass = Array.from(pre.classList).find(className => className.startsWith('language-'));
    const language = languageClass ? languageClass.replace('language-', '') : ' ';

    // 创建语言标签元素
    const languageLabel = document.createElement('span');
    languageLabel.classList.add('language-label');
    languageLabel.textContent = language;

    // 将语言标签添加到代码块左上角
    pre.appendChild(languageLabel);

    // 创建复制按钮
    const button = document.createElement('button');
    button.textContent = 'Copy';
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
