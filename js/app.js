(function () {
  const listadoClientes = document.querySelector('#listado-clientes');
  document.addEventListener('DOMContentLoaded', () => {
    // Manda a llamar la funcion que crea la db
    crearDB();
    if (window.indexedDB.open('crm', 1)) {
      obtenerCliente();
    }
    listadoClientes.addEventListener('click', eliminarRegistro);

  });
  // Crea la base de datos en index db 
  function crearDB() {
    const crearDB = window.indexedDB.open('crm', 1);
    // En caso de que haya un error
    crearDB.onerror = () => {
      console.log('Hubo un error al crear la base de datos.');
    }
    // Si la base de datos se creo correctamente
    crearDB.onsuccess = () => {
      DB = crearDB.result;
    }
    // Configuracion de la base de datos
    crearDB.onupgradeneeded = (e) => {
      const db = e.target.result;
      const objectStore = db.createObjectStore('crm', {
        keyPath: 'id',
        autoIncrement: true
      });
      objectStore.createIndex('nombre', 'nombre', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });
      objectStore.createIndex('telefono', 'telefono', { unique: false });
      objectStore.createIndex('empresa', 'empresa', { unique: false });
      objectStore.createIndex('id', 'id', { unique: false });
      console.log('db lista');
    }
  }

  function obtenerCliente() {
    const abrirConexion = window.indexedDB.open('crm', 1);
    abrirConexion.onerror = () => {
      console.log('Hubo un error');
    }
    abrirConexion.onsuccess = () => {
      DB = abrirConexion.result;
      const objectStore = DB.transaction('crm').objectStore('crm');
      objectStore.openCursor().onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
          const { nombre, email, telefono, empresa, id } = cursor.value;
          

          listadoClientes.innerHTML += ` 
            <tr>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                  <p class="text-sm leading-10 text-gray-700"> ${email} </p>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                  <p class="text-gray-700">${telefono}</p>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                  <p class="text-gray-600">${empresa}</p>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                  <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                  <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
              </td>
            </tr>
          `;

          cursor.continue();
        } else {
          console.log('No hay mas registros');
        }
      }
    }
  }

  function eliminarRegistro(e) {
    if (e.target.classList.contains('eliminar')) {
      const idEliminar = Number(e.target.dataset.cliente);
      const confirmar = confirm('¿Desea Eliminar este cliente?');
      if (confirmar) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.delete(idEliminar);

        transaction.oncomplete = () => {
          e.target.parentElement.parentElement.remove();
          imprimirAlerta('Cliente eliminado');
        }
        transaction.onerror = () => {
          imprimirAlerta('Ups! Hubo un error');
        }

      }
    }
  }

}());