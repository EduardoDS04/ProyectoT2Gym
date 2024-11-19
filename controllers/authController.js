const bcrypt = require('bcrypt');
const db = require('../db');

// Mostrar formulario de registro
exports.registerForm = (req, res) => {
    res.render('register');
};

// Registrar un nuevo usuario
exports.register = (req, res) => {
    const { username, password, tipo } = req.body;
    if (!username || !password) {
        return res.render('mensaje', {
            tituloPagina: 'Registro',
            mensajePagina: 'El nombre de usuario y la contraseña son obligatorios.'
        });
    }

    // Encriptar la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // por defecto CLIENTE
    const tipoUsuario = ['ADMIN', 'ENTRENADOR', 'CLIENTE'].includes(tipo) ? tipo : 'CLIENTE';

    // Insertar usuario en la base de datos
    db.query(
        'INSERT INTO users (username, password, enabled, tipo) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, 1, tipoUsuario],
        (error) => {
            if (error) {
                console.error('Error al registrar el usuario:', error);
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.render('mensaje', {
                        tituloPagina: 'Registro',
                        mensajePagina: 'El nombre de usuario ya está en uso.'
                    });
                }
                return res.render('mensaje', {
                    tituloPagina: 'Error',
                    mensajePagina: 'Error al registrar el usuario.'
                });
            }

            res.render('mensaje', {
                tituloPagina: 'Registro',
                mensajePagina: 'Usuario registrado correctamente.'
            });
        }
    );
};

// Mostrar formulario de inicio de sesión
exports.loginForm = (req, res) => {
    res.render('login');
};

// Iniciar sesión
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('mensaje', {
            tituloPagina: 'LOGIN',
            mensajePagina: 'El nombre de usuario y la contraseña son obligatorios.'
        });
    }

    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (error, rsUsuario) => {
            if (error) {
                console.error('Error en la consulta de usuario:', error);
                return res.render('mensaje', {
                    tituloPagina: 'LOGIN',
                    mensajePagina: 'Error al verificar las credenciales.'
                });
            }

            const usuario = rsUsuario[0];
            if (usuario) {
                bcrypt.compare(password, usuario.password, (err, isMatch) => {
                    if (err) {
                        console.error('Error al comparar contraseñas:', err);
                        return res.render('mensaje', {
                            tituloPagina: 'LOGIN',
                            mensajePagina: 'Error al verificar las credenciales.'
                        });
                    }

                    if (isMatch && usuario.enabled == 1) {
                        req.session.user = {
                            id: usuario.id,
                            username: usuario.username,
                            tipo: usuario.tipo
                        };
                        const tipoUsuario = usuario.tipo.toUpperCase();

                        if (tipoUsuario === 'ADMIN') {
                            res.redirect('/admin');
                        } else if (tipoUsuario === 'ENTRENADOR') {
                            res.redirect('/Entrenador'); 
                        } else if (tipoUsuario === 'CLIENTE') {
                            res.redirect('/Cliente/registro'); 
                        } else {
                            res.render('mensaje', {
                                tituloPagina: 'LOGIN',
                                mensajePagina: 'Rol de usuario desconocido.'
                            });
                        }
                    } else {
                        res.render('mensaje', {
                            tituloPagina: 'LOGIN',
                            mensajePagina: 'Credenciales inválidas o usuario desactivado.'
                        });
                    }
                });
            } else {
                res.render('mensaje', {
                    tituloPagina: 'LOGIN',
                    mensajePagina: 'Usuario no encontrado.'
                });
            }
        }
    );
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.render('mensaje', {
                tituloPagina: 'Error',
                mensajePagina: 'Error al cerrar sesión. Inténtelo de nuevo.'
            });
        }
        res.redirect('/auth/login');
    });
};
