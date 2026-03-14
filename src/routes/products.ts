import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET /api/catalog/products?q=...
router.get('/products', async (req: Request, res: Response) => {
  const q = (req.query.q as string | undefined)?.trim();
  try {
    if (q) {
      const result = await pool.query(
        `SELECT id, title, description, price, image_path AS "imagePath", created_at AS "createdAt"
         FROM products
         WHERE title ILIKE $1 OR description ILIKE $1
         ORDER BY created_at DESC`,
        [`%${q}%`]
      );
      res.json(result.rows);
    } else {
      const result = await pool.query(
        `SELECT id, title, description, price, image_path AS "imagePath", created_at AS "createdAt"
         FROM products
         ORDER BY created_at DESC`
      );
      res.json(result.rows);
    }
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/catalog/recommended?userId=...
router.get('/recommended', async (req: Request, res: Response) => {
  try {
    // Placeholder: return random products (real recommendation engine is future work)
    const result = await pool.query(
      `SELECT id, title, description, price, image_path AS "imagePath", created_at AS "createdAt"
       FROM products
       ORDER BY RANDOM()
       LIMIT 12`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Recommended error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/catalog/products
router.post('/products', async (req: Request, res: Response) => {
  const { title, description, price } = req.body as {
    title?: string;
    description?: string;
    price?: number;
  };

  if (!title || price === undefined) {
    res.status(400).json({ error: 'title and price are required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (title, description, price)
       VALUES ($1, $2, $3)
       RETURNING id, title, description, price, image_path AS "imagePath", created_at AS "createdAt"`,
      [title, description ?? null, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
