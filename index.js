import db from './config/db.js';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import express from 'express'
import loginRoutes from './routes/loginRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import apiRoutes from './routes/apiRoutes.js';
import dotenv from 'dotenv';

dotenv.config({path: ".env"});

const app = express();

//Habilitar PUG
app.set('view engine','pug');
app.set('views','./views');

//Habilitar lectura de formularios
app.use(express.urlencoded({extended: true}));

//Habilitar cpploe árser
app.use(cookieParser());

//Habilitar CSRF
app.use(csrf({cookie:true}))

//Habilitar carpeta publica
app.use(express.static('public'));

//Conexion a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log("Conexion a base de datos Correcta");
} catch (error){
    console.log(`El error es ${error}`);
}

//Rutas
app.use('/gimnasio/login', loginRoutes);
app.use('/gimnasio',adminRoutes);
app.use('/api',apiRoutes);

const port = process.env.BD_PORT || 3000;
app.listen(port,()=>{
    console.log('El servidor esta funcionando en el puerto: ' + port);
})