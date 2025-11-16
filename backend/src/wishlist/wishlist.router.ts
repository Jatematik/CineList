import { Router } from 'express';
import {
  createWishlistFilm,
  getWishlistById,
  removeFromWishlist,
} from './wishlist.controller';

const router = Router();

router.get('/wishlist', getWishlistById);
router.post('/wishlist', createWishlistFilm);
router.delete('/wishlist/:id', removeFromWishlist);

export default router;
