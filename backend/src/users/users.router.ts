import { Router } from 'express';
import { createUser, loginUser } from './users.controller';

const router = Router();

router.post('/sign-up', createUser);
router.post('/sign-in', loginUser);

export default router;
