import 'dotenv/config';
import express from 'express';
import { runMigrations } from './db';
import productsRouter from './routes/products';

const app = express();
const port = parseInt(process.env.PORT || '8085');

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

app.use('/api/catalog', productsRouter);

runMigrations()
  .then(() => {
    app.listen(port, () => {
      console.log(`Catalog service running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to run migrations:', err);
    process.exit(1);
  });
