/**
 * Markdown Pannel
 * @prerequisite maic_md.css、markdown.code.runner.js
 * @description 该脚本用于在 Markdown 编辑器中创建一个控制台风格的弹窗，展示代码执行过程。
 * @version 1.0
 * @date 2025-4-23
 * @license https://github.com/zomaii/myMarkDown/blob/main/License
*/

function callPannel(text) {
  // 禁用页面滚动
  document.body.style.overflow = 'hidden';

  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.zIndex = '9998'; // 确保遮罩层在弹窗下方
  overlay.style.transition = 'opacity 0.3s ease-in-out';
  
  // 添加到页面
  document.body.appendChild(overlay);

  // 创建控制台风格的弹窗容器
  const Pannel = document.createElement('div');
  Pannel.style.position = 'fixed';
  Pannel.style.top = '50%';
  Pannel.style.left = '50%';
  Pannel.style.transform = 'translate(-50%, -50%)';
  Pannel.style.padding = '10px 20px';
  Pannel.style.backgroundColor = 'var(--color-markdown-code)'; // 控制台的深色背景
  Pannel.style.color = 'var(--color-markdown-code-font)'; // 白色字体
  Pannel.style.border = '1px solid #333'; // 控制台风格的边框
  Pannel.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.3)';
  Pannel.style.zIndex = '9999'; // 弹窗在最上层
  Pannel.style.maxWidth = '600px';
  Pannel.style.width = '100%';
  Pannel.style.fontFamily = 'Courier, monospace'; // 使用等宽字体
  Pannel.style.fontSize = '14px';
  Pannel.style.borderRadius = '4px';

  // 添加弹窗标题
  const title = document.createElement('h3');
  title.textContent = 'Console Output';
  title.style.textAlign = 'center';
  title.style.fontSize = '16px';
  title.style.marginBottom = '10px';
  title.style.fontFamily = 'Courier, monospace'; // 同样使用等宽字体
  Pannel.appendChild(title);

  // 创建内容区域来展示运行过程
  const content = document.createElement('div');
  content.style.marginTop = '10px';
  content.style.whiteSpace = 'pre-wrap'; // 保持文本格式
  content.textContent = text;
  Pannel.appendChild(content);

  // 创建关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = '关闭';
  closeButton.style.marginTop = '15px';
  closeButton.style.padding = '5px 15px';
  closeButton.style.backgroundColor = '#f44336';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '4px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '14px';

  // 关闭弹窗的函数
  function closePannel() {
    Pannel.remove();
    overlay.remove();
    // 恢复页面滚动
    document.body.style.overflow = 'auto';
  }

  Pannel.appendChild(closeButton);

  // 将弹窗添加到页面
  document.body.appendChild(Pannel);

  // 弹窗动画效果：从下到上出现
  Pannel.style.transform = 'translate(-50%, -50%) scale(0.8)';
  setTimeout(() => {
    Pannel.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 50);
  
  // 关闭弹窗
  closeButton.addEventListener('click', () => {
    closePannel();
  });

  // 监听 ESC 键关闭弹窗
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePannel();
    }
  });
}
