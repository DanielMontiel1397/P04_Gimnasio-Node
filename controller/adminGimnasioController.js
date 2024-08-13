import { formatearFecha } from '../helpers/formatearFecha.js'
import generarCodigo from '../helpers/generarCodigoUsuario.js'
import { Membresia, Usuarios } from '../models/index.js'
import { check, validationResult } from 'express-validator'
import fs, { unlink } from 'fs';

const adminInicio = (req,res) => {
    res.render('app/inicio',{
        csrfToken: req.csrfToken()
    })
}

const formularioRegistro = async (req,res) => {

    const membresias = await Membresia.findAll();
    console.log(membresias);
    res.render('app/registrarUsuario',{
        csrfToken: req.csrfToken(),
        membresias,
        usuario: {}
    })
}

const guardarUsuario = async (req,res) => {
    //Validar Campos
    await check('nombre').notEmpty().withMessage('El Nombre no puede ir Vacio').matches(/^[a-zA-Z\s]+$/).withMessage('El Nombre solo tiene que contener letras').run(req);
    await check('numeroTelefono').notEmpty().withMessage('El Telefono no puede ir vacio').matches(/^\d+$/).withMessage('El telefono solo puede contener números').run(req);
    await check('edad').notEmpty().withMessage('La Edad no puede ir vacia').matches(/^\d+$/).withMessage('La Edad tiene que ser un número').run(req);
    await check('sexo').notEmpty().withMessage('Campo Necesario').run(req);
    await check('membresia').notEmpty().withMessage('Campo Necesario').run(req);

    let resultado = validationResult(req);
    const membresias = await Membresia.findAll();

    if(!resultado.isEmpty()){
        let errorNombre = resultado.array().find(result => result.path === "nombre" ? result : '');
        let errorTelefono = resultado.array().find(result => result.path === "numeroTelefono" ? result : '');
        let errorEdad = resultado.array().find(result => result.path === "edad" ? result : '');
        let errorSexo = resultado.array().find(result => result.path === "sexo" ? result : '');
        let errorMembresia = resultado.array().find(result => result.path === "membresia" ? result : '');

        return res.render('app/registrarUsuario',{
            csrfToken: req.csrfToken(),
            membresias,
            mensajeNombre: errorNombre,
            mensajeTelefono: errorTelefono,
            mensajeEdad: errorEdad,
            mensajeSexo: errorSexo,
            mensajeMembresia: errorMembresia,
            usuario: {
                nombre: req.body.nombre,
                telefono: req.body.numeroTelefono,
                edad: req.body.edad,
                sexo: req.body.sexo,
                membresia: req.body.membresia
            }
        })
    }

    //Crear código
    
    let comprobarCodigo = true;
    let codigoUsuario = ''

    while(comprobarCodigo){
        
        codigoUsuario = generarCodigo();
    
        //Ver si no esiste un usuario con ese codigo
        let existeCodigo = await Usuarios.findOne({where: {codigo: codigoUsuario}});

        if(!existeCodigo){
            comprobarCodigo = false;
        }
    }

    //Crear USUARIO
    const {nombre, numeroTelefono,edad,sexo,membresia: membresiaId} = req.body;

    try{
        await Usuarios.create({
            nombre,
            numeroTelefono,
            edad,
            sexo,
            membresiaId,
            codigo: codigoUsuario,
            activo: true
        })

        res.redirect('/gimnasio/inicio');
    } catch(error){
        console.log(error);
    }
    
}

const cerrarSesion = async (req,res) => {
    return res.clearCookie('_tokenAdministrador').status(200).redirect('/gimnasio/login');
}

//Mostrar Usuarios Registrados
const mostrarUsuarios = async (req,res) => {
 
    const membresias = await Membresia.findAll();


    res.render('app/listaUsuarios',{
        csrfToken: req.csrfToken(),
        formatearFecha,
        membresias});
}

//Editar usuarios
const editarUsuarioForm = async (req,res) => {

    const membresias = await Membresia.findAll();
    const {id} = req.params

    const usuario = await Usuarios.findByPk(id);

    //Si el usuario no existe mandar mensaje de error
    if(!usuario) {
        res.render('./404')
    }

    res.render('app/editarUsuario',{
        csrfToken: req.csrfToken(),
        membresias,
        usuarios: [],
        usuario: usuario
    })
}

const guardarCambiosUsuario = async (req,res) => {

    const {id} = req.params;
    const membresias = await Membresia.findAll();
    const usuario = await Usuarios.findByPk(id);

    //Si el usuario no existe mandar mensaje de error
    if(!usuario) {
        res.render('./404')
    }

    //Comprobar si la imagen se subio Correctamente
    if(req.file){
        fs.readFile(`./public/uploads/${req.file.filename}`,(error,image) => {
            if(error){
                console.log(error.message);
                return res.render('app/editarUsuario',{
                    csrfToken: req.csrfToken(),
                    membresias,
                    mensajeImagen: 'La Imagen no se pudo subir Correctamente',
                    usuario: {
                        nombre: req.body.nombre,
                        numeroTelefono: req.body.numeroTelefono,
                        edad: req.body.edad,
                        sexo: req.body.sexo,
                        membresiaId: req.body.membresia
                    }
                })
            }
        })
    }

    //Validar Campos
    await check('nombre').notEmpty().withMessage('El Nombre no puede ir Vacio').matches(/^[a-zA-Z\s]+$/).withMessage('El Nombre solo tiene que contener letras').run(req);
    await check('numeroTelefono').notEmpty().withMessage('El Telefono no puede ir vacio').matches(/^\d+$/).withMessage('El telefono solo puede contener números').run(req);
    await check('edad').notEmpty().withMessage('La Edad no puede ir vacia').matches(/^\d+$/).withMessage('La Edad tiene que ser un número').run(req);
    await check('sexo').notEmpty().withMessage('Campo Necesario').run(req);
    await check('membresia').notEmpty().withMessage('Campo Necesario').run(req);

    let resultado = validationResult(req);


    //Si algún campo no se valido correctamente borramos la imagen que se cargo y mandamos los errores
    if(!resultado.isEmpty()){
        
        if(req.file){
            fs.unlinkSync(`./public/uploads/${req.file.filename}`);
        }

        let errorNombre = resultado.array().find(result => result.path === "nombre" ? result : '');
        let errorTelefono = resultado.array().find(result => result.path === "numeroTelefono" ? result : '');
        let errorEdad = resultado.array().find(result => result.path === "edad" ? result : '');
        let errorSexo = resultado.array().find(result => result.path === "sexo" ? result : '');
        let errorMembresia = resultado.array().find(result => result.path === "membresia" ? result : '');

        return res.render('app/editarUsuario',{
            csrfToken: req.csrfToken(),
            membresias,
            mensajeNombre: errorNombre,
            mensajeTelefono: errorTelefono,
            mensajeEdad: errorEdad,
            mensajeSexo: errorSexo,
            mensajeMembresia: errorMembresia,
            usuario: {
                nombre: req.body.nombre,
                numeroTelefono: req.body.numeroTelefono,
                edad: req.body.edad,
                sexo: req.body.sexo,
                membresiaId: req.body.membresia,
                fotoPerfil: usuario.fotoPerfil,
                id
            }
        })
    }

    //Si el usuario ya tiene foto y se edito, eliminar la existente de las descargas
    if(usuario.fotoPerfil && req.file){
        fs.unlinkSync(`./public/uploads/${usuario.fotoPerfil}`);
    }

    //Guardar los nuevos cambios
    const {nombre, numeroTelefono, edad, sexo, membresia} = req.body;

    try {
        usuario.set({
            nombre,
            numeroTelefono,
            edad,
            sexo,
            membresiaId: membresia,
            fotoPerfil: req.file ? req.file.filename : usuario.fotoPerfil
        })

        await usuario.save();
        res.redirect('/gimnasio/listaUsuarios')
    } catch (error) {
        console.log(error);
    }

}

//Eliminar Usuarios
const eliminarUsuario = async (req,res) => {

    const {id} =req.params;

    //Validar que usuario exista
    const usuario = await Usuarios.findByPk(id);

    if(!usuario) {
        res.render('./404')
    }

    //Eliminar foto
    if(usuario.fotoPerfil){
        fs.unlinkSync(`public/uploads/${usuario.fotoPerfil}`);  
    }

    //Eliminar Usuario
    await usuario.destroy();

    res.redirect('/gimnasio/listaUsuarios');

}

export {
    adminInicio,
    formularioRegistro,
    guardarUsuario,
    cerrarSesion,
    mostrarUsuarios,
    editarUsuarioForm,
    guardarCambiosUsuario,
    eliminarUsuario
}