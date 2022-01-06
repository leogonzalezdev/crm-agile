(function () {
  let DB;
  const formulario = document.querySelector('#formulario');

  document.addEventListener('DOMContentLoaded', () => {
    conectarDB();
    formulario.addEventListener('submit', validarCliente);
  });

  function conectarDB() {
    const abrirConexion = window.indexedDB.open('crm', 1);
    abrirConexion.onerror = () => {
      console.log('Hubo un error.');
    }
    abrirConexion.onsuccess = () => {
      DB = abrirConexion.result;
    }
  }

  function validarCliente(e) {
    e.preventDefault();
    // Leer todos los inputs
    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const empresa = document.querySelector('#empresa').value;

    if (nombre === '' || email === '' || telefono === '' || empresa === '' ) {
      imprimirAlerta('Todos los campos son obligatorios.', 'error');
      return;
    }
    // Crear un objeto con la informacion
    const cliente = {
      nombre,
      email,
      telefono,
      empresa
    }

    cliente.id = Date.now();
    crearNuevoCliente(cliente);
  }

  function crearNuevoCliente(cliente) {
    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');
    objectStore.add(cliente);

    transaction.oncomplete = function(){
      imprimirAlerta('El cliente se añadió correctamente');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    };
    transaction.onerror = (error)=>{
      console.log(error);
    }
  }


  
}());