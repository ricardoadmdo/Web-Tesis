const { response } = require('express');

const tieneRole = (...roles) => {
	return (req, res = response, next) => {
		if (!roles.includes(req.usuario.rol)) {
			return res.status(401).json({
				msg: `El servicio requiere uno de estos roles ${roles}`,
			});
		}
		next();
	};
};

module.exports = {
	tieneRole,
};
