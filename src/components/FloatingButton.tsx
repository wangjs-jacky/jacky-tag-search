import { HiPlus } from 'react-icons/hi';
import './FloatingButton.css';

interface FloatingButtonProps {
  onClick: () => void;
  icon?: string;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'small' | 'medium' | 'large';
}

/**
 * 浮动按钮组件
 */
export function FloatingButton({ 
  onClick, 
  icon, 
  label,
  position = 'bottom-right',
  size = 'large'
}: FloatingButtonProps) {
  return (
    <button 
      className={`floating-button floating-button--${position} floating-button--${size}`}
      onClick={onClick}
      aria-label={label || '添加新项目'}
    >
      <span className="floating-button__icon">
        {icon ? icon : <HiPlus />}
      </span>
      {label && (
        <span className="floating-button__label">{label}</span>
      )}
    </button>
  );
}
