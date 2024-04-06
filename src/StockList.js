import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockList = ({ stocks, onRemoveStock }) => {
  const [stockPrices, setStockPrices] = useState({});
  const [companyNames, setCompanyNames] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const updatedPrices = {};
        const updatedCompanyNames = {};

        for (const stock of stocks) {
          const responsePrice = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=co2h1s1r01qvggee2fugco2h1s1r01qvggee2fv0`);
          updatedPrices[stock.symbol] = responsePrice.data.c;

          const responseCompany = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${stock.symbol}&token=co2h1s1r01qvggee2fugco2h1s1r01qvggee2fv0`);
          updatedCompanyNames[stock.symbol] = responseCompany.data.name;
        }

        setStockPrices(updatedPrices);
        setCompanyNames(updatedCompanyNames);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPrices();

    const intervalId = setInterval(fetchPrices, 10000); 

    return () => clearInterval(intervalId);
  }, [stocks]);

  const updateDatabasePrices = async () => {
    try {
      for (const stock of stocks) {
        const updatedPrice = stockPrices[stock.symbol];
        const symbol = stock.symbol; 
  
        if (updatedPrice && symbol) { 
          await axios.put(`http://localhost:5000/api/stocks/${symbol}`, { price: updatedPrice });
        } else {
          console.warn('Skipping update for stock with missing symbol or price:', stock);
        }
      }
    } catch (error) {
      console.error('Error updating database prices:', error);
    }
  };
  

  useEffect(() => {
    updateDatabasePrices();
  }, [stockPrices]); 
  return (
    <ul className="StockList">
      {stocks.map((stock, index) => (
        <li key={index} className="StockItem">
          <span>{companyNames[stock.symbol] || 'Loading...'} ({stock.symbol.toUpperCase()}) - ${stockPrices[stock.symbol] || 'Loading...'} &nbsp;</span>
          <button onClick={() => onRemoveStock(index)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};

export default StockList;
