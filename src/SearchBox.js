import React, { useState, useEffect,useRef} from 'react';
import axios from 'axios';
import Suggestions from './Suggestions';
import './Suggestions.css';

const SearchBox = ({ onAddStock }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
  
   
    if (suggestions.length > 0) {
      document.addEventListener('click', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [suggestions]);

  useEffect(() => {
    if (query.trim() !== '') {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(`https://finnhub.io/api/v1/search?q=${query}?exchange=ASX&token=co2h1s1r01qvggee2fugco2h1s1r01qvggee2fv0&type=stock`);
          const data = response.data;

          if (data && Array.isArray(data.result)) {
           
            const filteredSuggestions = data.result.map(result => ({
              symbol: result.symbol,
              description: result.description
            }));
            setSuggestions(filteredSuggestions);
          } else {
            console.error('Invalid data format:', data);
            setSuggestions([]);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleAddStock = async (symbol, description) => {
    try {
      const responsePrice = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}?exchange=ASX&token=co2h1s1r01qvggee2fugco2h1s1r01qvggee2fv0`);
      const price = responsePrice.data.c; 
  
      const stockData = { symbol: symbol.toUpperCase(), description, price };
  
     
      await axios.post('http://localhost:5000/api/stocks', stockData);
  
      
      onAddStock(stockData);
  
      console.log('Stock added:', stockData);
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const handleManualAdd = () => {
    if (query.trim() !== '') {
      
      handleAddStock(query.trim(), query.trim());
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Enter stock name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={searchBoxRef} 
      />
      <Suggestions suggestions={suggestions} onSuggestionClick={handleAddStock} />
      <button onClick={handleManualAdd}>Add Stock</button>
    </div>
  );  
};

export default SearchBox;
