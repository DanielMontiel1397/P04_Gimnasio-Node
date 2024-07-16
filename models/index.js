import Membresia from "./Membresia.js";
import Administrador from "./Administrador.js"
import Usuarios from "./Usuarios.js";

Usuarios.belongsTo(Membresia, {foreignKey: 'membresiaId', as: 'membresia'});

export {
    Usuarios,
    Administrador,
    Membresia
}