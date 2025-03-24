require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:');
    console.error(err);
  });

app.use('/items', require('./routes/items'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/auth', require('./routes/auth'));