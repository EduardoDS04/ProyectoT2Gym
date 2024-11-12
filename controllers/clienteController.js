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


// Maestro-Detalle ClientePlan
// Listar clientes asociados a un plan específico
exports.listaClientesPlan = (req, res) => {
  const { idPlan } = req.query;
  if (req.session.user) {
    db.query(
      'SELECT c.*, cp.Fecha_Inicio FROM Cliente c INNER JOIN ClientePlan cp ON c.id = cp.Cliente_id WHERE cp.Plan_Membresia = ?',
      [idPlan],
      (err, response) => {
        if (err) res.send('ERROR al hacer la consulta');
        else res.render('ClientePlan/lista', { clientes: response, idPlan, user: req.session.user });
      }
    );
  } else {
    res.redirect('/auth/login');
  }
};

// Asignar un nuevo cliente a un plan
exports.asignarClientePlan = (req, res) => {
  const { idPlan } = req.params;
  const { clienteId, fechaInicio } = req.body;
  if (req.session.user) {
    db.query(
      'INSERT INTO ClientePlan (Cliente_id, Plan_Membresia, Fecha_Inicio) VALUES (?, ?, ?)',
      [clienteId, idPlan, fechaInicio],
      (err) => {
        if (err) res.send('ERROR al asignar cliente');
        else res.redirect(`/ClientePlan?plan=${idPlan}`);
      }
    );
  } else {
    res.redirect('/auth/login');
  }
};

// Eliminar un cliente de un plan
exports.eliminarClientePlan = (req, res) => {
  const { idPlan, clienteId } = req.params;
  if (req.session.user) {
    db.query(
      'DELETE FROM ClientePlan WHERE Cliente_id = ? AND Plan_Membresia = ?',
      [clienteId, idPlan],
      (err) => {
        if (err) res.send('ERROR al dar de baja al cliente');
        else res.redirect(`/ClientePlan?plan=${idPlan}`);
      }
    );
  } else {
    res.redirect('/auth/login');
  }
};
//Meestro detalle de Plan Membresia
// Listar los clientes asociados a un plan específico
exports.listaClientesPlan = (req, res) => {
  const { idPlan } = req.query;
  if (req.session.user) {
    db.query(
      'SELECT c.*, cp.Fecha_Inicio FROM Cliente c INNER JOIN ClientePlan cp ON c.id = cp.Cliente_id WHERE cp.Plan_Membresia = ?',
      [idPlan],
      (err, response) => {
        if (err) res.send('ERROR al obtener los clientes del plan');
        else res.render('ClientePlan/lista', { clientes: response, idPlan, user: req.session.user });
      }
    );
  } else {
    res.redirect('/auth/login');
  }
};

// Asignar un cliente a un plan
exports.asignarClientePlan = (req, res) => {
  const { idPlan } = req.params;
  const { clienteId, fechaInicio } = req.body;
  if (req.session.user) {
    db.query(
      'INSERT INTO ClientePlan (Cliente_id, Plan_Membresia, Fecha_Inicio) VALUES (?, ?, ?)',
      [clienteId, idPlan, fechaInicio],
      (err) => {
        if (err) res.send('ERROR al asignar cliente al plan');
        else res.redirect(`/ClientePlan?plan=${idPlan}`);
      }
    );
  } else {
    res.redirect('/auth/login');
  }
};

// Eliminar un cliente de un plan
exports.eliminarClientePlan = (req, res) => {
  const { idPlan, clienteId } = req.params;
  if (req.session.user) {
    db.query(
      'DELETE FROM ClientePlan WHERE Cliente_id = ? AND Plan_Membresia = ?',
      [clienteId, idPlan],
      (err) => {
        if (err) res.send('ERROR al eliminar cliente del plan');
        else res.redirect(`/ClientePlan?plan=${idPlan}`);
      }
    );
  } else {
    res.redirect('/auth/login');
  }
};
