const db = require('../db')

// Obtener la lista de todos los entrenadores
exports.entrenadores = (req, res) => {
  if (req.session.user)  // Verifica si el usuario está autenticado
    db.query(
      'SELECT * FROM `Entrenador`',  // Consulta todos los entrenadores de la base de datos
      (err, response) => {
        if (err) res.send('ERROR al hacer la consulta') 
        else res.render('Entrenador/lista', { entrenadores: response, user: req.session.user })  
      }
    )
  else 
    res.redirect('/auth/login')  // Si no hay sesión de usuario, redirige a la página de login
};

// Mostrar formulario para agregar un nuevo entrenador
exports.entrenadorAddFormulario = (req, res) => {
  if (req.session.user)  
    res.render('Entrenador/add', req.session.user)  
  else 
    res.redirect('/auth/login')  
};

// Agregar un nuevo entrenador a la base de datos
exports.entrenadorAdd = (req, res) => {
  const { nombre, apellido } = req.body 
  if (req.session.user)  
    db.query(
      'INSERT INTO Entrenador (nombre, apellido) VALUES (?,?)',  // Inserta el entrenador en la base de datos
      [nombre, apellido],  
      (error, respuesta) => {
        if (error) res.send('ERROR INSERTANDO ENTRENADOR' + req.body)  
        else res.redirect('/Entrenador')  // Si todo sale bien, redirige a la lista de entrenadores
      }
    );
  else 
    res.redirect('/auth/login')  
};

// Mostrar formulario para eliminar un entrenador
exports.entrenadorDelFormulario = (req, res) => {
  const { id } = req.params;  // Extrae el parámetro 'id' de la URL
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS')  
  else
    if (req.session.user)  
      db.query(
        'SELECT * FROM Entrenador WHERE id=?',  // Consulta el entrenador por su id
        id,
        (error, respuesta) => {
          if (error) res.send('ERROR al INTENTAR BORRAR EL ENTRENADOR')  
          else {
            if (respuesta.length > 0) {
              res.render('Entrenador/delete', { entrenador: respuesta[0], user: req.session.user })  
            } else {
              res.send('ERROR al INTENTAR BORRAR EL ENTRENADOR, NO EXISTE')  // Si el entrenador no existe
            }
          }
        });
    else
        res.redirect('/auth/login')  
};

// Eliminar un entrenador de la base de datos
exports.entrenadorDel = (req, res) => {
    const { id, nombre, apellido } = req.body;  
    const paramId = req.params['id'];  
  
    if (isNaN(id) || isNaN(paramId) || id !== paramId) {
      res.send('ERROR BORRANDO EL ENTRENADOR')  
    } else {
      db.query(
        'DELETE FROM Entrenador WHERE id=?',  
        id,
        (error, respuesta) => {
          if (error) res.send('ERROR BORRANDO ENTRENADOR' + req.body)  
          else res.redirect('/Entrenador')  
        }
      );
    }
};

// Mostrar formulario para editar un entrenador
exports.entrenadorEditFormulario = (req, res) => {
  const { id } = req.params;  
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS')  
  else
    if (req.session.user)  
      db.query(
        'SELECT * FROM Entrenador WHERE id=?',  
        id,
        (error, respuesta) => {
          if (error) res.send('ERROR al INTENTAR ACTUALIZAR EL ENTRENADOR')  // Si ocurre un error en la consulta
          else {
            if (respuesta.length > 0) {
              res.render('Entrenador/edit', { entrenador: respuesta[0], user: req.session.user })  // Si el entrenador existe, renderiza el formulario de edición
            } else {
              res.send('ERROR al INTENTAR ACTUALIZAR EL ENTRENADOR, NO EXISTE')  // Si el entrenador no existe
            }
          }
        })
      else
        res.redirect('/auth/login')  // Si no hay sesión de usuario, redirige a la página de login
};

// Actualizar un entrenador en la base de datos
exports.entrenadorEdit = (req, res) => {
  const { id, nombre, apellido } = req.body;  
  const paramId = req.params['id'];  
  
  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send('ERROR ACTUALIZANDO EL ENTRENADOR')  
  } else {
    db.query(
      'UPDATE Entrenador SET nombre = ?, apellido = ? WHERE id = ?',  
      [nombre, apellido, id],  
      (error, respuesta) => {
        if (error) {
          res.send('ERROR ACTUALIZANDO ENTRENADOR' + error)  
          console.log(error)
        }
        else res.redirect('/Entrenador')  
      }
    );
  }
};




//Maestro-detalle Sesion    Entrenaor-sesion
// Listar entrenadores y sesiones asociadas (maestro-detalle)
exports.entrenadorSesiones = (req, res) => {
    if (req.session.user) {
        db.query('SELECT * FROM `Entrenador`', (err, entrenadores) => {
            if (err) {
                res.send('ERROR al hacer la consulta de entrenadores');
            } else {
                // Obtenemos el id del entrenador
                const idEntrenadorSeleccionado = req.query.entrenador 
                    ? parseInt(req.query.entrenador) 
                    : null;

                let nombreEntrenadorSeleccionado = '';
                let sesiones = [];

                if (idEntrenadorSeleccionado) {
                    // Buscamos el nombre del entrenador seleccionado
                    const entrenadorSeleccionado = entrenadores.find(e => e.id === idEntrenadorSeleccionado);
                    nombreEntrenadorSeleccionado = entrenadorSeleccionado ? entrenadorSeleccionado.nombre : '';

                    // Si hay un entrenador seleccionado, obtenemos sus sesiones
                    db.query(
                        'SELECT * FROM `Sesion` WHERE idEntrenador = ?',
                        [idEntrenadorSeleccionado],
                        (err, response) => {
                            if (err) {
                                res.send('ERROR al hacer la consulta de sesiones');
                            } else {
                                sesiones = response;
                                res.render('Entrenador/sesion', { 
                                    entrenadores, 
                                    sesiones, 
                                    idEntrenadorSeleccionado, 
                                    nombreEntrenadorSeleccionado, 
                                    user: req.session.user 
                                });
                            }
                        }
                    );
                } else {
                    // Si no hay entrenador seleccionado, solo mostramos la lista de entrenadores
                    res.render('Entrenador/sesion', { 
                        entrenadores, 
                        sesiones, 
                        idEntrenadorSeleccionado: null, 
                        nombreEntrenadorSeleccionado: '', 
                        user: req.session.user 
                    });
                }
            }
        });
    } else {
        res.redirect('/auth/login');
    }
};
