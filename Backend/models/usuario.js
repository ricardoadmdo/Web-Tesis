const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	correo: {
		type: String,
		unique: true,
		required: [true, 'El correo es obligatorio'],
	},
	password: {
		type: String,
		required: [true, 'El password es obligatorio'],
	},
	rol: {
		type: String,
		required: true,
		emun: ['ADMIN_ROLE', 'USER_ROLE'],
	},
	estado: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
	login_code: {
		type: String,
	},
	verification_token: {
		type: String,
	},
});

UsuarioSchema.methods.toJSON = function () {
	const { __v, password, _id, ...usuario } = this.toObject();
	usuario.uid = _id;
	return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
