const { Schema, model } = require('mongoose');

const CafeteriaSchema = Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	cantidadTienda: {
		type: Number,
		required: true,
	},
	cantidad: {
		type: Number,
		required: true,
	},
	precio: {
		type: Number,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	estado: {
		type: Boolean,
		default: true,
	},
	categoria: {
		type: String,
		required: true,
	},
	precioCosto: {
		type: Number,
		required: true,
	},
	minimoEnTienda: {
		type: Number,
		required: true,
	},
	minimoEnAlmacen: {
		type: Number,
		required: true,
	},
});

CafeteriaSchema.methods.toJSON = function () {
	const { __v, _id, ...cafeteria } = this.toObject();
	cafeteria.uid = _id;
	return cafeteria;
};

module.exports = model('Cafeteria', CafeteriaSchema);
