const { response, request } = require('express');
const Combo = require('../models/combo');

const combosGet = async (req = request, res = response) => {
	const { limit = 8, page = 1 } = req.query; // Valores por defecto: 8 combos por página y página 1
	const skip = (page - 1) * limit;

	try {
		const [combos, total] = await Promise.all([
			Combo.find({ estado: true }).populate('nombre').skip(Number(skip)).limit(Number(limit)),
			Combo.countDocuments({ estado: true }),
		]);

		res.json({
			total,
			combos,
			page: Number(page),
			limit: Number(limit),
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error al obtener combos',
			error,
		});
	}
};

module.exports = {
	combosGet,
};

const combosBuscar = async (req = request, res = response) => {
	const { query } = req.query;

	if (!query) {
		return res.status(400).json({
			msg: 'Debe proporcionar un término de búsqueda',
		});
	}

	try {
		const combos = await Combo.find({
			nombre: { $regex: query, $options: 'i' },
			estado: true,
		}).populate('nombre');

		res.json({
			total: combos.length,
			combos,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error al buscar combos',
			error,
		});
	}
};

const combosPut = async (req, res) => {
	const { ...resto } = req.body;
	const { id } = req.params;

	const combo = await Combo.findByIdAndUpdate(id, resto);

	res.json(combo);
};

const combosPost = async (req, res) => {
	const { nombre, precio, description, url, cantidad } = req.body;
	const combo = new Combo({ nombre, precio, description, url, estado: true, cantidad });

	//Guardar en BD
	await combo.save();

	res.json({
		combo,
	});
};

const comboDelete = async (req, res) => {
	const { id } = req.params;

	// Primero, intenta encontrar el COMBO con el estado en true
	const combo = await Combo.findOne({ _id: id, estado: true });
	if (!combo) {
		return res.status(404).json({ msg: 'Combo no encontrado o ya fue eliminado' });
	}
	const comboEliminado = await Combo.findByIdAndUpdate(id, { estado: false });
	res.json({ msg: 'Combo eliminado: ', combo: comboEliminado });
};

module.exports = {
	combosGet,
	combosPut,
	combosPost,
	comboDelete,
	combosBuscar,
};
