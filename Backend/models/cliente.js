const { Schema, model } = require('mongoose');

const ClienteSchema = new Schema({
	nombre: { type: String, required: true },
	telefono: { type: String, required: true },
	direccion: { type: String, required: true },
	municipio: { type: String, required: true },
	reparto: { type: String, required: true },
	nota: { type: String },
});

ClienteSchema.methods.toJSON = function () {
	const { __v, _id, ...cliente } = this.toObject();
	cliente.uid = _id;
	return cliente;
};

module.exports = model('Cliente', ClienteSchema);
