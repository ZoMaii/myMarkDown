/**
 * Markdown Code 组件
 * @prerequisite maic_md.css
 * @workbench General.Private
 * @description 该脚本为代码块元素(pre>code)添加语言标签和复制按钮功能。
 * @version 20250516
 * @date 2025-5-16
 * @license https://github.com/zomaii/myMarkDown/blob/main/License
*/

// 尝试注册相关信息
try{
     if(new myMarkDown('my_markdown').queryReport.defined)
        {
            my_markdown.code = my_markdown.code || {};
            my_markdown.workbench.Public = {
                code:{
                    active:{},
                    agent:"myMarkDown_code",
                    space:"my_markdown.code",
                    super:".markdown pre",
                }
            }
        }
        else
        {
            throw new Error("my_markdown: 未定义的对象");
        }
}catch(e){
    throw new Error("\n"+e.message+"\nmarkdown.code 系列不会被加载");
}



class myMarkDown_code extends Error{
    constructor(message) {
        super(message);
        this.name = "myMarkDown_code";
    }

    // 指明起源，用于反射
    static origin(){
        return "my_markdown.workbench.Public.code";
    }

    // 查验是否已填写必须的函数
    static VefClass(worker){
        if(!worker.origin){
            throw new myMarkDown_code("my_markdown: markdown.code 系列的拓展 必须实现 Origin 方法");
        }
        else if(!worker.main){
            throw new myMarkDown_code("my_markdown: markdown.code 系列的拓展 必须实现 Main 方法");
        }
    }

    // 获取当前的按钮布局，用于确认后续样式
    static btnMapRight(Select){
        const buttons = Select.querySelectorAll('button');
        let right = 0;
        let hasBtn = false;
        if (buttons.length > 0) {
            const lastBtn = buttons[buttons.length - 1];
            const computedRight = getComputedStyle(lastBtn).right;
            right = parseInt(computedRight, 10) || 0;
            hasBtn = true;
        }
        return new Promise((resolve) => {
            resolve({hasBtn, right});
        });
    }

    // 向 space 中提交私有 Class 的 RouteID 用于标识管理，而非通过 myMarkDown 在 global 中不稳定查询类是否存在
    static push(Key,Value){
        if(!my_markdown.code[Key]){
            my_markdown.code[Key] = Value;
        }
    }
    
    static isClass(fn) {
        return typeof fn === 'function' && /^class\s/.test(Function.prototype.toString.call(fn));
    }

    static AutoApply(RouteID,Worker,...args){
        this.VefClass(Worker);

        if(!my_markdown.workbench.Public.code.active[RouteID]){
            my_markdown.workbench.Public.code.active[RouteID] = Worker;
        }

        // 向 my_markdown.code 中提交 RouteID，供 my_markdown 进行反射管理
        this.push(RouteID,Worker);

        // 如果 Worker 是一个类，则创建其实例
        let result;
        if (this.isClass(Worker.main)) {
            result = new Worker.main(...args);
        } else {
            result = Worker.main(...args);
        }

        return result;
    }
}