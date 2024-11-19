const db = require('../db')

exports.clientes = (req, res) => {
  db.query('SELECT * FROM `Cliente`', (err, response) => {
    if (err) {
      res.send('ERROR al hacer la consulta');
    } else {
      console.log(response); 
      res.render('Cliente/lista', { clientes: response, user: req.session.user });
    }
  });
};


// Mostrar formulario para agregar un nuevo cliente
exports.clienteAddFormulario = (req, res) => {
  if (req.session.user) {
    res.render('Cliente/add', { user: req.session.user }); 
  } else {
    res.redirect('/auth/login'); 
  }
};


exports.clienteAdd = (req, res) => {
  const { nombre, correo, fecha_registro, telefono } = req.body;

  // Validación de los datos
  if (!nombre || !correo || !fecha_registro || !telefono) {
    return res.send('Todos los campos son requeridos');
  }

  // Insertar en la base de datos
  db.query(
    'INSERT INTO Cliente (Nombre, Correo, Fecha_Registro, Telefono) VALUES (?, ?, ?, ?)',
    [nombre, correo, fecha_registro, telefono],
    (error, respuesta) => {
      if (error) {
        return res.send('Error al insertar el cliente: ' + error);
      } else {
        res.redirect('/Cliente');  
      }
    }
  );
};




exports.clienteDelFormulario = (req, res) => {
  const { id } = req.params;  
  if (isNaN(id)) {
      return res.send('PARAMETROS INCORRECTOS');
  }
  if (req.session.user) {
      db.query(
          'SELECT * FROM Cliente WHERE id=?',  
          [id],
          (error, respuesta) => {
              if (error) {
                  return res.send('ERROR al INTENTAR BORRAR EL CLIENTE');
              }
              if (respuesta.length > 0) {
                  res.render('Cliente/delete', { cliente: respuesta[0], user: req.session.user });
              } else {
                  res.send('No se ha encontrado el cliente.');
              }
          }
      );
  } else {
      res.redirect('/auth/login');
  }
};

exports.clienteDel = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
      return res.send('ERROR BORRANDO EL CLIENTE: ID no válido');
  }

  // Eliminar las relaciones en ClientePlan
  db.query(
      'DELETE FROM ClientePlan WHERE id_Cliente=?',
      [id],
      (error) => {
          if (error) {
              return res.send('ERROR BORRANDO PLANES RELACIONADOS: ' + error);
          }
          // Ahora eliminar el cliente
          db.query(
              'DELETE FROM Cliente WHERE id=?',
              [id],
              (error) => {
                  if (error) {
                      return res.send('ERROR BORRANDO CLIENTE: ' + error);
                  }
                  res.redirect('/Cliente');
              }
          );
      }
  );
};




// Mostrar formulario para editar un cliente
exports.clienteEditFormulario = (req, res) => {
  const { id } = req.params;  // Obtener el ID del cliente desde los parámetros de la URL

  // Verificar si el ID es un número válido
  if (isNaN(id)) {
    return res.send('Parámetros incorrectos: ID no es un número');  // Retornar error si el ID no es un número
  }

  // Verificar si el usuario está logueado
  if (req.session.user) {
    // Realizar la consulta para obtener los datos del cliente
    db.query(
      'SELECT * FROM Cliente WHERE id = ?', 
      [id], 
      (error, respuesta) => {
        if (error) {
          return res.send('Error al intentar obtener el cliente: ' + error);  // Manejo de errores en la consulta
        }
        if (respuesta.length > 0) {
          res.render('Cliente/edit', { cliente: respuesta[0], user: req.session.user });
        } else {
          res.send(`Error: No se ha encontrado el cliente con ID ${id}`);  // Si no se encuentra el cliente con ese ID
        }
      }
    );
  } else {
    res.redirect('/auth/login');  // Si no está logueado, redirigir al login
  }
};





exports.clienteEdit = (req, res) => {
  const { id } = req.params;  // Obtener el ID desde los parámetros de la URL
  const { nombre, correo, telefono } = req.body;  // Obtener los valores del formulario

  // Asegurarse de que todos los campos estén presentes
  if (!nombre || !correo || !telefono) {
      return res.send('Todos los campos son obligatorios');
  }

  // Actualización del cliente
  db.query(
      'UPDATE Cliente SET Nombre = ?, Correo = ?, Telefono = ? WHERE id = ?',
      [nombre, correo, telefono, id], 
      (error, respuesta) => {
          if (error) {
              return res.send('Error actualizando cliente: ' + error);
          } else {
              res.redirect('/Cliente');  // Redirigir a la lista de clientes después de la actualización
          }
      }
  );
};

// Manejar registro de cliente
exports.registrarCliente = (req, res) => {
  const { Nombre, Correo, Telefono } = req.body;
  const fechaRegistro = new Date(); // Fecha actual

  if (!Nombre || !Correo || !Telefono) {
      return res.render('mensaje', {
          tituloPagina: 'Registro',
          mensajePagina: 'Todos los campos son obligatorios.'
      });
  }

  db.query(
      'INSERT INTO Cliente (Nombre, Correo, Fecha_Registro, Telefono) VALUES (?, ?, ?, ?)',
      [Nombre, Correo, fechaRegistro, Telefono],
      (err, result) => {
          if (err) {
              console.error('Error al registrar cliente:', err);
              return res.render('mensaje', {
                  tituloPagina: 'Error',
                  mensajePagina: 'No se pudo registrar al cliente. Intenta más tarde.'
              });
          }
          req.session.user.id_Cliente = result.insertId;
          res.redirect('/Plan_Membresia');
      }
  );
};




// Mostrar formulario de edición del perfil
exports.miPerfil = (req, res) => {
    const id_Cliente = req.session.user.id_Cliente;

    db.query('SELECT * FROM Cliente WHERE id = ?', [id_Cliente], (err, results) => {
        if (err) {
            console.error('Error al obtener los datos del cliente:', err);
            return res.status(500).send('Error al obtener los datos del cliente.');
        }

        if (results.length === 0) {
            console.error('No se encontró el cliente con el ID:', id_Cliente);
            return res.status(404).send('Cliente no encontrado.');
        }

        const cliente = results[0];
        res.render('Cliente/mi-perfil', { cliente });
    });
};


// Guardar los cambios en el perfil
exports.actualizarPerfil = (req, res) => {
  const { Nombre, Correo, Telefono } = req.body;
  const id_Cliente = req.session.user.id_Cliente;

  db.query(
      'UPDATE Cliente SET Nombre = ?, Correo = ?, Telefono = ? WHERE id = ?',
      [Nombre, Correo, Telefono, id_Cliente],
      (err) => {
          if (err) {
              console.error('Error al actualizar el perfil:', err);
              return res.status(500).send('Error al actualizar el perfil.');
          }

          res.redirect('/Cliente/mi-perfil');
      }
  );
};

// Eliminar el perfil
exports.eliminarPerfil = (req, res) => {
  const id_Cliente = req.session.user.id_Cliente;

  db.query('DELETE FROM Cliente WHERE id = ?', [id_Cliente], (err) => {
      if (err) {
          console.error('Error al eliminar el perfil:', err);
          return res.status(500).send('Error al eliminar el perfil.');
      }

      // Cerrar la sesión y redirigir al login
      req.session.destroy((err) => {
          if (err) {
              console.error('Error al cerrar sesión después de eliminar el perfil:', err);
          }
          res.redirect('/auth/login');
      });
  });
};
