document.querySelectorAll('.markdown pre').forEach(pre => {
    const languageClass = Array.from(pre.classList).find(className => className.startsWith('language-'));
    const language = languageClass ? languageClass.replace('language-', '') : 'Unknown';
    const code = pre.querySelector('code');
    let supportLanguage = ['javascript', 'js'];
    let note = 
    {
        'javascript':"//",
        'python':"#",
        'java':"//",
        'c':"//",
        'cpp':"//",
        'c#':"//",
        'php':"//",
        'ruby':"#",
        'swift':"//",
        'go':"//",
        'kotlin':"//",
        'typescript':"//",
    }

    if (!code) {return;} // 如果没有代码块，跳过

    const tip = document.createElement('span');
    tip.textContent = `${note[language]} ${language} 代码需要在云端运行`;
    if(!supportLanguage.includes(language)){
        code.appendChild(tip);
    }

    const button = document.createElement('button');
    button.textContent = 'Run';
    button.classList.add('run-btn');
    pre.appendChild(button);

    button.addEventListener('click', () => {
        const text = code.textContent || code.innerText;
        
        // console.log('运行代码:', text);

        // 运行代码的逻辑
        if (language === 'javascript') {
            try {
                eval(text);
            } catch (error) {
                console.error('运行失败:', error);
            }
        } else {
            let requestsPack = 'https://doc.maichc.club/api@runner/' + language + '/authorized_keys/auto_version/' + encodeURIComponent(text);
            console.log(requestsPack);
            fetch(requestsPack, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 此处需要使用 QCR 框架提前设置好 token，否则会遭遇跨域问题和权限问题
                },
                body: JSON.stringify({ code: text })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('运行失败:', data.error);
                } else {
                    console.log('运行结果:', data.result);
                }
            })
            .catch(error => {
                console.error('请求失败:', error);
            });
        
            // console.warn('不支持的语言:', language);
        }
    });

});