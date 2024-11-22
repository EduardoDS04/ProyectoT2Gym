const bcrypt = require('bcrypt');
const db = require('../db');

exports.panel = (req, res) => {
    try {
        if (req.session.user && req.session.user.tipo === 'ADMIN') {
            db.query(
                `
                SELECT 
                    (SELECT COUNT(*) FROM Cliente) AS totalClientes, 
                    (SELECT COUNT(*) FROM Entrenador) AS totalEntrenadores,
                    (SELECT COUNT(*) FROM Plan_Membresia) AS totalPlanes,
                    (SELECT COUNT(*) FROM Sesion) AS totalSesiones
                `,
                (error, resultados) => {
                    if (error) {
                        console.error('Error al consultar datos del panel:', error);
                        return res.render('mensaje', { 
                            tituloPagina: 'Error', 
                            mensajePagina: 'No se pudieron cargar los datos del panel.' 
                        });
                    }

                    const datosPanel = resultados[0]; 
                    res.render('admin/panel', { user: req.session.user, datosPanel });
                }
            );
        } else {
            res.redirect('/auth/login'); 
        }
    } catch (error) {
        console.error('Error al cargar el panel de administración:', error);
        res.redirect('/auth/login'); 
    }
};
