import db from "../config/db.js";
import { DataTypes } from "sequelize";

const Membresia = db.define('membresias',{
    membresiaUsuario: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Membresia;
