import React, { useState } from 'react';

const expander = {
  margin: '6px 0',
  padding: '2px',
  border: '1px solid gray',
  borderRadius: '15px'
};

const header = {
  display: 'flex',
  cursor: 'pointer',
};

const titleStyle = {
  padding: '3px',
  flex: 'none'
};

const spacer = {
flex: '1'
};

const icon = {
  padding: '3px',
  flex: 'end'
};

const contentExpanded = {
  overflow: 'hidden',
  transition: 'all 0.3s',
  padding: '4px 0',
  height: 'auto',
  filter: 'opacity(1)'
};

const contentCollapsed = {
  overflow: 'hidden',
  transition: 'all 0.3s',
  padding: '0 0',
  border: '1px solid transparent',
  height: '0',
  filter: 'opacity(0)'
};

const QuizExpander = ({title, children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleExpander = () => {
    	setIsOpen(!isOpen);
    };
  	return (
      <div style={expander}>
        <div style={header} onClick={toggleExpander}>
          <div style={titleStyle}>{title}</div>
          <div style={spacer} />
          <div style={icon}>{isOpen ? '🔺' : '🔻'}</div>
        </div>
        <div style={isOpen ? contentExpanded : contentCollapsed}>
          {children}
        </div>
      </div>
    );
};

export default QuizExpander;
