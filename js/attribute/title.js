/**
 * markdown title 属性显示优化(tooltip)
 * @preprequisite maic_md.css、markdown.js
 * @workbench Private
 * @description 此脚本为 <element title="xxx"></element> 的标签提供额外的显示支持功能，在样式上拥有更多支持，须提前导入 maic_md.css 和 markdown.js。该脚本在页面加载完成后执行，确保所有元素都已渲染。
 * @version 20250506
 * @date 2025-5-6
 * @license https://github.com/zomaii/myMarkDown/blob/main/License
*/

// 功能概述：
// 1. <element title="xxx">abc</element> 的标签内容 abc 样式将包含下划线，点击时默认在此 element 周围创建非透明的圆角浮动卡片展示 abc 标题和 title 内容 xxx。点击其他地方时，卡片将销毁。
// 2. 对超链接的引用使用符号 '@' 进行标记，例如 <font title="open the google search \n @https://google.com">Google</font>，在鼠标悬停时将会在下方创建卡片展示超链接的内容。
// 3. 屏蔽掉原有的 title 属性的提示，避免与新功能冲突。
// 4. 该脚本在页面加载完成后执行，确保所有元素都已渲染。

document.querySelectorAll('[title]').forEach(element => {
    // 注意：如果文件不是纯净的wiki页面，在 markdown.code.* 系列脚本导入后导入可能会对 pre>code 的页面渲染的按钮造成额外绘制。
    const tooltipText = element.getAttribute('title');
    element.removeAttribute('title');

    const displayText = element.textContent;

    const underlineSpan = document.createElement('span');
    underlineSpan.style.textDecoration = 'underline';
    underlineSpan.style.cursor = 'pointer';
    underlineSpan.textContent = displayText;

    element.innerHTML = '';
    element.appendChild(underlineSpan);

    const card = document.createElement('div');
    card.className = 'markdown-title-card';
    Object.assign(card.style, {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        zIndex: '9999',
        maxWidth: '90vw',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        opacity: '0',
        transform: 'scale(0.95)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        pointerEvents: 'none',
        visibility: 'hidden',
        display: 'block'        // 使其在页面中占位，避免布局抖动。block 在布局上会被渲染，可能存在问题。
    });

    // 下述替换功能持保留意见，后续是否支持待商榷。
    function formatTooltipText(rawText) {
        const escapedText = rawText
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    
        const withLinks = escapedText.replace(/@(\S+)/g, (match, url) => {
            const safeUrl = url.replace(/"/g, "%22");
            return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    
        return withLinks.replace(/\\n/g, '<br>');
    }
    

    card.innerHTML = `<div style="font-size:14px">${formatTooltipText(tooltipText)}</div><strong>${displayText}</strong>`;
    // 替换功能截止


    document.body.appendChild(card);

    // 是否可视化标志
    let hoverTimer = null;
    let isVisible = false;

    // 定位函数（触发器）
    function positionCard() {
        if (!isVisible) return;

        const rect = underlineSpan.getBoundingClientRect();
        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;

        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY + 8;

        if (left + cardWidth > window.innerWidth + window.scrollX) {
            left = window.innerWidth + window.scrollX - cardWidth - 10;
        }

        if (top + cardHeight > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - cardHeight - 8;
        }

        card.style.left = `${Math.max(left, 8)}px`;
        card.style.top = `${Math.max(top, 8)}px`;
    }

    // 注释部分代码出于视觉动画和设备兼容变化考虑，有待商榷
    // function showCard() {
    //     card.style.display = 'block';      // 先渲染出来
    //     requestAnimationFrame(() => {
    //         card.style.visibility = 'visible';
    //         card.style.opacity = '1';
    //         card.style.transform = 'scale(1)';
    //         card.style.pointerEvents = 'auto';
    //     });
    // }
    

    // function hideCard() {
    //     card.style.opacity = '0';
    //     card.style.transform = 'scale(0.95)';
    //     card.style.pointerEvents = 'none';
    //     card.style.visibility = 'hidden';
    
    //     // 动画结束后彻底移除空间占用
    //     setTimeout(() => {
    //         card.style.display = 'none';
    //     }, 200); // 与 transition 时间一致
    // }
    
    underlineSpan.addEventListener('click', () => {
        isVisible = !isVisible;
        if (isVisible) {
            card.style.visibility = 'visible';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.pointerEvents = 'auto';
            positionCard(); // 初次定位
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            card.style.pointerEvents = 'none';
        }
    });

    // 点击外部区域隐藏
    document.addEventListener('click', (e) => {
        if (!card.contains(e.target) && !underlineSpan.contains(e.target)) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            card.style.pointerEvents = 'none';
            isVisible = false;
        }
    });

    // 注释代码表示鼠标悬停时的延迟显示功能，仍待商榷，当前方案是必须点击才能显示。适用于桌面、移动端和触摸屏设备。
    // underlineSpan.addEventListener('mouseenter', () => {
    //     hoverTimer = setTimeout(() => {
    //         const rect = element.getBoundingClientRect();
    //         card.style.left = `${rect.left + window.scrollX}px`;
    //         card.style.top = `${rect.bottom + window.scrollY}px`;
    //         showCard();
    //     }, 3000);
    // });
    
    // underlineSpan.addEventListener('mouseleave', () => {
    //     clearTimeout(hoverTimer);
    //     hideCard();
    // });

    // 页面尺寸变化时重新定位
    handleViewportChange(() => {
        if (isVisible) {
            positionCard();
        }
    });
});

