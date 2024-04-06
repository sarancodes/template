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
  price: Number
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
