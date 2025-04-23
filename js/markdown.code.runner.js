/**
 * Markdown 代码运行器
 * @prerequisite maic_md.css
 * @workbench General.Private
 * @description 该脚本为代码块元素(pre>code)添加运行按钮功能，支持多种语言的代码运行。请确保在使用前已加载相关的 CSS 和 JS 文件。
 * @version 20250423
 * @date 2025-4-23
 * @license https://github.com/zomaii/myMarkDown/blob/main/License
*/



document.querySelectorAll('.markdown pre').forEach(pre => {
    const languageClass = Array.from(pre.classList).find(className => className.startsWith('language-'));
    const language = languageClass ? languageClass.replace('language-', '') : 'Unknown';
    const code = pre.querySelector('code');
    let supportLanguage = /^(javascript|js)$/i;
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
    };

    if (!code) {return;} // 如果没有代码块，跳过

    // 创建语言标签元素
    const languageLabel = document.createElement('span');
    languageLabel.classList.add('language-label');
    languageLabel.textContent = language;

    if(!pre.querySelector('.language-label')){
        pre.appendChild(languageLabel);
    }

    const tip = document.createElement('span');
    tip.textContent = `${note[language]} ${language} 代码未在浏览器中受到支持，将采用云端运行方式`;
    if(!supportLanguage.test(language)){
        code.appendChild(tip);
    }

    const button = document.createElement('button');
    button.textContent = 'Run';
    button.title = '运行代码';
    button.classList.add('run-btn');
    pre.appendChild(button);

    if(!pre.querySelector('.copy-btn')){
        button.style.right = '10px';
    }
    
    

    button.addEventListener('click', () => {
        const text = code.textContent || code.innerText;
        
        // console.log('运行代码:', text);

        // 运行代码的逻辑
        if (supportLanguage.test(language)) {
            
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
                default: 'https://doc.maichc.club/api@runner/' + language + '/authorized_keys/auto_version/',
                self_Server: 'http://localhost:8088/webapp/markdown/runner/',
                // 其他服务器响应地址
            };

            // 使用异步函数控制流程
            const runWithFallback = async () => {
                const urls = Object.values(Pack); // 获取所有服务器地址
                
                for (const url of urls) {
                try {
                    let applyURL;
                    if(text.length>=512){
                        applyURL = url + 'check/'+MD5.hash(text);
                    }else{
                        applyURL = url + encodeURIComponent(text);
                    }

                    console.log('正在尝试:', applyURL);
                    makePACK={
                        // 根据服务商的 WEB 服务器配置，这段代码需要自行修改
                        // 如果程序设计是在 ROUTE(GET地址，确保自动登录/匿名登录正常有效) 响应，POST 接收数据抽样验证并运行(注意GET字符提交限制)，则无需修改
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        // 此部分为兼容性内容，可根据需要配置
                        body: JSON.stringify({ code: text ,check:MD5.hash(text)})
                    };
                    // console.log('请求参数:', makePACK);
                    const response = await fetch(applyURL, makePACK);
            
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