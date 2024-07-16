(function (){

    document.addEventListener('DOMContentLoaded', ()=> {
        const inputs = document.querySelectorAll('.input-container input');

        inputs.forEach(input => {

            if(input.value.trim() !== ''){
                input.classList.add('not-empty');
            } else {
                input.classList.remove('not-empty');
            }

            input.addEventListener('input',()=>{
                if(input.value.trim() !== ''){
                    input.classList.add('not-empty');
                } else {
                    input.classList.remove('not-empty');
                }
            })
        })
    })

})()