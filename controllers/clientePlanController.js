const db = require('../db');
exports.listarPlanesCliente = (req, res) => {
    const id_Cliente = req.session.user.id_Cliente;

    db.query(
        `SELECT cp.id AS PlanID, c.Nombre AS NombreCliente, c.id AS ClienteID, pm.Nombre_Plan, cp.Fecha_Inicio
         FROM ClientePlan cp
         JOIN Plan_Membresia pm ON cp.id_Plan = pm.id
         JOIN Cliente c ON cp.id_Cliente = c.id
         WHERE cp.id_Cliente = ?`,
        [id_Cliente],
        (err, results) => {
            if (err) {
                console.error('Error al listar planes del cliente:', err);
                return res.status(500).send('Error al listar planes del cliente.');
            }

            const planes = results.map(plan => ({
                id: plan.PlanID, 
                Nombre_Plan: plan.Nombre_Plan,
                Fecha_Inicio: plan.Fecha_Inicio,
            }));

            const cliente = {
                Nombre: results[0]?.NombreCliente || '',
                ID: results[0]?.ClienteID || '',
            };

            res.render('ClientePlan/lista', { planes, cliente });
        }
    );
};


exports.eliminarPlan = (req, res) => {
    const planId = req.params.id;

    if (!planId) {
        return res.render('mensaje', {
            tituloPagina: 'Error',
            mensajePagina: 'No se pudo identificar el plan a eliminar.'
        });
    }

    db.query('DELETE FROM ClientePlan WHERE id = ?', [planId], (err) => {
        if (err) {
            console.error('Error al eliminar el plan:', err);
            return res.render('mensaje', {
                tituloPagina: 'Error',
                mensajePagina: 'Hubo un error al eliminar el plan. Inténtalo de nuevo.',
            });
        }

        res.redirect('/ClientePlan');
    });
};
