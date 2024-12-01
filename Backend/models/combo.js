const { Schema, model } = require('mongoose');

const ComboSchema = Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	precio: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
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
	cantidad: {
		type: Number,
		required: true,
	},
});

ComboSchema.methods.toJSON = function () {
	const { __v, _id, ...combo } = this.toObject();
	combo.uid = _id;
	return combo;
};

module.exports = model('Combo', ComboSchema);
