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
        'SELECT * FROM users WHERE username = ?',
        [username],
        (error, results) => {
            if (error) {
                console.error('Error en la consulta de usuario:', error);
                return res.render('mensaje', { 
                    tituloPagina: 'LOGIN', 
                    mensajePagina: `Error al verificar las credenciales. Inténtelo más tarde. Detalles: ${error.message}` 
                });
            }

            if (results.length === 0) {
                return res.render('mensaje', { 
                    tituloPagina: 'LOGIN', 
                    mensajePagina: 'Usuario no encontrado' 
                });
            }

            const usuario = results[0];
            console.log('Usuario encontrado:', usuario); // Log para depuración

            if (usuario.enabled == 1) {
                console.log('Contraseña proporcionada:', password); // Log de la contraseña proporcionada
                console.log('Contraseña almacenada en la base de datos:', usuario.password); // Log de la contraseña cifrada en la base de datos

                if (bcrypt.compareSync(password, usuario.password)) {
                    req.session.user = usuario.username;
                    console.log('Login exitoso para el usuario:', usuario.username); // Log para depuración
                    return res.redirect('/'); // Redirige a la página de inicio después del login
                } else {
                    console.log('Contraseña incorrecta para el usuario:', usuario.username); // Log para depuración
                    return res.render('mensaje', { 
                        tituloPagina: 'LOGIN', 
                        mensajePagina: 'Credenciales inválidas' 
                    });
                }
            } else {
                console.log('Usuario desactivado:', usuario.username); // Log para depuración
                return res.render('mensaje', { 
                    tituloPagina: 'LOGIN', 
                    mensajePagina: 'Usuario desactivado' 
                });
            }
        }
    );
};



exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login'); // Asegúrate de tener esta ruta de login definida
};