(function(){

    document.addEventListener('DOMContentLoaded',()=>{
        const archivo = document.getElementById('archivo-input');
        const imagen = document.getElementById('foto-perfil');
        console.log('Holiii');
        archivo.addEventListener('change', (e) => {
            if(e.target.files[0]){
                const lectura = new FileReader();
                lectura.onload = function (e){
                    imagen.src = e.target.result;
                }
                lectura.readAsDataURL(e.target.files[0]);
            } else {
                imagen.src = "/img/usuario.jpg"
                console.log('Holiii');
            }
        })
    })

})()