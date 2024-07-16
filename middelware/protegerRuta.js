import jwt from 'jsonwebtoken';
import {Administrador} from '../models/index.js'

const protegerRuta = async (req,res,next) => {

    const {_tokenAdministrador} = req.cookies;

    if(!_tokenAdministrador){
        return res.redirect('/gimnasio/login');
    }

    try{
        const decodificarToken = jwt.verify(_tokenAdministrador,process.env.JWT_SECRET);
        const administrador = await Administrador.scope('eliminarPassword').findByPk(decodificarToken.id);

        if(administrador){
            req.administrador = administrador;
            return next();
        } else {
            return res.redirect('/gimnasio/login');
        }
    } catch(error){
        console.log(error);
        return res.redirect('/gimnasio/login');
    }
}

export default protegerRuta;