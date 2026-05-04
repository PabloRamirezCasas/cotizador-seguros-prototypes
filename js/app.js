document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();

    ui.llenarOpciones();
})

eventListener();
function eventListener() {

    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

//Clases
function Seguro (marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
function UI () {}

//Prototypes
Seguro.prototype.procesarSeguro = function() {

    const base = 2000;
    let cantidad;

    //Dependiendo de la marca el precio se incrementa un tanto %
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        default:
            cantidad = base * 1.35;
            break;
    }

    //Dependiendo de la cantidad de antiguedad el precio se reduce un 3% cada año
    const yearActual = new Date().getFullYear();
    let diferencia = (yearActual - this.year) ;
    cantidad -= (cantidad * (diferencia * 3 )) /100;

    if(this.tipo === 'basico') {
        cantidad *= 1.30
    }else {
        cantidad *= 1.50
    }
    return cantidad;
}

UI.prototype.mostrarMensaje = function (mensaje, tipo) {
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error');
    }else {
        div.classList.add('correcto');
    }

    const divError = document.querySelector('.mensaje');
    if(divError){
        return;
    }

    div.classList.add('mt-10', 'mensaje');
    div.textContent = mensaje;

    const formulario = document.querySelector('#cotizar-seguro');
    const resultado = document.querySelector('#resultado');
    formulario.insertBefore(div, resultado);

    setTimeout(() => {
        div.remove();
    }, 3000);
}

//Llena el elemento option con los ultimos 20 años
UI.prototype.llenarOpciones = function () {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i >= min ; i--){

        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;

        selectYear.appendChild(option);
    }
}
 
//Muestra la cotización en el HTML
UI.prototype.mostrarResultado = function(total, seguro) {

    const {marca, year, tipo} = seguro;

    //Se muestra la marca segun el indice elegido
    let textoMarca;
    switch (marca) {
        case "1":
            textoMarca = 'Americano';
            break;
        case "2":
            textoMarca = 'Asiatico';
            break;
        default:
            textoMarca = 'Europeo';
            break;
    }

    const div = document.createElement('DIV');
    div.classList.add('mt-10');

    //Mostramos el resumen en el HTML
    div.innerHTML = `
    <p class="header">Tu Resumen</p>
    <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
    <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal"> € ${total}</span></p>

    `;

    const resultadoDiv = document.querySelector('#resultado');

    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
        
    }, 3000);
}
//Funciones

function cotizarSeguro(e){
    e.preventDefault();

    //Validamos que todos los campos esten correctamente rellenados
    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    const ui = new UI();
    if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando…');
   
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.procesarSeguro();

    ui.mostrarResultado(total,seguro);

    //Comprobamos si ya existe un div con el resumen, en es caso lo eliminamos para evitar que se repita
    const resultado = document.querySelector('#resultado div');
    if(resultado !== null) {
        resultado.remove();
    }
}


