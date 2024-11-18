const db = require('../db')

// Obtener la lista de todos los entrenadores
exports.entrenadores = (req, res) => {
  if (req.session.user)  
    db.query(
      'SELECT * FROM `Entrenador`',  
      (err, response) => {
        if (err) res.send('ERROR al hacer la consulta') 
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
  const { id } = req.params;

 
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
