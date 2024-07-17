import db from "../config/db.js";
import { DataTypes } from "sequelize";

const Usuarios = db.define('usuarios',{
    id: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroTelefono: {
        type: DataTypes.STRING,
        allowNull:false
    },
    edad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sexo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN
    },
    codigo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fotoPerfil: {
        type: DataTypes.STRING
    }
});

export default Usuarios;