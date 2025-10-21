/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案：使用 document.execCommand
      return fallbackCopy(text);
    }
  } catch (error) {
    console.error('复制失败：', error);
    // 尝试降级方案
    return fallbackCopy(text);
  }
}

/**
 * 降级复制方案
 */
function fallbackCopy(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('降级复制失败：', error);
    return false;
  }
}

/**
 * 显示复制成功提示
 */
export function showCopySuccess(): void {
  // 创建 Toast 元素
  const toast = document.createElement('div');
  toast.textContent = '文案已复制';
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;
  
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // 自动移除
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 2000);
}

/**
 * 显示复制失败提示
 */
export function showCopyError(): void {
  // 创建 Toast 元素
  const toast = document.createElement('div');
  toast.textContent = '复制失败';
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 77, 79, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;
  
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // 自动移除
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 2000);
}
