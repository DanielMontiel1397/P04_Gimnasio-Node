import express from 'express';
import { formularioInicioSesion, ingresarAplicacion } from '../controller/loginController.js';

const router = express.Router();

router.get('/',formularioInicioSesion);
router.post('/',ingresarAplicacion);


export default router;