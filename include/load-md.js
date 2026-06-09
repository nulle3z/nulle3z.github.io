/*
 * 未完成
 */


document.addEventListener('DOMContentLoaded', async () => {
const container = document.getElementById('markdown-container');

try {
  const response = await fetch('README.md'); 
  
  if (!response.ok) {
    throw new Error(`Failed to load file: ${response.status}`);
  }

  const markdownText = await response.text();

  const html = marked.parse(markdownText, {
  });

  container.innerHTML = html;
  
} catch (error) {
  console.error('Error loading Markdown:', error);
  container.innerHTML = `<p style="color: #ff8888;">Error loading content: ${error.message}</p>`;
}
});


