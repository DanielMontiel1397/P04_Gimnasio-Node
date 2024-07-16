import express from 'express';
import { adminInicio, formularioRegistro, guardarUsuario, cerrarSesion, mostrarUsuarios, editarUsuarioForm, guardarCambiosUsuario, eliminarUsuario } from '../controller/adminGimnasioController.js';
import protegerRuta from '../middelware/protegerRuta.js';
import upload from '../middelware/subirImagen.js';

const router = express.Router();

//Inicio
router.get('/inicio',protegerRuta,adminInicio);

//Registrar Nuevo Usuario
router.get('/registrarUsuario',  protegerRuta, formularioRegistro);
router.post('/registrarUsuario',  protegerRuta, guardarUsuario);

//Cerar Sesión
router.post('/cerrarSesion', protegerRuta,cerrarSesion);

//Lista de Usuarios
router.get('/listaUsuarios',protegerRuta,mostrarUsuarios);

//Editar Usuario
router.get('/listaUsuarios/editar/:id', protegerRuta,editarUsuarioForm);
router.post('/listaUsuarios/editar/:id',
    protegerRuta,
    upload.single('fotoPerfil'),
    guardarCambiosUsuario
)

//Eliminar Usuario
router.post('/listaUsuarios/eliminarUsuario/:id', protegerRuta, eliminarUsuario);

export default router;