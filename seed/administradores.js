import bcrypt from 'bcrypt';

const administradores = [
    {
        usuario: 'Agora1397',
        password: bcrypt.hashSync('password',10),
        sucursal: 'Centro',
        ciudad: 'Uruapan'
    },
    {
        usuario: 'Centro897',
        password: bcrypt.hashSync('password',10),
        sucursal: 'Centro',
        ciudad: 'Uruapan'
    }
];

export default administradores;