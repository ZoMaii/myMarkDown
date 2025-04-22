document.querySelectorAll('.markdown pre').forEach(pre => {
    const languageClass = Array.from(pre.classList).find(className => className.startsWith('language-'));
    const language = languageClass ? languageClass.replace('language-', '') : 'Unknown';
    const code = pre.querySelector('code');
    let supportLanguage = ['javascript', 'js'];
    let note = 
    {
        'javascript':"//",
        'js':"//",
        'python':"#",
        'java':"//",
        'c':"//",
        'cpp':"//",
        'c++':"//",
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
    tip.textContent = `${note[language]} ${language} 代码未在浏览器中受到支持，将采用云端运行方式`;
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
        // 正则表达式匹配?[JjSs] / [JjAaVvSsCcRrIiPpTt] ?
        if (supportLanguage.includes(language)) {
            
            try {
                // 使用 Function 构造函数来执行 JavaScript 代码
                const exec = new Function(text);
                exec();
            } catch (error) {
                console.error('运行失败:', error);
            }

        } else {

            // MaicQCR 启用 SOCKET(根据是否需要BT、BLE、NFC、LAN连接而选用COM) 和 iStream 的 Webapp/markdown/runner 就可以直接使用，无需配置自托管服务器内容。
            // PHP 建议采用 ThinkPHP 框架避免重复写路由
            // 其他语言建议采用 NGINX 代理流量避免重复写路由
            let Pack =
            {
                default: 'https://doc.maichc.club/api@runner/' + language + '/authorized_keys/auto_version/' + encodeURIComponent(text),
                self_Server: 'http://localhost:8088/webapp/markdown/runner/'+encodeURIComponent(text),
                // 其他服务器响应地址
            };

            // 使用异步函数控制流程
            const runWithFallback = async () => {
                const urls = Object.values(Pack); // 获取所有服务器地址
                
                for (const url of urls) {
                try {
                    console.log('正在尝试:', url);
                    
                    const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: text })
                    });
            
                    if (!response.ok) {throw new Error(`HTTP ${response.status}`);};
                    
                    const data = await response.json();
                    if (data.error) {throw new Error(data.error);};
            
                    console.log('运行成功:', data.result);
                    alert('运行结果:\n' + data.result);
                    return; // 成功则终止
            
                } catch (error) {
                    console.warn(`请求失败 [${url}]:`, error.message);
                }
                }
                
                console.error('所有服务器均不可用');
            };
            
            // 执行
            runWithFallback();
        }
    });

});