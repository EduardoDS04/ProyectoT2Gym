const db = require('../db')

// Obtener la lista de todas las sesiones
exports.sesiones = (req, res) => {
    if (req.session.user)  
      db.query(
        'SELECT * FROM `Sesion`',  
        (err, response) => {
          if (err) res.send('Error al hacer la consulta') 
          else res.render('sesion/lista', { sesiones: response, user: req.session.user })  
        }
      )
    else 
      res.redirect('/auth/login')
  };