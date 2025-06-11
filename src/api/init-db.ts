import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = express.Router();

router.get('/', async (_req: express.Request, res: express.Response) => {
  try {
    // Generate Prisma client
    await execAsync('npx prisma generate');
    
    // Push schema to database
    await execAsync('npx prisma db push');
    
    res.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database initialization failed',
      details: error.message 
    });
  }
});

export default router;