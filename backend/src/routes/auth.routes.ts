import { Router } from 'express';
import validate from '../middleware/validate';
import { AuthController } from '../controllers/auth.controller';
import { loginSchema } from '../validators/auth.validator';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', auth, AuthController.getMe);

export default router;
