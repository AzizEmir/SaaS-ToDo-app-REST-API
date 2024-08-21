import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createTask, listTasks, deleteTasks } from '../controllers/TaskController';

const router = express.Router();

router.post('/tasks', authMiddleware, createTask);
router.get('/tasks', authMiddleware, listTasks);
router.delete('/tasks', authMiddleware, deleteTasks);

export default router;