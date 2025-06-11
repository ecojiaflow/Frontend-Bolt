import express from 'express';
import productsRouter from './api/products';
import initDbRouter from './api/init-db';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.use('/api/products', productsRouter);
app.use('/api/init-db', initDbRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});