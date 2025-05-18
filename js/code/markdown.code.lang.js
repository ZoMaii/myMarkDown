class code_lang{
    static origin(){
        return "my_markdown.workbench.Public.code";
    }

    static main() {
        document.querySelectorAll(my_markdown.workbench.Public.code.super).forEach(pre => {
            const code = pre.querySelector('code');
            if (!code) {return;}
            
            const languageClass = Array.from(pre.classList).find(className => className.startsWith('language-'));
            const language = languageClass ? languageClass.replace('language-', '') : 'Unknown';
            const languageLabel = document.createElement('span');
            languageLabel.classList.add('language-label');
            languageLabel.textContent = language;
            pre.appendChild(languageLabel);
        });
    }
}

myMarkDown_code.AutoApply('lang',code_lang);