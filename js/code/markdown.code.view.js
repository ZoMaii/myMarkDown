/**
 * 特别提醒: 
 * 
 * 此文件导入不会直接在DOM上绘制任何元素，需要手动调用或者在程序中导入它。
 * 
 * 在商用代码中 code_view 组件的代码是需要 code_lang、code_runner 作为前置导入才能正常运行，所以在写此类函数的独立化功能时，采用了较为特殊的方式供调用。
 * 
 * 在 c73bfda 提交后，此功能的 Maic-Workbench 环境鉴权等级已经被更改，所以无 JS DOC 为其他社区开源代码提供支持。原使用 maven pox.xml 原理管理的社区项目不受此级别调整影响。
 */ 

class code_view{
    static origin(){
        return "my_markdown.workbench.Public.code";
    }

    static callRunner() {
        return typeof my_markdown?.workbench?.Public?.code?.active?.runner?.main === 'function';
    }

    static callLang() {
        return typeof my_markdown?.workbench?.Public?.code?.active?.lang?.main === 'function';
    }

    static createView(Select){
        const check = Select.querySelector('view');
        if(!check){
            const view = document.createElement('view');
            Select.appendChild(view);
            return view;
        }
        else{
            return check;
        }
    }

    static createViewBtn(Select){
        const viewBtn = document.createElement('button');
        viewBtn.classList.add('flex-btn');
        viewBtn.textContent = 'View';
        viewBtn.title = '预览数据';
        
        // 判断当前的按钮映射状态
        myMarkDown_code.btnMapRight(Select).then((result) => {
            if(result.hasBtn){
                viewBtn.style.right = (result.right + 60) + 'px';
            }
            else{
                viewBtn.style.right = '10px';
            }
        });
        return viewBtn;
    }

    static main(Select,...context){
        const view = code_view.createView(Select);
        const text = context.join(' ');
        const code = Select.querySelector('code');
        if (!code) {return;}

        let first = true;
        if(!text){
            throw new myMarkDown_code("应用 code.view 组件必须传入数据");
        }
        if(!view){
            throw new myMarkDown_code("应用 code.view 组件必须在 pre 上定义数据");
        }

        function print(){
            if(first){
                view.innerHTML += '<p>code.view auto_info</p>';
                first = false;
            }
            view.innerHTML += '<br>';
            view.innerHTML += text;
        }

        if(!code_view.callRunner()){
            const btn = this.createViewBtn(Select);
            Select.appendChild(btn);
            btn.addEventListener('click',()=>{
                print();
            })
        }
        else{
            // 代理功能，接受其他函数传入的数据绘制。
            print();
        }

    }
}


// 使用 push 提交代码到 my_markdown.code 空间中备选，而非注册到 my_markdown.workbench.Public.code 中管理应用。
myMarkDown_code.push('view',code_view);


document.querySelectorAll(my_markdown.workbench.Public.code.super).forEach((pre) => {
    code_view.main(pre,'hello world');
});