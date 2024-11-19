const db = require('../db');

// Método para listar planes de membresía
exports.listarPlanes = (req, res) => {
    db.query('SELECT * FROM Plan_Membresia', (err, planes) => {
        if (err) {
            console.error('Error al listar planes de membresía:', err);
            return res.status(500).send('Error al listar planes.');
        }
        res.render('Plan_Membresia/lista', { planes, user: req.session.user });
    });
};

// Asignar un plan a un cliente
exports.asignarPlan = (req, res) => {
    const { id_Plan } = req.params;
    const id_Cliente = req.session.user.id_Cliente;
    const fechaInicio = new Date();

    // Iniciar una transacción para eliminar el plan anterior y asignar el nuevo plan
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error iniciando transacción:', err);
            return res.status(500).send('Error al asignar el plan.');
        }

        // Eliminar planes anteriores
        db.query(
            'DELETE FROM ClientePlan WHERE id_Cliente = ?',
            [id_Cliente],
            (err) => {
                if (err) {
                    console.error('Error al eliminar plan anterior:', err);
                    return db.rollback(() => {
                        res.status(500).send('Error al eliminar el plan anterior.');
                    });
                }

                // Asignar el nuevo plan
                db.query(
                    'INSERT INTO ClientePlan (id_Cliente, id_Plan, Fecha_Inicio) VALUES (?, ?, ?)',
                    [id_Cliente, id_Plan, fechaInicio],
                    (err) => {
                        if (err) {
                            console.error('Error al asignar el nuevo plan:', err);
                            return db.rollback(() => {
                                res.status(500).send('Error al asignar el nuevo plan.');
                            });
                        }

                        // Confirmar la transacción
                        db.commit((err) => {
                            if (err) {
                                console.error('Error al confirmar transacción:', err);
                                return db.rollback(() => {
                                    res.status(500).send('Error al asignar el plan.');
                                });
                            }

                            res.redirect('/ClientePlan');
                        });
                    }
                );
            }
        );
    });
};
