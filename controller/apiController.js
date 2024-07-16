import {Membresia, Usuarios} from '../models/index.js'

const usuarios = async (req,res) => {
    
    const usuarios = await Usuarios.findAll({
        include: [
            {model: Membresia, as: 'membresia'}
        ]
    }
    );
    res.json(usuarios)
}

export {
    usuarios
}