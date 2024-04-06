
import React from 'react';

const Suggestions = ({ suggestions, onSuggestionClick }) => {
  const suggestionStyle = {
    backgroundColor: '#ffffff',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease'
  };

  const handleMouseEnter = (index) => {
    suggestions[index].hovered = true;
  };

  const handleMouseLeave = (index) => {
    suggestions[index].hovered = false;
  };

  return (
    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          style={{
            suggestionStyle,
            backgroundColor: suggestion.hovered ? '#f5f5f5' : '#ffffff',
            marginBottom: index !== suggestions.length - 1 ? '5px' : '0'
          }}
          onClick={() => onSuggestionClick(suggestion.symbol, suggestion.description)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          {suggestion.description} ({suggestion.symbol})
        </li>
      ))}
    </ul>
  );
};

export default Suggestions;
