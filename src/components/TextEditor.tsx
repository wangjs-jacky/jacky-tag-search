import React, { useState } from 'react';
import { TextItem } from '../types/index.js';
import { KeywordTag } from './KeywordTag.js';
import { useSwipe } from '../hooks/useSwipe.js';
import { createTextItem } from '../utils/storage.js';
import './TextEditor.css';

interface TextEditorProps {
  isVisible: boolean;
  item?: TextItem;
  onClose: () => void;
  onSave: (item: TextItem) => void;
}

/**
 * 文本编辑器组件
 */
export function TextEditor({ isVisible, item, onClose, onSave }: TextEditorProps) {
  const [text, setText] = useState(item?.text || '');
  const [keywords, setKeywords] = useState<string[]>(item?.keywords || []);
  const [keywordInput, setKeywordInput] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const swipeHandlers = useSwipe({
    onSwipeDown: () => {
      if (hasChanges) {
        if (confirm('确定要放弃更改吗？')) {
          onClose();
        }
      } else {
        onClose();
      }
    },
    preventDefault: false
  });

  React.useEffect(() => {
    if (item) {
      setText(item.text);
      setKeywords(item.keywords || []);
    } else {
      setText('');
      setKeywords([]);
    }
    setKeywordInput('');
    setHasChanges(false);
  }, [item, isVisible]);

  React.useEffect(() => {
    const isChanged = item 
      ? text !== item.text || JSON.stringify(keywords || []) !== JSON.stringify(item.keywords || [])
      : (text && text.trim() !== '') || (keywords && keywords.length > 0);
    setHasChanges(isChanged);
  }, [text, keywords, item]);

  const handleKeywordAdd = () => {
    const newKeyword = keywordInput?.trim() || '';
    if (newKeyword && keywords && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setKeywordInput('');
    }
  };

  const handleKeywordRemove = (index: number) => {
    if (keywords) {
      setKeywords(keywords.filter((_, i) => i !== index));
    }
  };

  const handleKeywordInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleKeywordAdd();
    }
  };

  const handleSave = () => {
    if (!text || !text.trim()) {
      alert('请输入文本内容');
      return;
    }

    const trimmedText = text.trim();
    const safeKeywords = keywords || [];
    const newItem = item 
      ? { ...item, text: trimmedText, keywords: safeKeywords, updateTime: new Date().toISOString() }
      : createTextItem(trimmedText, safeKeywords);
    
    onSave(newItem);
    onClose();
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('确定要放弃更改吗？')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="text-editor"
      {...swipeHandlers}
    >
      <div className="text-editor__header">
        <button 
          className="text-editor__cancel"
          onClick={handleCancel}
        >
          取消
        </button>
        <h2 className="text-editor__title">
          {item ? '编辑笔记' : '新建笔记'}
        </h2>
        <button 
          className="text-editor__save"
          onClick={handleSave}
          disabled={!text || !text.trim()}
        >
          保存
        </button>
      </div>

      <div className="text-editor__content">
        <div className="text-editor__section">
          <label className="text-editor__label">文本内容</label>
          <textarea
            className="text-editor__textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请输入文本内容..."
            rows={8}
          />
        </div>

        <div className="text-editor__section">
          <label className="text-editor__label">关键字</label>
          <div className="text-editor__keyword-input">
            <input
              type="text"
              className="text-editor__input"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={handleKeywordInputKeyPress}
              placeholder="输入关键字，按回车或逗号添加"
            />
            <button 
              className="text-editor__add-keyword"
              onClick={handleKeywordAdd}
              disabled={!keywordInput || !keywordInput.trim()}
            >
              添加
            </button>
          </div>
          
          {keywords && keywords.length > 0 && (
            <div className="text-editor__keywords">
              {keywords.map((keyword, index) => (
                <KeywordTag
                  key={index}
                  keyword={keyword}
                  onRemove={() => handleKeywordRemove(index)}
                  size="medium"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
