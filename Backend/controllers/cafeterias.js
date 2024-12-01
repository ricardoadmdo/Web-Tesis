const { response, request } = require('express');
const Cafeteria = require('../models/cafeteria');

const cafeteriaGet = async (req, res) => {
	const { limit = 8, page = 1, search } = req.query;
	const skip = (page - 1) * limit;

	const query = { estado: true };
	if (search) {
		query.nombre = { $regex: search, $options: 'i' };
	}

	const [productos, total] = await Promise.all([Cafeteria.find(query).skip(Number(skip)).limit(Number(limit)), Cafeteria.countDocuments(query)]);

	res.json({
		total,
		productos,
		page: Number(page),
		limit: Number(limit),
		totalPages: Math.ceil(total / limit),
	});
};

const cafeteriaBuscar = async (req = request, res = response) => {
	const { query } = req.query;

	if (!query) {
		return res.status(400).json({
			msg: 'Debe proporcionar un término de búsqueda',
		});
	}

	try {
		const productos = await Cafeteria.find({
			nombre: { $regex: query, $options: 'i' },
			estado: true,
		});

		res.json({
			total: productos.length,
			productos,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Error al buscar productos',
			error,
		});
	}
};

const cafeteriaPut = async (req, res) => {
	const { ...resto } = req.body;
	const { id } = req.params;

	const producto = await Cafeteria.findByIdAndUpdate(id, resto);

	res.json(producto);
};

const cafeteriaPost = async (req, res) => {
	const { ...datos } = req.body;
	const producto = new Cafeteria(datos);

	await producto.save();

	res.json({
		producto,
	});
};

const cafeteriaDelete = async (req, res) => {
	const { id } = req.params;

	const producto = await Cafeteria.findOne({ _id: id, estado: true });

	if (!producto) {
		return res.status(404).json({ msg: 'Producto no encontrado o ya fue eliminado' });
	}

	const productoEliminado = await Cafeteria.findByIdAndUpdate(id, { estado: false });

	res.json({ msg: 'Producto eliminado: ', producto: productoEliminado });
};

module.exports = {
	cafeteriaGet,
	cafeteriaPut,
	cafeteriaPost,
	cafeteriaDelete,
	cafeteriaBuscar,
};
