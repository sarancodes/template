const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());


mongoose.connect('mongodb://localhost:27017/stockPortfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


const stockSchema = new mongoose.Schema({
  symbol: String,
  price: Number,
  description: String
});


const Stock = mongoose.model('Stock', stockSchema);


app.post('/api/stocks', async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    await newStock.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving stock data:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.get('/api/stocks', async (req, res) => {
  try {
    const allStocks = await Stock.find();
    res.json(allStocks);
  } catch (error) {
    console.error('Error fetching stock list:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.put('/api/stocks/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { price } = req.body;

    const updatedStock = await Stock.findOneAndUpdate({ symbol }, { price }, { new: true });

    if (!updatedStock) {
      return res.status(404).json({ success: false, error: 'Stock not found' });
    }

    res.json({ success: true, updatedStock });
  } catch (error) {
    console.error('Error updating stock price:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.delete('/api/stocks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Received DELETE request for ID:', id);
  
      const stockToDelete = await Stock.findById(id);
      if (!stockToDelete) {
        return res.status(404).json({ success: false, error: 'Stock not found' });
      }
  
      console.log('Stock to delete:', stockToDelete);
  
      await Stock.findByIdAndDelete(id);
      console.log('Stock deleted successfully');
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting stock:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
