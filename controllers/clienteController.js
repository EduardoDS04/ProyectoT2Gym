const db = require('../db')

// Obtener la lista de todos los clientes
exports.clientes = (req, res) => {
  if (req.session.user)  // Verifica si el usuario está autenticado
    db.query(
      'SELECT * FROM `Cliente`',  
      (err, response) => {
        if (err) res.send('ERROR al hacer la consulta')  // Si ocurre un error en la consulta
        else res.render('Cliente/lista', { clientes: response, user: req.session.user })  
      }
    )
  else 
    res.redirect('/auth/login') 
};

// Mostrar formulario para agregar un nuevo cliente
exports.clienteAddFormulario = (req, res) => {
  if (req.session.user)  
    res.render('Cliente/add', req.session.user)  
  else 
    res.redirect('/auth/login')  
};

// Agregar un nuevo cliente a la base de datos
exports.clienteAdd = (req, res) => {
  const { nombre, apellido } = req.body  
  if (req.session.user)  
    db.query(
      'INSERT INTO Cliente (nombre, apellido) VALUES (?,?)',  
      [nombre, apellido],  
      (error, respuesta) => {
        if (error) res.send('ERROR INSERTANDO CLIENTE' + req.body)  
        else res.redirect('/Cliente')  
      }
    );
  else 
    res.redirect('/auth/login')  
};

// Mostrar formulario para eliminar un cliente
exports.clienteDelFormulario = (req, res) => {
  const { id } = req.params;  
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS')  
  else
    if (req.session.user)  
      db.query(
        'SELECT * FROM Cliente WHERE id=?',  
        id,
        (error, respuesta) => {
          if (error) res.send('ERROR al INTENTAR BORRAR EL CLIENTE')  
          else {
            if (respuesta.length > 0) {
              res.render('Cliente/delete', { cliente: respuesta[0], user: req.session.user })  
            } else {
              res.send('ERROR al INTENTAR BORRAR EL CLIENTE, NO EXISTE')  
            }
          }
        });
    else
        res.redirect('/auth/login')  
};

// Eliminar un cliente de la base de datos
exports.clienteDel = (req, res) => {
    const { id, nombre, apellido } = req.body;  
    const paramId = req.params['id'];  
  
    if (isNaN(id) || isNaN(paramId) || id !== paramId) {
      res.send('ERROR BORRANDO EL CLIENTE')  
    } else {
      db.query(
        'DELETE FROM Cliente WHERE id=?',  
        id,
        (error, respuesta) => {
          if (error) res.send('ERROR BORRANDO CLIENTE' + req.body)  
          else res.redirect('/Cliente')  
        }
      );
    }
};

// Mostrar formulario para editar un cliente
exports.clienteEditFormulario = (req, res) => {
  const { id } = req.params;  
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS')  
  else
    if (req.session.user)  
      db.query(
        'SELECT * FROM Cliente WHERE id=?',  
        id,
        (error, respuesta) => {
          if (error) res.send('ERROR al INTENTAR ACTUALIZAR EL CLIENTE')  
          else {
            if (respuesta.length > 0) {
              res.render('Cliente/edit', { cliente: respuesta[0], user: req.session.user }) 
            } else {
              res.send('ERROR al INTENTAR ACTUALIZAR EL CLIENTE, NO EXISTE')  
            }
          }
        })
      else
        res.redirect('/auth/login') 
};

// Actualizar un cliente en la base de datos
exports.clienteEdit = (req, res) => {
  const { id, nombre, apellido } = req.body;  
  const paramId = req.params['id'];  
  
  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send('ERROR ACTUALIZANDO EL CLIENTE') 
  } else {
    db.query(
      'UPDATE Cliente SET nombre = ?, apellido = ? WHERE id = ?',  
      [nombre, apellido, id],  
      (error, respuesta) => {
        if (error) {
          res.send('ERROR ACTUALIZANDO CLIENTE' + error)  
        }
        else res.redirect('/Cliente')  
      }
    );
  }
};
