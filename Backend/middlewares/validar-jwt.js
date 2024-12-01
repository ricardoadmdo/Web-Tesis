const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res = response, next) => {
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			ok: false,
			msg: 'No hay token en la petición',
		});
	}
	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
		const usuario = await Usuario.findById(uid);
		req.usuario = usuario;

		if (!usuario) {
			res.status(401).json({
				msg: 'Token no valido - usuario no existe',
			});
		}
		if (!usuario.estado) {
			res.status(401).json({
				msg: 'Token no valido - usuario estado false',
			});
		}
	} catch (error) {
		return res.status(401).json({
			ok: false,
			msg: 'Token no valido',
		});
	}

	next();
};

module.exports = {
	validarJWT,
};
