const jwt = require('jsonwebtoken');

const validarJWT = (token = '') => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.SECRETORPRIVATEKEY, (err, decoded) => {
			if (err) {
				console.log(err);
				reject('Token no válido');
			} else {
				resolve(decoded);
			}
		});
	});
};

module.exports = {
	validarJWT,
};
