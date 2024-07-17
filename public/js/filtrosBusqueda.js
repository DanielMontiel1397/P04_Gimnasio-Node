
(function(){

    document.addEventListener('DOMContentLoaded',() => {
        const contenedorUsuarios = document.querySelector('.lista-usuarios');
        const membresiaSelect = document.querySelector('#membresiaSelect');
        const activoSelect = document.querySelector('#activoSelect');
        const codigoSelect = document.querySelector('#codigoSelect');
        const valorToken = document.querySelector('#csrf-Token').getAttribute('value');

        let usuarios = {}; //Objeto que contendrá todos los usuarios
    
        const filtros = {
            membresia: '',
            activo: '',
            codigo: ''
        }
    
        membresiaSelect.addEventListener('change', e=>{
            filtros.membresia = +e.target.value;
            filtrarUsuarios();
        })
    
        activoSelect.addEventListener('change',(e)=>{
            filtros.activo = e.target.value;
            filtrarUsuarios();
        })

        codigoSelect.addEventListener('blur', (e) => {
            if(e.target.value.trim() !== ''){
                filtros.codigo = e.target.value;
                filtrarUsuarios();
            } else {
                filtros.codigo = '';
                filtrarUsuarios();
            }
        })

        //Consumir api de todas los usuarios
        const obtenerUsuarios = async () =>{
            try{
                const url = '/api/usuarios';
                const respuesta = await fetch(url);
                usuarios = await respuesta.json()
                mostrarUsuarios(usuarios);
    
            } catch (error){
                console.log('El error es: ' + error);
            }
        }
    
        //Mostrar todos los usuarios en el html
        const mostrarUsuarios = usuarios => {
            //Limpiar Usuarios
            limpiarUsuarios();
            usuarios.forEach(usuario => {


               const usuarioHTML = document.createElement('li');
               usuarioHTML.classList.add('usuario');
                usuarioHTML.innerHTML = `
                            <div class="codigo-container">
                                <p>Codigo usuario: </p>
                                <span>${usuario.codigo}</span>
                            </div>
                            <div class="imagen-container">
                                <img src=${usuario.fotoPerfil ? "/uploads/"+usuario.fotoPerfil : '/img/usuario.jpg'} alt="Foto Usuario">
                            </div>
                            <div class="informacion-container">
                                <p>${usuario.nombre}</p>
                                <p>Telefono: <span>${usuario.numeroTelefono}</span></p>
                                <p>Usuario: <span class="activo-inactivo">${usuario.activo.toString() === 'true' ? 'Activo' : 'Inactivo'}</span></p>
                            </div>
                            <div class="informacion-container mobile">
                                <p>Fecha de Ingreso:</p>
                                <span>${formatearFecha(usuario.createdAt)}</span>
                                <p>Tipo de Membresia: <span>${usuario.membresia.membresiaUsuario}</span></p>
                            </div>
                            <div class="botones-container">
                                <a href="/gimnasio/listaUsuarios/editar/${usuario.id}" class="boton boton-editar">Editar</a>
                                <form action="/gimnasio/listaUsuarios/eliminarUsuario/${usuario.id}" method="POST">
                                    <input type="hidden" name="_csrf" value=${valorToken}>
                                    <input type="submit" class="boton boton-eliminar" value="Eliminar">
                                </form>
                            </div>
                `;

                contenedorUsuarios.appendChild(usuarioHTML);
                }
            );
        }

        //Filtrar Membresia
        const filtrarUsuarios = () => {
            const resultado = usuarios.filter(filtrarMembresia).filter(filtrarActivo).filter(filtrarCodigo)
            mostrarUsuarios(resultado)
        }

        const filtrarMembresia = usuario => {
            return filtros.membresia ? usuario.membresiaId.toString() == filtros.membresia.toString() : usuario
        }

        const filtrarActivo = usuario => {
            return filtros.activo ? usuario.activo.toString() == filtros.activo.toString() : usuario
        }

        const filtrarCodigo = usuario => {
            return filtros.codigo ? usuario.codigo === filtros.codigo : usuario
        }

        function limpiarUsuarios(){
            while(contenedorUsuarios.firstChild){
                contenedorUsuarios.removeChild(contenedorUsuarios.firstChild);
            }
        }

        obtenerUsuarios();

        const formatearFecha = (fecha) => {
            const nuevaFecha = new Date(fecha).toISOString().slice(0,10);
        
            const opciones = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return new Date(nuevaFecha).toLocaleDateString('es-Es',opciones)
        }
        

    })

})()