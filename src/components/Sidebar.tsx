import { ViewType } from '../types/index.js';
import { VIEW_CONFIGS } from '../constants/index.js';
import { HiX, HiDownload, HiUpload } from 'react-icons/hi';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  currentView: ViewType;
  onClose: () => void;
  onViewChange: (view: ViewType) => void;
  onExport: () => void;
  onImport: () => void;
}

/**
 * 侧边栏组件
 */
export function Sidebar({
  isOpen,
  currentView,
  onClose,
  onViewChange,
  onExport,
  onImport
}: SidebarProps) {
  const handleViewChange = (view: ViewType) => {
    onViewChange(view);
    onClose();
  };

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div 
          className="sidebar__overlay"
          onClick={onClose}
        />
      )}
      
      {/* 侧边栏 */}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <h2 className="sidebar__title">文本管理</h2>
          <button 
            className="sidebar__close"
            onClick={onClose}
            aria-label="关闭侧边栏"
          >
            <HiX />
          </button>
        </div>
        
        <nav className="sidebar__nav">
          <div className="sidebar__section">
            <h3 className="sidebar__section-title">视图</h3>
            {Object.values(VIEW_CONFIGS).map((config) => (
              <button
                key={config.type}
                className={`sidebar__item ${currentView === config.type ? 'sidebar__item--active' : ''}`}
                onClick={() => handleViewChange(config.type)}
              >
                <span className="sidebar__item-icon">{config.icon}</span>
                <span className="sidebar__item-text">{config.title}</span>
              </button>
            ))}
          </div>
          
          <div className="sidebar__section-divider"></div>
          
          <div className="sidebar__section">
            <h3 className="sidebar__section-title">数据管理</h3>
            <button
              className="sidebar__item"
              onClick={() => {
                onExport();
                onClose();
              }}
            >
              <span className="sidebar__item-icon"><HiDownload /></span>
              <span className="sidebar__item-text">导出数据</span>
            </button>
            
            <button
              className="sidebar__item"
              onClick={() => {
                onImport();
                onClose();
              }}
            >
              <span className="sidebar__item-icon"><HiUpload /></span>
              <span className="sidebar__item-text">导入数据</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
