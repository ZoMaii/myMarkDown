// 此功能只是简单地实现了代码高亮，更多支持请访问您的组织配置。
document.querySelectorAll('.markdown pre').forEach(pre => {
    // 定义正则表达式类型
    // 此解析顺序不能更改，必须从上到下解析
    // 否则会导致解析错误
    const Type = {
        string: /".*"|'.*'/g,               // 字符串
        // baseSet: /\b(?:if|else|for|while|switch|case|break|continue|return)\b/g, // 基本语法
        set: /\b=\b|==|>=|<=|!=/g,                // 赋值运算符
        function: /\S+\(.*\)/g,             // 函数定义
        parme: /\(.*\)/g,                   // 函数参数
        number: /\b\d+(\.\d+)?\b/g,         // 数字
        notes: /\/\/.*|\/\*[\s\S]*?\*\//g,  // 注释
        boolean: /\b(true|false)\b/g,       // 布尔值
    };

    // 颜色映射
    const colors = {
        function: '#ff6347',    // Tomato
        string: '#32cd32',      // LimeGreen
        parme: '#a9a9a9',       // DarkGray
        number: '#4682b4',      // SteelBlue
        boolean: '#8a2be2',     // BlueViolet
        notes: '#808080',       // Gray
        set: '#0000FF',         // Blue
        give: '#0000FF',        // Blue
        // baseSet: '#003366',     // OrangeRed
    };

    // 创建语言标签元素
    const codeElement = pre.querySelector('code');
    if (codeElement) {
        const spans = codeElement.querySelectorAll('span');
        
        spans.forEach(span => {
            let text = span.innerHTML; // 获取文本内容

            Object.keys(Type).forEach(key => {
                const regex = Type[key];
                const color = colors[key];

                // 如果匹配，修改颜色
                if (regex.test(text)) {
                    text = text.replace(regex, match => {
                        // if(key === 'set') {
                        //     console.log("匹配文本："+text,"\n匹配正则表达式："+ match);
                        // }
                        return `<font color="${color}">${match}</font>`;
                    });
                    // console.log(text);
                }
            });

            // 将处理后的文本插回 span 元素
            span.innerHTML = text;
        });
    }
});

