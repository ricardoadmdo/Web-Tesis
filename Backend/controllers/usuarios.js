const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
	const { limit = 8, page = 1 } = req.query; // Valores por defecto: 8 combos por página y página 1
	const skip = (page - 1) * limit;

	try {
		const [usuarios, total] = await Promise.all([
			Usuario.find().populate('nombre').skip(Number(skip)).limit(Number(limit)),
			Usuario.countDocuments(),
		]);

		res.json({
			total,
			usuarios,
			page: Number(page),
			limit: Number(limit),
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error al obtener combos',
			error,
		});
	}
};

const usuariosBuscar = async (req = request, res = response) => {
	const { query } = req.query;

	if (!query) {
		return res.status(400).json({
			msg: 'Debe proporcionar un término de búsqueda',
		});
	}

	try {
		const usuarios = await Usuario.find({
			nombre: { $regex: query, $options: 'i' },
		}).populate('nombre');

		res.json({
			total: usuarios.length,
			usuarios,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error al buscar usuarios',
			error,
		});
	}
};

const usuariosPost = async (req, res) => {
	try {
		const { nombre, password, correo, rol } = req.body;
		const usuario = new Usuario({ nombre, password, correo, rol, estado: true });
		//Encriptar el password
		const salt = bcryptjs.genSaltSync();
		usuario.password = bcryptjs.hashSync(password, salt);

		//Guardar en BDb
		await usuario.save();

		res.json({
			usuario,
		});
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({
				msg: error,
				msg: 'Error Code =' + error.code,
			});
		}
	}
};

const usuariosPut = async (req, res) => {
	const { id } = req.params;
	const { nombre, correo, password, rol, estado } = req.body;

	try {
		// Verificar si el usuario existe
		const usuarioExistente = await Usuario.findById(id);
		if (!usuarioExistente) {
			return res.status(404).json({ msg: 'Usuario no encontrado' });
		}

		// Validaciones de datos de entrada
		if (nombre && typeof nombre !== 'string') {
			return res.status(400).json({ msg: 'El nombre debe ser una cadena de texto' });
		}

		if (correo && !validateEmail(correo)) {
			return res.status(400).json({ msg: 'El correo electrónico no es válido' });
		}

		// Prevenir cambios en el rol de un administrador, si se desea
		if (usuarioExistente.rol === 'ADMIN_ROLE' && rol && rol !== 'ADMIN_ROLE') {
			return res.status(403).json({ msg: 'No se puede cambiar el rol de un administrador' });
		}

		// Crear el objeto de datos para actualizar
		const dataToUpdate = {
			...(nombre && { nombre }),
			...(correo && { correo }),
			...(password && { password: hashPassword(password) }), // Asegúrate de hashear la contraseña
			...(rol && { rol }),
			...(typeof estado !== 'undefined' && { estado }),
		};

		// Actualizar el usuario
		const usuarioActualizado = await Usuario.findByIdAndUpdate(id, dataToUpdate, { new: true });

		res.json(usuarioActualizado);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// Función para validar correo electrónico
const validateEmail = (email) => {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(String(email).toLowerCase());
};

// Función para hashear la contraseña
const hashPassword = (password) => {
	// Usa una biblioteca como bcrypt para hashear la contraseña
	const bcrypt = require('bcrypt');
	const saltRounds = 10;
	return bcrypt.hashSync(password, saltRounds);
};

const usuariosDelete = async (req, res) => {
	try {
		const { id } = req.params;

		// Primero, intenta encontrar el usuario con el estado en true
		const usuario = await Usuario.findOne({ _id: id, estado: true });

		if (!usuario) {
			return res.status(404).json({ msg: 'Usuario no encontrado o ya fue eliminado' });
		}

		// Verificar si el usuario tiene el rol "ADMIN_ROLE"
		if (usuario.rol === 'ADMIN_ROLE') {
			return res.status(403).json({ msg: 'No se puede eliminar un usuario con rol ADMIN_ROLE' });
		}

		const usuarioEliminado = await Usuario.findByIdAndDelete(id);

		// Enviar respuesta con los detalles del usuario eliminado
		return res.json({ msg: 'Usuario eliminado', usuario: usuarioEliminado });
	} catch (error) {
		// Manejar errores y enviar una respuesta con el error
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports = {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosBuscar,
};
