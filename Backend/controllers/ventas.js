const { response, request } = require('express');
const Venta = require('../models/venta');
const Producto = require('../models/producto');
const Cafeteria = require('../models/cafeteria');

const obtenerVentas = async (req, res) => {
	try {
		const { limit = 8, page = 1, fechas } = req.query;
		const skip = (page - 1) * limit;

		let filtro = {};
		if (fechas) {
			// Convertir la cadena de fechas en un array
			const fechasArray = Array.isArray(fechas) ? fechas : fechas.split(',');

			// Crear un array para almacenar los rangos de fechas
			const rangosFechas = fechasArray.map((fecha) => {
				// Asegurarse de que la fecha esté en el formato correcto
				const fechaConsulta = new Date(`${fecha}T00:00:00Z`);
				if (isNaN(fechaConsulta)) {
					throw new Error(`Invalid date format: ${fecha}`);
				}

				const fechaFin = new Date(fechaConsulta);
				fechaFin.setUTCHours(23, 59, 59, 999);

				return {
					fecha: {
						$gte: fechaConsulta.toISOString(),
						$lt: fechaFin.toISOString(),
					},
				};
			});

			// Usar $or a nivel de la consulta principal para buscar documentos que coincidan con cualquiera de los rangos de fechas
			filtro = { $or: rangosFechas };
		}

		const [ventas, total] = await Promise.all([Venta.find(filtro).skip(Number(skip)).limit(Number(limit)), Venta.countDocuments(filtro)]);

		res.json({
			total,
			ventas,
			page: Number(page),
			limit: Number(limit),
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		console.error('Error al obtener ventas:', error.message);
		res.status(500).json({ message: `Error al obtener ventas: ${error.message}` });
	}
};

const crearVenta = async (req, res) => {
	try {
		const { productos, ...datos } = req.body;

		// Verifica que los campos requeridos estén presentes
		if (!datos || !productos || productos.length === 0) {
			return res.status(400).json({ message: 'Campos requeridos faltantes' });
		}

		// Crear un nuevo objeto Venta con los datos recibidos
		const nuevaVenta = new Venta({ ...datos, productos });

		// Guardar la nueva venta en la base de datos
		await nuevaVenta.save();

		// Actualizar cantidades de productos
		for (let producto of productos) {
			if (producto.categoria) {
				// Producto de la cafetería
				await Cafeteria.findByIdAndUpdate(producto.uid, { $inc: { cantidad: -producto.cantidad } });
			} else {
				// Producto de la tienda
				await Producto.findByIdAndUpdate(producto.uid, { $inc: { cantidad: -producto.cantidad } });
			}
		}

		res.status(201).json(nuevaVenta);
	} catch (error) {
		console.error('Error al crear venta:', error.message);
		res.status(500).json({ message: 'Error al crear venta' });
	}
};
const deleteVenta = async (req = request, res = response) => {
	const { id } = req.params;

	try {
		const ventaEliminada = await Venta.findByIdAndDelete(id);

		if (!ventaEliminada) {
			return res.status(404).json({ message: 'Venta no encontrada' });
		}

		res.status(200).json({ message: 'Venta eliminada con éxito' });
	} catch (error) {
		console.error('Error al eliminar venta:', error);
		res.status(500).json({ message: 'Error al eliminar venta' });
	}
};

module.exports = {
	obtenerVentas,
	crearVenta,
	deleteVenta,
};
