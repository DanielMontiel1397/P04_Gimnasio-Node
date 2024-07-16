import administradores from "./administradores.js";
import membresias from "./membresias.js";
import usuarios from "./usuarios.js";
import {Membresia, Administrador, Usuarios} from "../models/index.js";
import db from "../config/db.js";

const importarDatos = async ()=>{
    try{
        //Autenticar base de datos
        await db.authenticate();

        await db.sync();

        await Promise.all([
            Administrador.bulkCreate(administradores),
            Membresia.bulkCreate(membresias),
            Usuarios.bulkCreate(usuarios)
        ]);
        console.log('Datos importados correctamente');
        process.exit();
    } catch(error){
        console.log(error);
        process.exit(1)
    }
}

const eliminarDatos = async () => {
    try{
        await db.sync({force: true});
        console.log('Datos eliminados Correctamente');
        process.exit(0)

    }catch(error){
        console.log(error);
        process.exit(1)
    }
}
if(process.argv[2] === "-i"){
    importarDatos();
}

if(process.argv[2] === "-e"){
    eliminarDatos();
}