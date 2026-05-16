import { Router } from 'express';
import { auth } from '../middleware/auth';
import { role } from '../middleware/role';
import validate from '../middleware/validate';
import { UserController } from '../controllers/user.controller';
import { createUserSchema } from '../validators/user.validator';

const router = Router();

router.post('/', auth, role('ADMIN'), validate(createUserSchema), UserController.create);
router.get('/', auth, role('ADMIN'), UserController.getAll);

export default router;
