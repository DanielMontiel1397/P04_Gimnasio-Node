import jwt from 'jsonwebtoken'

const generarJWT = datos => jwt.sign({
    id:datos.id,
    nombre: datos.usuario},
    process.env.JWT_SECRET,{
        expiresIn: '1d'
    }
)

export {generarJWT};