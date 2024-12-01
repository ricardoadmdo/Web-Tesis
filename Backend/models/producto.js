const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
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

ProductoSchema.methods.toJSON = function () {
	const { __v, _id, ...producto } = this.toObject();
	producto.uid = _id;
	return producto;
};

module.exports = model('Producto', ProductoSchema);
