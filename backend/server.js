const express = require('express');
const colors = require('colors');
const connectDB = require('./utils/db');
const products = require('./data/products');
require('dotenv').config();

const app = express();

connectDB();

app.get('/', (req, res) => {
	res.send('API is Running');
});

app.get('/api/products', (req, res) => {
	res.json(products);
});

app.get('/api/products/:id', (req, res) => {
	const product = products.find((p) => p._id === req.params.id);
	res.json(product);
});

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
);
