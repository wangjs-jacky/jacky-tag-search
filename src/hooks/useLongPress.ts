import { useState, useRef, useCallback } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
  preventDefault?: boolean;
  dragThreshold?: number; // 拖动阈值（像素）
  longPressThreshold?: number; // 长按阈值（像素），超过此距离不触发长按
}

/**
 * 长按手势 Hook
 * 支持拖动检测，避免拖动时意外触发点击和长按
 */
export function useLongPress({
  onLongPress,
  onClick,
  delay = 500,
  preventDefault = true,
  dragThreshold = 10, // 默认10像素的拖动阈值
  longPressThreshold = 5 // 默认5像素的长按阈值，更严格
}: UseLongPressOptions) {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<number>();
  const target = useRef<EventTarget>();
  const startPosition = useRef<{ x: number; y: number } | null>(null);
  const hasDragged = useRef(false);
  const hasMovedTooMuch = useRef(false);

  const getEventPosition = (event: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in event && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    } else if ('clientX' in event) {
      return {
        x: event.clientX,
        y: event.clientY
      };
    }
    return { x: 0, y: 0 };
  };

  const start = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (preventDefault) {
      event.preventDefault();
    }
    
    target.current = event.target;
    setLongPressTriggered(false);
    hasDragged.current = false;
    hasMovedTooMuch.current = false;
    startPosition.current = getEventPosition(event);
    
    timeout.current = setTimeout(() => {
      // 只有在没有移动太多的情况下才触发长按
      if (!hasMovedTooMuch.current) {
        setLongPressTriggered(true);
        onLongPress();
      }
    }, delay);
  }, [onLongPress, delay, preventDefault]);

  const move = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!startPosition.current || longPressTriggered) return;
    
    const currentPosition = getEventPosition(event);
    const deltaX = Math.abs(currentPosition.x - startPosition.current.x);
    const deltaY = Math.abs(currentPosition.y - startPosition.current.y);
    
    // 如果移动距离超过长按阈值，取消长按
    if (deltaX > longPressThreshold || deltaY > longPressThreshold) {
      hasMovedTooMuch.current = true;
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
      }
    }
    
    // 如果移动距离超过拖动阈值，标记为拖动
    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      hasDragged.current = true;
    }
  }, [longPressTriggered, dragThreshold, longPressThreshold]);

  const clear = useCallback((_event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    
    // 只有在没有长按、没有拖动、没有移动太多、且允许触发点击时才执行点击
    if (shouldTriggerClick && !longPressTriggered && !hasDragged.current && !hasMovedTooMuch.current && onClick) {
      onClick();
    }
    
    // 重置状态
    startPosition.current = null;
    hasDragged.current = false;
    hasMovedTooMuch.current = false;
  }, [onClick, longPressTriggered]);

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseMove: (e: React.MouseEvent) => move(e),
    onTouchMove: (e: React.TouchEvent) => move(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
    onTouchCancel: (e: React.TouchEvent) => clear(e, false)
  };
}
