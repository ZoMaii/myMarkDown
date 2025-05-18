class code_color{
    static origin (){
        return "my_markdown.workbench.Public.code";
    }

    static register(){
        my_markdown.code.color = {
            RegExp:
            {
                string: /".*"|'.*'/g,                                   // 字符串
                set: /\b=\b|==|===|>=|<=|!=/g,                          // 赋值运算符
                function: /\S+\(.*\)/g,                                 // 函数定义
                parme: /\(.*\)/g,                                       // 函数参数
                number: /\b\d+(\.\d+)?\b/g,                             // 数字
                notes: /\/\/.*|\/\*[\s\S]*?\*\//g,                      // 注释
                boolean: /\b(true|True|false|False)\b/g,                // 布尔值
            },
            colors:
            {
                function: '#ff6347',    // Tomato
                string: '#32cd32',      // LimeGreen
                parme: '#a9a9a9',       // DarkGray
                number: '#4682b4',      // SteelBlue
                boolean: '#8a2be2',     // BlueViolet
                notes: '#808080',       // Gray
                set: '#0000FF',         // Blue
                give: '#0000FF',        // Blue
            }
        };
    }

    // 私有方法
    #processWorkQueue(workQueue) {
        while (workQueue.length > 0) {
            const element = workQueue.shift(); // 从队列中取出第一个元素
            // console.log('处理元素:', element); // 输出当前处理的元素

            const codeElement = element.querySelector('code');
            if (!codeElement || !(codeElement instanceof Element)) {
                console.warn('未找到有效的 <code> 元素:', element);
                continue;
            }

            // 获取所有的 span 元素
            const spans = codeElement.querySelectorAll('span');
            // console.log('静态处理的 span 元素:', spans);

            // 遍历每个 span 元素
            spans.forEach(span => {
                let text = span.innerHTML; // 获取文本内容

                // 遍历正则表达式类型
                if (my_markdown.code.color.RegExp && typeof my_markdown.code.color.RegExp === 'object') {
                    Object.keys(my_markdown.code.color.RegExp).forEach(key => {
                        const regex = my_markdown.code.color.RegExp[key];
                        const color = my_markdown.code.color.colors[key];

                        // 如果匹配，修改颜色
                        if (regex && regex.test(text)) {
                            text = text.replace(regex, match => {
                                return `<font color="${color}">${match}</font>`;
                            });
                        }
                    });
                } else {
                    console.warn('my_markdown.code.color.RegExp 未定义或不是对象');
                }

                // 将处理后的文本插回 span 元素
                span.innerHTML = text;
            });
        }
    }



    static main(){
        this.register();
        const workQueue = [];

        // 处理队列中的静态数据
        xpath('//pre').forEach(function (element) {
            if (element.querySelector('code') === null) {return;}
            workQueue.push(element); // 将元素加入队列
        });
        // 用实例调用私有方法
        new this().#processWorkQueue(workQueue);
        
        // 动态监听更新，只对动态有变更的部分进行颜色重解析
        xpath('//pre/code').forEach(function (codeElement) {
            if (!codeElement || !(codeElement instanceof Element)) {return;}

                monitorDOMChanges(codeElement, function (mutation) {
                // 处理子节点的变化
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('span')) { 
                        console.log('新增的 <span> 节点:', node); // 输出新增的 <span> 节点

                        // 处理新增的 <span> 节点内容
                        let text = node.innerHTML; // 获取文本内容

                        // 遍历正则表达式类型
                        if (my_markdown.code.color.RegExp && typeof my_markdown.code.color.RegExp === 'object') {
                            Object.keys(my_markdown.code.color.RegExp).forEach(key => {
                                const regex = my_markdown.code.color.RegExp[key];
                                const color = my_markdown.code.color.colors[key];

                                // 如果匹配，修改颜色
                                if (regex && regex.test(text)) {
                                    text = text.replace(regex, match => {
                                        return `<font color="${color}">${match}</font>`;
                                    });
                                }
                            });
                        } else {
                            console.warn('my_markdown.code.color.RegExp 未定义或不是对象');
                        }

                        // 将处理后的文本插回 <span> 元素
                        node.innerHTML = text;
                    }
                });
            });
        });

    }
}

myMarkDown_code.AutoApply('color',code_color);