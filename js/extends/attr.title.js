class extends_attr_title {
    #nodeEdit(element, Content) {
        const item = document.createElement(element.nodeName);
        // 复制原有 style
        item.style.cssText = element.style.cssText;
        // 复制 class
        item.className = element.className;
        // 复制其它属性
        item.style.textDecoration = "underline";
        item.style.cursor = "pointer";
        item.textContent = Content;
        if (element.hasAttribute("href")) item.href = element.getAttribute("href");
        if (element.hasAttribute("target")) item.target = element.getAttribute("target");
        if (element.hasAttribute("src")) item.src = element.getAttribute("src");
        if (element.hasAttribute("alt")) item.alt = element.getAttribute("alt");

        return item;
    }

    #cardEdit(){
        const card = document.createElement("div");
        card.className = "markdown-title-card";
        Object.assign(card.style, {
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: "9999",
            maxWidth: "90vw",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            opacity: "0",
            transform: "scale(0.95)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            pointerEvents: "none",
            visibility: "hidden"
        });
        document.body.appendChild(card);

        return card;
    }

    static formatTooltipText(rawText) {
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

    static positionCard(a,b,isVisible) {
        if (!isVisible) return;

        const rect = a.getBoundingClientRect();
        const cardWidth = b.offsetWidth;
        const cardHeight = b.offsetHeight;

        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY + 8;

        if (left + cardWidth > window.innerWidth + window.scrollX) {
            left = window.innerWidth + window.scrollX - cardWidth - 10;
        }

        if (top + cardHeight > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - cardHeight - 8;
        }

        b.style.left = `${Math.max(left, 8)}px`;
        b.style.top = `${Math.max(top, 8)}px`;
    }

    static isDesktop() {
        // 简单判断：有触摸点数为0且宽度大于768，或 userAgent 不包含移动端关键字
        return (window.matchMedia && window.matchMedia('(pointer:fine)').matches)
            || (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    static main(){
        xpath("//*[@title]").forEach((el) => {
            const tooltipText = el.getAttribute("title");
            let hoverTimer = null;
            let isVisible = false;
            const displayText = el.textContent;

            const item = new this().#nodeEdit(el,displayText);
            const card = new this().#cardEdit();

            el.removeAttribute("title");
            el.replaceWith(item);
            card.innerHTML = `<div style="font-size:14px">${this.formatTooltipText(tooltipText)}</div><strong>${displayText}</strong>`;

            if(this.isDesktop()){
                // 电脑端：光标悬停1秒显示
                item.addEventListener('mouseenter', () => {
                    hoverTimer = setTimeout(() => {
                        isVisible = true;
                        card.style.visibility = 'visible';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.pointerEvents = 'auto';
                        this.positionCard(item,card,isVisible);
                    }, 618);
                });
                item.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimer);
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    card.style.pointerEvents = 'none';
                    isVisible = false;
                });
            }else{
                // 移动端：点击显示
                item.addEventListener('click', () => {
                    isVisible = !isVisible;
                    if (isVisible) {
                        card.style.visibility = 'visible';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.pointerEvents = 'auto';
                        this.positionCard(item,card,isVisible);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        card.style.pointerEvents = 'none';
                    }
                });
            }

            document.addEventListener('click', (e) => {
                if (!card.contains(e.target) && !item.contains(e.target)) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    card.style.pointerEvents = 'none';
                    isVisible = false;
                }
            });

            handleViewportChange(() => {
                if (isVisible) {
                    this.positionCard(item,card,isVisible);
                }
            });

        });
    }
}

extends_attr_title.main();