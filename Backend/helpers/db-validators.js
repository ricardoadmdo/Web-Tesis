const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Combo = require('../models/combo');
const Cafeteria = require('../models/cafeteria');

const esRoleValido = async (rol = '') => {
	if (rol === '') {
		rol = 'USER_ROLE';
	}
	const existeRol = await Role.findOne({ rol });
	if (!existeRol) {
		throw new Error(`El rol ${rol} no está registrado en la BD`);
	}
};

const emailExiste = async (correo = '') => {
	const existeEmail = await Usuario.findOne({ correo });
	if (existeEmail) {
		throw new Error(`El correo: ${correo}, ya está registrado en la BD`);
	}
};

const existeUsuarioPorId = async (id) => {
	const existeUsuario = await Usuario.findById(id);
	if (!existeUsuario) {
		throw new Error(`El id no existe: ${id}`);
	}
};
const existeProductoPorId = async (id) => {
	const existeProducto = await Producto.findById(id);
	if (!existeProducto) {
		throw new Error(`El producto con ese id no existe id: ${id}`);
	}
};
const existeComboPorId = async (id) => {
	const existeCombo = await Combo.findById(id);
	if (!existeCombo) {
		throw new Error(`El combo con ese id no existe id: ${id}`);
	}
};
const existeCafeteriaPorId = async (id) => {
	const existeProducto = await Cafeteria.findById(id);
	if (!existeProducto) {
		throw new Error(`El producto con ese id no existe en la cafeteria id: ${id}`);
	}
};

module.exports = {
	esRoleValido,
	emailExiste,
	existeUsuarioPorId,
	existeProductoPorId,
	existeComboPorId,
	existeCafeteriaPorId,
};
