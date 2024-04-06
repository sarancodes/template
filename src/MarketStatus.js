import React, { useState, useEffect } from 'react';
import './MarketStatus.css'; 

const MarketStatus = () => {
  const [marketStatus, setMarketStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await fetch('https://finnhub.io/api/v1/stock/market-status?exchange=GBR&token=co2h1s1r01qvggee2fugco2h1s1r01qvggee2fv0');
        if (!response.ok) {
          throw new Error('Failed to fetch market status');
        }
        const data = await response.json();
        console.log(data); 
        setMarketStatus(data);
      } catch (error) {
        console.error('Error fetching market status:', error);
        setError(error.message);
      }
    };

    fetchMarketStatus();
  }, []);

  return (
    <div className="market-status">
      {error ? (
        <span>Error: {error}</span>
      ) : (
        marketStatus && (
          <span className={`status ${marketStatus.isOpen ? 'open' : 'closed'}`}>
            Market {marketStatus.isOpen ? 'Open' : 'Closed'}
          </span>
        )
      )}
    </div>
  );
};

export default MarketStatus;
