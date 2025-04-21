document.querySelectorAll('.markdown pre').forEach(pre => {
    const languageClass = Array.from(pre.classList).find(className => className.startsWith('language-'));
    const code = pre.querySelector('code');

    if (!code) {return;} // 如果没有代码块，跳过

    const button = document.createElement('button');
    button.textContent = 'Run';
    button.classList.add('run-btn');
    pre.appendChild(button);

    button.addEventListener('click', () => {
        const text = code.textContent || code.innerText;
        const language = languageClass ? languageClass.replace('language-', '') : 'Unknown';
        // console.log('运行代码:', text);

        // 运行代码的逻辑
        if (language === 'javascript') {
            try {
                eval(text);
            } catch (error) {
                console.error('运行失败:', error);
            }
        } else {
            //To do 待做其他语言的运行逻辑，主要采用云端运行的方式。
            let requestsPack = 'https://doc.maichc.club/api@runner/' + language + '/authorized_keys/auto_version/' + encodeURIComponent(text);
            console.log(requestsPack);
            console.warn('不支持的语言:', language);
        }
    });

});