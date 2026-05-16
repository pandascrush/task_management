import { Router } from 'express';
import { auth } from '../middleware/auth';
import { role } from '../middleware/role';
import validate from '../middleware/validate';
import { TaskController } from '../controllers/task.controller';
import {
  createTaskSchema,
  updateStatusSchema,
  assignTaskSchema,
} from '../validators/task.validator';

const router = Router();

router.post('/', auth, role('ADMIN'), validate(createTaskSchema), TaskController.create);
router.get('/', auth, TaskController.getAll);
router.patch('/:id/assign', auth, role('ADMIN'), validate(assignTaskSchema), TaskController.assign);
router.patch('/:id/status', auth, validate(updateStatusSchema), TaskController.updateStatus);

export default router;
