import { Router } from 'express';
import { getFilmsByParams, getFilmById } from './films.controller';

const router = Router();

router.get('/films', getFilmsByParams);
router.get('/films/:id', getFilmById);

export default router;
