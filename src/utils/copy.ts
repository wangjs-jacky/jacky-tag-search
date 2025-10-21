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
  // 这里可以集成 Toast 组件
  console.log('复制成功');
}

/**
 * 显示复制失败提示
 */
export function showCopyError(): void {
  // 这里可以集成 Toast 组件
  console.error('复制失败');
}
