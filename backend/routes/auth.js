import { Router } from 'express';
import { login, signup, googleLogin, me } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', requireAuth, me);

export default router;


