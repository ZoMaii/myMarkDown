class Search {
  /**
   * @param {HTMLElement} targetElement 需要被搜索的目标元素
   * @param {HTMLElement} inputElement 输入元素
   * @param {String} color 高亮颜色 (默认红色)
   */
  constructor(targetElement, inputElement, color = 'red') {
    this.targetElement = targetElement;
    this.inputElement = inputElement;
    this.color = color;
    this.searchText = this.getSearchText();
    this.init();
  }

  init() {
    switch (this.targetElement.tagName) {
      case 'TABLE':
        this.handleTable();
        break;
      case 'UL':
        this.handleList();
        break;
    }
  }

  getSearchText() {
    if (this.inputElement.tagName === 'SELECT') {
      const firstOption = this.inputElement.querySelector('option');
      if (!firstOption) return '';
      return this.inputElement.value === (firstOption.value ?? '') ? '' : this.inputElement.value.trim();
    }
    return this.inputElement.value.trim();
  }

  // 表格处理逻辑
  handleTable() {
    this.removeNullContent();
    this.resetTableStyles();

    // 只查找 tbody 下的 td
    const tbody = this.targetElement.querySelector('tbody');
    const tds = tbody ? Array.from(tbody.querySelectorAll('td')) : [];
    const matches = tds.filter(td => td.textContent.includes(this.searchText));

    if (this.searchText) {
      matches.length === 0 ? this.showTableNoResults() : this.highlightTableMatches(matches);
    } else {
      this.showAllTableRows();
    }
  }

  highlightTableMatches(matches) {
    this.hideAllTableRows();
    matches.forEach(td => {
      td.parentElement.style.display = 'table-row';
      this.highlightText(td);
    });
  }

  highlightText(element) {
    // 递归处理所有子节点，保留原有标签，仅高亮文本
    const highlight = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!this.searchText) return;
        const reg = new RegExp(`(${this.searchText})`, 'gi');
        if (reg.test(node.textContent)) {
          const span = document.createElement('span');
          span.innerHTML = node.textContent.replace(reg, `<span style="color:${this.color};font-weight:bold">$1</span>`);
          node.replaceWith(...span.childNodes);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(child => highlight(child));
      }
    };

    // 先还原原始内容
    if (element.__originHtml !== undefined) {
      element.innerHTML = element.__originHtml;
    } else {
      element.__originHtml = element.innerHTML;
    }

    if (this.searchText) {
      highlight(element);
    }
  }

  // 列表处理逻辑
  handleList() {
    this.removeNullContent();
    this.resetListStyles();

    // 只查找真实li，排除提示li
    const lis = Array.from(this.targetElement.querySelectorAll('li')).filter(li => li.id !== 'content-null');
    const matches = lis.filter(li => li.textContent.includes(this.searchText));

    if (this.searchText) {
      matches.length === 0 ? this.showListNoResults() : this.highlightListMatches(matches);
    } else {
      this.showAllListItems();
    }
  }

  // 通用 DOM 操作方法
  removeNullContent() {
    const existingNull = this.targetElement.querySelector('#content-null');
    existingNull?.remove();
  }

  resetTableStyles() {
    // 恢复所有td为原始HTML，保留标签
    this.targetElement.querySelectorAll('td').forEach(td => {
      if (td.__originHtml !== undefined) {
        td.innerHTML = td.__originHtml;
      } else {
        td.__originHtml = td.innerHTML;
      }
    });
  }

  resetListStyles() {
    // 恢复所有li为原始HTML，保留标签
    this.targetElement.querySelectorAll('li').forEach(li => {
      if (li.__originHtml !== undefined) {
        li.innerHTML = li.__originHtml;
      } else {
        li.__originHtml = li.innerHTML;
      }
    });
  }

  hideAllTableRows() {
    // 只隐藏 tbody 下的所有 tr
    const tbody = this.targetElement.querySelector('tbody');
    if (tbody) {
      tbody.querySelectorAll('tr').forEach(tr => {
        tr.style.display = 'none';
      });
    }
  }

  showAllTableRows() {
    this.targetElement.querySelectorAll('tr').forEach(tr => {
      tr.style.display = 'table-row';
    });
  }

  showTableNoResults() {
    this.hideAllTableRows();
    const colCount = this.targetElement.rows[0].cells.length;
    const row = this.createTableRow(colCount);
    this.targetElement.appendChild(row);
  }

  createTableRow(colspan) {
    const tr = document.createElement('tr');
    tr.id = 'content-null';
    const td = document.createElement('td');
    td.colSpan = colspan;
    td.textContent = '暂无你搜索的内容';
    td.style.textAlign = 'center';
    tr.appendChild(td);
    return tr;
  }

  showListNoResults() {
    // 隐藏所有li，排除提示li
    this.targetElement.querySelectorAll('li').forEach(li => {
      if (li.id !== 'content-null') li.style.display = 'none';
    });
    // 防止重复添加
    if (!this.targetElement.querySelector('#content-null')) {
      const li = document.createElement('li');
      li.id = 'content-null';
      li.textContent = '暂无你搜索的内容';
      this.targetElement.appendChild(li);
    }
  }

  highlightListMatches(matches) {
    // 隐藏所有li，排除提示li
    this.targetElement.querySelectorAll('li').forEach(li => {
      if (li.id !== 'content-null') li.style.display = 'none';
    });
    matches.forEach(li => {
      li.style.display = 'list-item';
      this.highlightText(li);
    });
    // 移除无结果提示
    this.removeNullContent();
  }

  showAllListItems() {
    this.targetElement.querySelectorAll('li').forEach(li => {
      if (li.id !== 'content-null') li.style.display = 'list-item';
      else li.remove(); // 移除无结果提示
    });
  }
}