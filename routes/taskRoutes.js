import express from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  shareTaskController
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);     
router.post('/', createTask);   
router.put('/:id', updateTask); 
router.delete('/:id', deleteTask);
router.post('/:taskId/share', shareTaskController); 

export default router;
