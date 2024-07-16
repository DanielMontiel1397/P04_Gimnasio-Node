
const botonMenu = document.querySelector('#boton-menu');
const menu = document.querySelector('.navegacion-oculta');

botonMenu.addEventListener('click', () => {
    console.log('holaaa');
    menu.classList.toggle('ocultar')
})