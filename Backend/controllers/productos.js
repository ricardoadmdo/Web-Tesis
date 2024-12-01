const { response, request } = require('express');
const Producto = require('../models/producto');

const productosGet = async (req, res) => {
	try {
		// Obtener los parámetros de la consulta con valores por defecto
		const { limit = 8, page = 1, search } = req.query;
		const skip = (page - 1) * limit;

		// Construir la consulta base
		const query = { estado: true };
		if (search) {
			// Añadir criterio de búsqueda si se proporciona
			query.nombre = { $regex: search, $options: 'i' };
		}

		// Ejecutar las consultas en paralelo
		const [productos, total] = await Promise.all([Producto.find(query).skip(Number(skip)).limit(Number(limit)), Producto.countDocuments(query)]);

		// Enviar la respuesta
		res.json({
			total,
			productos,
			page: Number(page),
			limit: Number(limit),
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		if (error.name === 'MongoNetworkError') {
			res.status(503).json({ msg: 'Base de datos no disponible. Inténtelo de nuevo más tarde.' });
		} else {
			console.error(error);
			res.status(500).json({ msg: 'Error al obtener los productos' });
		}
	}
};

const productosBuscar = async (req = request, res = response) => {
	const { query } = req.query;

	if (!query) {
		return res.status(400).json({
			msg: 'Debe proporcionar un término de búsqueda',
		});
	}

	try {
		const productos = await Producto.find({
			nombre: { $regex: query, $options: 'i' },
			estado: true,
		}).populate('nombre');

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

const productosPut = async (req, res) => {
	const { ...resto } = req.body;
	const { id } = req.params;

	const producto = await Producto.findByIdAndUpdate(id, resto);

	res.json(producto);
};

const productosPost = async (req, res) => {
	const { nombre, cantidad, cantidadTienda, precio, url, precioCosto, minimoEnTienda, minimoEnAlmacen } = req.body;
	const producto = new Producto({ nombre, cantidad, cantidadTienda, precio, url, precioCosto, minimoEnTienda, minimoEnAlmacen, estado: true });

	//Guardar en BD
	await producto.save();

	res.json({
		producto,
	});
};

const productoDelete = async (req, res) => {
	const { id } = req.params;

	// Primero, intenta encontrar el producto con el estado en true
	const producto = await Producto.findOne({ _id: id, estado: true });

	// Si el producto con estado true no se encuentra, enviar un mensaje de error
	if (!producto) {
		return res.status(404).json({ msg: 'Producto no encontrado o ya fue eliminado' });
	}

	// Si el producto existe y su estado es true, entonces cambia el estado a false
	const productoEliminado = await Producto.findByIdAndUpdate(id, { estado: false });

	res.json({ msg: 'Producto eliminado: ', producto: productoEliminado });
};

module.exports = {
	productosGet,
	productosPut,
	productosPost,
	productoDelete,
	productosBuscar,
};
