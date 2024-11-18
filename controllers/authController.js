const bcrypt = require('bcrypt');
const db = require('../db');

exports.registerForm = (req, res) => {
    res.render('register');
};

exports.register = (req, res) => {
    const datosUsuario = req.body;
    datosUsuario.password = bcrypt.hashSync(datosUsuario.password, 10);

    // Si el tipo no es proporcionado, por defecto será 'CLIENTE'
    const tipoUsuario = datosUsuario.tipo || 'CLIENTE';

    try {
        // Guardamos el usuario en la BBDD SIN ACTIVAR
        db.query(
            'INSERT INTO users (username, password, enabled, tipo) VALUES (?,?,?,?)',
            [datosUsuario.username, datosUsuario.password, 1, tipoUsuario],
            (error, respuesta) => {
                if (error) {
                    res.send('ERROR INSERTANDO usuario: ' + error);
                } else {
                    res.render('mensaje', {
                        tituloPagina: 'Registro usuarios',
                        mensajePagina: 'Usuario registrado correctamente.'
                    });
                }
            }
        );
    } catch (error) {
        res.render('mensaje', { tituloPagina: 'ERROR', mensajePagina: 'Error ' + error });
    }
};

exports.loginForm = (req, res) => {
    res.render('login');
};

// Iniciar sesión
exports.login = (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username=?',
        [username],
        (error, rsUsuario) => {
            if (error) {
                console.error('Error en la consulta de usuario:', error);
                res.render('mensaje', { 
                    tituloPagina: 'LOGIN', 
                    mensajePagina: 'Error al verificar las credenciales. Inténtelo más tarde.' 
                });
            } else {
                const usuario = rsUsuario[0];
                if (usuario) {
                    if (usuario.enabled == 1 && bcrypt.compareSync(password, usuario.password)) {
                        req.session.user = usuario.username;

                        // Verificar el tipo de usuario y redirigir
                        const tipoUsuario = usuario.tipo ? usuario.tipo.toUpperCase() : ''; // Convertir a mayúsculas para asegurar coincidencia

                        if (tipoUsuario === 'ADMIN') {
                            // Redirigir al panel de administrador
                            res.redirect('/admin/dashboard');  // Asegúrate de tener esta ruta definida
                        } else if (tipoUsuario === 'ENTRENADOR') {
                            // Redirigir a las vistas dentro de la carpeta 'Entrenador'
                            res.redirect('/Entrenador/add'); // Asegúrate de que esta ruta esté bien definida
                        } else if (tipoUsuario === 'CLIENTE') {
                            // Redirigir a las vistas dentro de la carpeta 'Cliente'
                            res.redirect('Cliente/add');  // Asegúrate de que esta ruta esté bien definida
                        } else {
                            res.render('mensaje', { 
                                tituloPagina: 'LOGIN', 
                                mensajePagina: 'Rol de usuario desconocido.' 
                            });
                        }
                    } else {
                        res.render('mensaje', { 
                            tituloPagina: 'LOGIN', 
                            mensajePagina: 'Usuario desactivado o credenciales inválidas' 
                        });
                    }
                } else {
                    res.render('mensaje', { 
                        tituloPagina: 'LOGIN', 
                        mensajePagina: 'Usuario no encontrado o credenciales incorrectas' 
                    });
                }
            }
        }
    );
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login'); // Asegúrate de tener esta ruta de login definida
};