import { useState, useRef, useCallback } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
  preventDefault?: boolean;
}

/**
 * 长按手势 Hook
 */
export function useLongPress({
  onLongPress,
  onClick,
  delay = 500,
  preventDefault = true
}: UseLongPressOptions) {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<number>();
  const target = useRef<EventTarget>();

  const start = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (preventDefault) {
      event.preventDefault();
    }
    
    target.current = event.target;
    setLongPressTriggered(false);
    
    timeout.current = setTimeout(() => {
      setLongPressTriggered(true);
      onLongPress();
    }, delay);
  }, [onLongPress, delay, preventDefault]);

  const clear = useCallback((_event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    
    if (shouldTriggerClick && !longPressTriggered && onClick) {
      onClick();
    }
  }, [onClick, longPressTriggered]);

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
    onTouchCancel: (e: React.TouchEvent) => clear(e, false)
  };
}
