

# FIND YOUR NEEDS

This is a simple tools for markdown on native ES6.

The work of the project depends on the support of ES6 scripts in the program (client side). html elements are written according to the recommendations of MDN.

You can integrate it into any environment that supports ES6, provided that you provide **html files** _instead of_ **md files** for this project.

#### Example file:

* License file: [License](./License)
* pre-view all: [Markdown.html](./Markdown.html)
* Code example file: [Markdown.code.html](./Markdown.code.html)
* Other example file: [Markdown.extends.hmtl](./Markdown.extends.html)


>[!IMPORTANT]
> myMarkDown's NameSpcae [important]:
>- [Object] my_markdown
>- [class] myMarkDown

>[!WARNING]
> This feature is built for the client and is geared towards the consumer. **Do not** try to write **any server-side** functionality on the client side, move it to the worker!
> 
> If you are using/importing this project for the first time, ***verify*** that **the commit** matches the github information via Git



I recommend that each worker *tweak* the **example file** to suit their own editor and finally package the script list (tail of body) to apply it



# NO SUPPORT FUNCTIONS

Due to some protocols, I can't provide you with the following functions, so please construct your own working environment that supports them.

```ts
// ./js/code/markdown.code.runner.js
MD5.hash(text:string);
```


# End
This project is maintained and updated solely by me. If it helps you with small things, please consider supporting it — either by submitting a [pull request](https://github.com/ZoMaii/myMarkDown/pulls) or donating $1 on [Patreon](https://www.patreon.com/c/ZoMaii).