const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
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
	},
	estado: {
		type: Boolean,
	},
});

const ClienteSchema = new Schema({
	nombre: { type: String },
	telefono: { type: String },
	direccion: { type: String },
	municipio: { type: String },
	reparto: { type: String },
	nota: { type: String },
});

const VentaSchema = new Schema({
	productos: {
		type: [ProductoSchema],
		required: true,
	},
	totalProductos: {
		type: Number,
		required: true,
	},
	precioTotal: {
		type: Number,
		required: true,
	},
	fecha: {
		type: Date,
		required: true,
		default: Date.now,
	},
	cliente: ClienteSchema,
	tipoPago: {
		type: String,
		enum: ['online', 'presencial', 'dependiente'],
		required: true,
	},
});

VentaSchema.methods.toJSON = function () {
	const { __v, _id, ...venta } = this.toObject();
	venta.uid = _id;
	return venta;
};

module.exports = model('Venta', VentaSchema);
