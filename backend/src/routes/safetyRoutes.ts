import express from 'express';
import {
  createSafetyTask,
  getSafetyTasks,
  updateSafetyTask
} from '../controllers/safetyController';

const router = express.Router();

router.post('/tasks', createSafetyTask);
router.get('/tasks', getSafetyTasks);
router.put('/tasks/:id', updateSafetyTask);

export default router; 