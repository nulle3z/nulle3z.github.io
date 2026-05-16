// 获取当前页面基础信息
function getCurrentPageInfo() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop().replace('.html', '');
    return {
        baseName: fileName || 'blog',
        path: `./blog/${fileName}.md`
    };
}

// Markdown加载器
async function loadMarkdown() {
    const { baseName, path } = getCurrentPageInfo();
    
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Markdown文件未找到');
        return await response.text();
    } catch (error) {
        console.error(`[${baseName}.md] 加载失败:`, error);
        return `# 内容加载失败\n> 文件路径: ${path}\n> 错误信息: ${error.message}`;
    }
}

// 初始化加载
document.addEventListener('DOMContentLoaded', async () => {
    const mdContent = await loadMarkdown();
    $t.value = mdContent;
    $m.innerHTML = marked.parse(mdContent);

    // 动态更新标题
    const h1 = $m.querySelector('h1');
    if (h1) document.title = `${h1.textContent} - ${document.title}`;
});

