


# ToDo - 待办清单

这将记录当前项目库的待办事项，包含一定的未来规划，后续提交将只囊括修复。



## ==⚠️ 风险警告==


#### myMarkDown 只负责绘制于渲染，不包含服务端内容。后端禁止完全信任前端提交的全部数据！


#### 尝试使用 Worker 进行有限的风险分担，但必须验证提交的任何 *非日志的数据* 来源。


#### 社区开源代码未包含商业代码的披露验证和最终canvas绘制功能，不要使用以下代码在生产、消费终端环境中盲目暴露监听器

```js
(function() {
    const originAdd = Element.prototype.addEventListener;
    Element.prototype.addEventListener = function(type, listener, options) {
        if (!this.__events__) this.__events__ = {};
        if (!this.__events__[type]) this.__events__[type] = [];
        this.__events__[type].push(listener);
        originAdd.call(this, type, listener, options);
    };
})();
```



#  overflow - 概述

目前，Markdown 的 HTML 元素的通用平台支持已接近尾声，这意味着不久后可能结束掉对此开源仓库的新功能支持。

代码都是由我一人稀释重构商用代码或原创替代指定函数后的产物，但在细节上依旧十分粗糙。后续更新将逐步完善这些细节部分，但根据合同与许可的条款，协调全局的代码的补充依旧存在很大的限制。


当前的社区开源的分类规则如下:

1. `my_markdown` 命名用于存储 mymarkdown 的数据信息
2. `myMarkDown.*` 命名系列用于注册针对 元素 编写的系列代码



##  code - 系列细节

<mark>code</mark> 默认是一个大类，提供给轻量项目开发的程序员、学生使用，默认包含了 **Color**、**Lang**、**Copy**(当前流行)、**Runner**(未来可能广泛流行) 这四个独立性组件 和 **View** 这个独立性功能。

如果你希望使用 code 系列的代码，必须在它们之前导入 `markdown.code.js` 这个文件，以确保它们的工作正常。但受限于开源前的工作合约，我不会主动提供任何 **有关函数监控** 的功能性 (已稀释重写的) 代码。如果你对此有兴趣，或许可以尝试 `pull request` 到其他分支。 

- [ ] 考虑加入 Event Listeners 自助注册服务 到 markdown.js 当中？



##  extends - 附加功能细节

目前附加功能在 my_markdown 中没有存储权限，处于测试功能。但仍需要导入 markdown.js 进行前置安装！这部分内容不会考虑完美的兼容性，建议在 `markdown.js` 导入后立即使用避免出现问题！

- [ ] attr.title 待与 runner 进行兼容。