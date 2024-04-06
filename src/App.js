import React, { useState } from 'react';
import SearchBox from './SearchBox';
import StockList from './StockList';
import MarketStatus from './MarketStatus';
import './App.css';

function App() {
  const [stocks, setStocks] = useState([]);

  const addStock = (stock) => {
    setStocks([...stocks, stock]);
  };

  const removeStock = (index) => {
    const updatedStocks = [...stocks];
    updatedStocks.splice(index, 1);
    setStocks(updatedStocks);
  };
  

  return (
    <div className="App">
      <h1>Stock Portfolio</h1>
      <SearchBox onAddStock={addStock} />
      <StockList stocks={stocks} onRemoveStock={removeStock} />
      <MarketStatus />
    </div>
  );
}

export default App;
