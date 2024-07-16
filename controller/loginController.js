import { check, validationResult } from "express-validator"
import { Administrador } from "../models/index.js"
import { generarJWT } from "../helpers/jsonWebToken.js"

const formularioInicioSesion = async (req,res) => {
    res.render('./login/gimnasio-login',{
        pagina: "Bienvenido A gym strong, Ingresar",
        csrfToken: req.csrfToken()
    })
}

const ingresarAplicacion = async (req,res)=>{

    //Validar Campos
    await check('usuario').notEmpty().withMessage('El Usuario no puede ir Vacio').run(req);
    await check('password').notEmpty().withMessage('El Password no puede ir vacio').run(req);

    let resultado = validationResult(req);
    
    
    if(!resultado.isEmpty()){

        let errorUsuario = resultado.array().find(result => result.path === 'usuario' ? result : '');
        let errorPassword = resultado.array().find(result => result.path === 'password' ? result : '');

        return res.render('login/gimnasio-login',{
            pagina: "Bienvenido A gym strong, Ingresar",
            csrfToken: req.csrfToken(),
            mensajeUsuario: errorUsuario,
            mensajePassword: errorPassword,
            administrador: {
                usuario: req.body.usuario,
            }
        })
    }

    const {usuario,password} = req.body;

    //Comprobar si el usuario existe en la Base de Datos
    const existeAdministrador = await Administrador.findOne({where: {usuario: usuario}});

    if(!existeAdministrador){
        return res.render('login/gimnasio-login',{
            pagina: "Bienvenido A gym strong, Ingresar",
            csrfToken: req.csrfToken(),
            mensajeUsuario: {msg: "El Usuario no existe"},
            administrador: {
                usuario: req.body.usuario,
            }
        })
    }

    //Comprobar que la contraseña sea corecta
    if(!existeAdministrador.verificarPassword(password)){
        return res.render('login/gimnasio-login',{
            pagina: "Bienvenido A gym strong, Ingresar",
            csrfToken: req.csrfToken(),
            mensajePassword: {msg: "El Password es Incorrecto"},
            administrador: {
                usuario: req.body.usuario,
            }
        })
    }

    //Autenticar al usuario
    const token = generarJWT({
        id: existeAdministrador.id,
        usuario: existeAdministrador.usuario
    })

    //Almacenar en cookie
    return res.cookie('_tokenAdministrador',token,{
        httpOnly: true
    }).redirect('/gimnasio/inicio');
}

export {
    formularioInicioSesion,
    ingresarAplicacion
}