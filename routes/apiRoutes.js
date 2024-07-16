import express from 'express';
import { usuarios } from '../controller/apiController.js';

const router = express.Router();

router.get('/usuarios',usuarios);

export default router;