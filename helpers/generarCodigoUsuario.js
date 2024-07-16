
function generarCodigo(){
    let codigoUsuario = '';
    
        for(let i=0; i<4; i++){
            let code = Math.ceil(Math.random() * 9);
            codigoUsuario += code;
        }
    return codigoUsuario;
}

export default generarCodigo;