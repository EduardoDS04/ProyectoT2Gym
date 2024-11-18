const db = require('../db')

// Obtener la lista de todos los entrenadores
exports.entrenadores = (req, res) => {
  db.query('SELECT * FROM Entrenador', (err, results) => {  
    if (err) {
      console.error('Error al obtener los entrenadores:', err);
      return res.render('mensaje', { 
        tituloPagina: 'Error', 
        mensajePagina: 'No se pudieron cargar los entrenadores. Detalles: ' + err.message 
      });
    }

    // Verifica que los resultados estén bien definidos
    if (!results || results.length === 0) {
      return res.render('mensaje', { 
        tituloPagina: 'Lista de Entrenadores', 
        mensajePagina: 'No se encontraron entrenadores.' 
      });
    }

    res.render('Entrenador/lista', { Entrenador: results });  
  });
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
  const { nombre, especialidad, nivel_experiencia } = req.body;  
  if (req.session.user) {
    db.query(
      'INSERT INTO Entrenador (Nombre, Especialidad, Nivel_Experiencia) VALUES (?, ?, ?)',  
      [nombre, especialidad, nivel_experiencia],  
      (error, respuesta) => {
        if (error) res.send('ERROR INSERTANDO ENTRENADOR: ' + error);  
        else res.redirect('/Entrenador');  
      }
    );
  } else {
    res.redirect('/auth/login');  
  }
};


// Mostrar formulario para eliminar un entrenador
exports.entrenadorDelFormulario = (req, res) => {
  const { id } = req.params; 
  if (isNaN(id)) {
    res.send('PARAMETROS INCORRECTOS');
  } else {
    if (req.session.user) {
      db.query(
        'SELECT * FROM Entrenador WHERE id=?',  
        [id],  
        (error, respuesta) => {
          if (error) {
            res.send('ERROR al INTENTAR BORRAR EL ENTRENADOR');
          } else {
            if (respuesta.length > 0) {
              
              res.render('Entrenador/delete', { 
                entrenador: respuesta[0],  
                user: req.session.user 
              });
            } else {
              res.send('ERROR al INTENTAR BORRAR EL ENTRENADOR, NO EXISTE');
            }
          }
        });
    } else {
      res.redirect('/auth/login');  
    }
  }
};

// Borra un entrenador en la base de datos
exports.entrenadorDel = (req, res) => {
  const { id } = req.params; // 

 
  if (isNaN(id)) {
    return res.send('ERROR BORRANDO EL ENTRENADOR: ID no válido');
  } else {
    
    db.query(
      'DELETE FROM Sesion WHERE id_Entrenador = ?',  
      [id],  
      (errorSesion, respuestaSesion) => {
        if (errorSesion) {
          console.error('Error al eliminar las sesiones del entrenador:', errorSesion);
          return res.send('ERROR BORRANDO SESIONES: ' + errorSesion.message);
        }

     
        db.query(
          'DELETE FROM Entrenador WHERE id = ?', 
          [id],  
          (error, respuesta) => {
            if (error) {
              console.error('Error al intentar borrar el entrenador:', error);
              return res.send('ERROR BORRANDO EL ENTRENADOR: ' + error.message);
            } else {
              return res.redirect('/Entrenador'); 
            }
          }
        );
      }
    );
  }
};




// Mostrar formulario para editar un entrenador
exports.entrenadorEditFormulario = (req, res) => {
  const { id } = req.params;  
  if (isNaN(id)) {
    res.send('PARÁMETROS INCORRECTOS');
  } else {
    if (req.session.user) {
      db.query(
        'SELECT * FROM Entrenador WHERE id=?',  
        [id],  
        (error, respuesta) => {
          if (error) {
            res.send('ERROR al INTENTAR ACTUALIZAR EL ENTRENADOR');
          } else {
            if (respuesta.length > 0) {
              res.render('Entrenador/edit', { 
                entrenador: respuesta[0],  
                user: req.session.user 
              });
            } else {
              res.send('ERROR al INTENTAR ACTUALIZAR EL ENTRENADOR, NO EXISTE');
            }
          }
        });
    } else {
      res.redirect('/auth/login');  
    }
  }
};

// Actualizar un entrenador en la base de datos
exports.entrenadorEdit = (req, res) => {
  const { id, nombre, especialidad, nivel_experiencia } = req.body;  
  const paramId = req.params['id'];  

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send('ERROR ACTUALIZANDO EL ENTRENADOR');
  } else {
    db.query(
      'UPDATE Entrenador SET Nombre = ?, Especialidad = ?, Nivel_Experiencia = ? WHERE id = ?',  
      [nombre, especialidad, nivel_experiencia, id],  
      (error, respuesta) => {
        if (error) {
          res.send('ERROR ACTUALIZANDO ENTRENADOR: ' + error); 
          console.log(error);
        } else {
          res.redirect('/Entrenador');  
        }
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
