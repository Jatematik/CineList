import { Router } from 'express';
import { addLiked, getLikedById, removeFromLiked } from './liked.controller';

const router = Router();

router.get('/liked', getLikedById);
router.post('/liked', addLiked);
router.delete('/liked/:id', removeFromLiked);

export default router;
