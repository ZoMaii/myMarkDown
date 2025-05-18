class code_copy {
    static origin() {
        return "my_markdown.workbench.Public.code";
    }

    static main() {
        document.querySelectorAll(my_markdown.workbench.Public.code.super).forEach(pre => {
            const code = pre.querySelector('code');
            if (!code) {return;}

            const copyButton = document.createElement('button');
            copyButton.classList.add('flex-btn');
            copyButton.textContent = 'Copy';
            copyButton.title = '复制代码';
            myMarkDown_code.btnMapRight(pre).then((result) => {
            if (result.hasBtn) {
                copyButton.style.right = (result.right + 60) + 'px';
            }
            else {
                copyButton.style.right = '10px';
            }
        });
            pre.appendChild(copyButton);

            copyButton.addEventListener('click', () => {
                const code = pre.querySelector('code').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                }).catch(err => {
                    console.error('复制失败:', err);
                    copyButton.textContent = 'Failed!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                });
            });
        });
    }
}

myMarkDown_code.AutoApply('copy', code_copy);