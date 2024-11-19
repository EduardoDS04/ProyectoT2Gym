const db = require('../db')

// Obtener la lista de todos los entrenadores
exports.entrenadores = (req, res) => {
  if (req.session.user)  
    db.query(
      'SELECT * FROM `Entrenador`',  
      (err, response) => {
        if (err) res.send('Error al hacer la consulta') 
        else res.render('Entrenador/lista', { entrenadores: response, user: req.session.user })  
      }
    )
  else 
    res.redirect('/auth/login')
};

// Mostrar formulario para agregar un nuevo entrenador
exports.entrenadorAddFormulario = (req, res) => {
  if (req.session.user)  
    return res.render('Entrenador/add')  
  
};

// Agregar un nuevo entrenador a la base de datos
exports.entrenadorAdd = (req, res) => {
  const { nombre, especialidad, nivel_experiencia } = req.body;  
  
  if (!nombre || !especialidad || !nivel_experiencia) {
    return res.send('Todos los campos son requeridos');
  }

  db.query(
    'INSERT INTO Entrenador (Nombre, Especialidad, Nivel_Experiencia) VALUES (?, ?, ?)',  
    [nombre, especialidad, nivel_experiencia],  
    (error, respuesta) => {
      if (error) {
        return res.send('Error al insertar el entrenador: ' + error);  
      } else {
        res.redirect('/Entrenador');
      }
    }
  );
};

// Mostrar formulario para eliminar un entrenador
exports.entrenadorDelFormulario = (req, res) => {
  const { id } = req.params; 
  if (isNaN(id)) {
    res.send('Parámetros incorrectos');
  } else {
    if (req.session.user) {
      db.query(
        'SELECT * FROM Entrenador WHERE id=?',  
        [id],  
        (error, respuesta) => {
          if (error) {
            res.send('Error al intentar borrar el entrenador');
          } else {
            if (respuesta.length > 0) {
              
              res.render('Entrenador/delete', { 
                entrenador: respuesta[0],  
                user: req.session.user 
              });
            } else {
              res.send('Error al intentar borrar el entrenador, no existe');
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
  const { id } = req.params;

 
  if (isNaN(id)) {
    return res.send('Error borrando el entrenador:, el id no existe');
  } else {
    
    db.query(
      'DELETE FROM Sesion WHERE id_Entrenador = ?',  
      [id],  
      (errorSesion, respuestaSesion) => {
        if (errorSesion) {
          console.error('Error al eliminar las sesiones del entrenador:', errorSesion);
          return res.send('Error borrando sesiones: ' + errorSesion.message);
        }

     
        db.query(
          'DELETE FROM Entrenador WHERE id = ?', 
          [id],  
          (error, respuesta) => {
            if (error) {
              console.error('Error al intentar borrar el entrenador:', error);
              return res.send('Error borrando el entrenador: ' + error.message);
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
    res.send('Parámetros incorrectos');
  } else {
    if (req.session.user) {
      db.query(
        'SELECT * FROM Entrenador WHERE id=?',  
        [id],  
        (error, respuesta) => {
          if (error) {
            res.send('Error al intentar actualizar el entrenador');
          } else {
            if (respuesta.length > 0) {
              res.render('Entrenador/edit', { 
                entrenador: respuesta[0],  
                user: req.session.user 
              });
            } else {
              res.send('Error al intentar actualizar el entrenador, no existe');
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
    res.send('Error actualizando el entrenador');
  } else {
    db.query(
      'UPDATE Entrenador SET Nombre = ?, Especialidad = ?, Nivel_Experiencia = ? WHERE id = ?',  
      [nombre, especialidad, nivel_experiencia, id],  
      (error, respuesta) => {
        if (error) {
          res.send('Error al actualizar entrenador: ' + error); 
          console.log(error);
        } else {
          res.redirect('/Entrenador');  
        }
      }
    );
  }
};



// Listar entrenadores y sesiones asociadas (maestro-detalle)
exports.verSesionesEntrenador = (req, res) => {
  const idEntrenador = req.params.id;

  if (req.session.user) {
      db.query(
          'SELECT * FROM `Sesion` WHERE id_Entrenador = ?',
          [idEntrenador],
          (err, sesiones) => {
              if (err) {
                  res.send('Error al obtener las sesiones del entrenador');
              } else {
                  res.render('Entrenador/sesion', { 
                      sesiones, 
                      idEntrenador, 
                      user: req.session.user 
                  });
              }
          }
      );
  } else {
      res.redirect('/auth/login');
  }
};
