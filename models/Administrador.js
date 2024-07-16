import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import db from "../config/db.js";

const Administrador = db.define('administradores',{
    usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sucursal:{
        type: DataTypes.STRING,
        allowNull: false
    }
} ,{
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password','createdAt','updateAt']
            }
        }
    }
}
)

//Metodos Personalizados
Administrador.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

export default Administrador;