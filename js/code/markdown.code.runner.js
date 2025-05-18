class code_runner {
    static origin() {
        return "my_markdown.workbench.Public.code";
    }

    #supportLanguage = /^(javascript|js)$/i;
    #dataLang = /^(csv|json)$/i;
    #knownNote =
    {
        'javascript': "//",
        'js': "//",
        'python': "#",
        'java': "//",
        'c': "//",
        'cpp': "//",
        'c++': "//",
        'c#': "//",
        'php': "//",
        'ruby': "#",
        'swift': "//",
        'go': "//",
        'kotlin': "//",
        'typescript': "//",
    }

    static createRunBtn(Select) {
        const runBtn = document.createElement('button');
        runBtn.classList.add('flex-btn');
        runBtn.textContent = 'Run';
        runBtn.title = '运行代码';

        // 判断当前的按钮映射状态
        myMarkDown_code.btnMapRight(Select).then((result) => {
            if (result.hasBtn) {
                runBtn.style.right = (result.right + 60) + 'px';
            }
            else {
                runBtn.style.right = '10px';
            }
        });
        return runBtn;
    }

    static csv(select,code,language){
        let result;
        try {
            if (language === 'csv') {
                // 解析 CSV 数据
                const rows = code.querySelectorAll('span');
                const csvData = Array.from(rows).map(row => row.innerText.split(','));
                let table = document.createElement('table');
                Object.assign(table.style, {
                    width: '50%',
                    borderCollapse: 'collapse',
                    border: '1px solid #ddd',
                    marginTop: '10px',
                    marginBottom: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    color: '#333',
                    lineHeight: '1.5',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px',
                });
                table.appendChild(document.createElement('thead'));
                table.appendChild(document.createElement('tbody'));
                const thead = table.querySelector('thead');
                const tbody = table.querySelector('tbody');
                csvData.forEach((row, index) => {
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const td = document.createElement(index === 0 ? 'th' : 'td');
                        td.textContent = cell;
                        Object.assign(td.style, {
                            padding: '8px',
                            textAlign: 'left',
                            border: '1px solid #ddd',
                            backgroundColor: index === 0 ? '#f4f4f4' : '#fff',
                            fontWeight: index === 0 ? 'bold' : 'normal',
                        });
                        tr.appendChild(td);
                    });
                    if (index === 0) {
                        thead.appendChild(tr);
                    } else {
                        tbody.appendChild(tr);
                    }
                });
                result = table.outerHTML;
            }else{
                result = 无对应的数据处理方式;
            }

            if (code_view) {
                code_view.main(select,result);
            }else{
                alert('运行结果:\n' + result);
            }
        } catch (error) {
            console.error('运行失败:', error);
        }
    }

    static main() {
        const pre = document.querySelectorAll(my_markdown.workbench.Public.code.super);
        pre.forEach((item)=>{
            const code = item.querySelector('code');
            if (!code) {return;}
            const runBtn = code_runner.createRunBtn(item);
            const languageClass = Array.from(item.classList).find(className => className.startsWith('language-'));
            const language = languageClass ? languageClass.replace('language-', '') : 'Unknown';
            item.appendChild(runBtn);
            

            runBtn.addEventListener('click', () => {
                const text = code.textContent || code.innerText;
                
                if(new this().#supportLanguage.test(language)){
                    try {
                        // 使用 Function 构造函数来执行 JavaScript 代码
                        const exec = new Function(text);
                        exec();
                    } catch (error) {
                        console.error('运行失败:', error);
                    }
                }
                else if(new this().#dataLang.test(language)){
                    if(language === 'csv'){
                        this.csv(item,code,language);
                    }
                }
                else
                {
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
                            let makePACK={
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
                            if (code_view) {
                                // 如果需要使用 callPannel 函数来展示结果
                                code_view.main(item, '运行结果:\n' + data.result);
                            }else{
                                alert('运行结果:\n' + data.result);
                            }
                            return; // 成功则终止
                    
                        } catch (error) {
                            console.warn(`请求失败 [${url}]:`, error.message);
                            
                            if(code_view){
                                code_view.main(item, '请求失败 ['+url+']:\n' + error.message);
                            }
                        }
                    }
                        
                        console.error('所有服务器均不可用');
                    };
                    
                    // 执行
                    runWithFallback();

                }

            });


        })
    }
}

myMarkDown_code.AutoApply('runner',code_runner);