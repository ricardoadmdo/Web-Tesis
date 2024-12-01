import { useState, useEffect, lazy, Suspense } from 'react';
import Axios from 'axios';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import useExchangeRates from '../../hooks/useExchangeRates';
import ErrorComponent from '../ui/ErrorComponent';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const Pagination = lazy(() => import('../reutilizable-tablaCrud/Pagination'));
import './react-datepicker.css';
import Swal from 'sweetalert2';

const fetchVentas = async ({ queryKey }) => {
	const [, page, limit, fechas] = queryKey;
	try {
		const response = await Axios.get(
			`http://localhost:3001/api/venta?page=${page}&limit=${limit}&fechas=${fechas}`
		);

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.msg || 'Error al obtener ventas');
	}
};

const ReporteVentas = () => {
	const { usdRate } = useExchangeRates();
	const [diasSeleccionados, setDiasSeleccionados] = useState([new Date()]);
	const [currentPage, setCurrentPage] = useState(1);

	const fechasSeleccionadas = diasSeleccionados.map((date) => date.toISOString().split('T')[0]).join(',');

	const {
		data,
		isLoading,
		isError,
		refetch: refetchVentas,
	} = useQuery({
		queryKey: ['ventas', currentPage, 8, fechasSeleccionadas],
		queryFn: fetchVentas,
		keepPreviousData: true,
	});

	useEffect(() => {
		refetchVentas();
	}, [diasSeleccionados, currentPage, refetchVentas]);

	const handleSeleccionarDias = (dias) => {
		setDiasSeleccionados(dias);
		setCurrentPage(1);
	};

	const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
	const handleNextPage = () => currentPage < (data?.totalPages || 0) && setCurrentPage((prev) => prev + 1);

	const agruparVentasPorFecha = (ventas) => {
		const groupedVentas = ventas.reduce((groupedVentas, venta) => {
			const fecha = new Date(venta.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' });

			// Si la fecha no existe en el grupo, inicialízala
			if (!groupedVentas[fecha]) {
				groupedVentas[fecha] = { ventas: [], totalProductos: 0, totalDinero: 0, totalGanancia: 0 };
			}

			// Calcula la ganancia de la venta
			let gananciaVenta = 0;
			venta.productos.forEach((producto) => {
				// Validar los valores de precio y precioCosto
				const precio = producto.precio || 0;
				const precioCosto = producto.precioCosto || 0;
				const cantidad = producto.cantidad || 0;

				const gananciaProducto = (precio - precioCosto) * cantidad;
				gananciaVenta += gananciaProducto;
			});

			// Actualizar los valores en el grupo de la fecha
			groupedVentas[fecha].ventas.push(venta);
			groupedVentas[fecha].totalProductos += venta.totalProductos || 0;
			groupedVentas[fecha].totalDinero += venta.precioTotal || 0;
			groupedVentas[fecha].totalGanancia += gananciaVenta || 0;

			return groupedVentas;
		}, {});

		return groupedVentas;
	};

	const handleDeleteVenta = async (id) => {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'No podrás revertir esto',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					// Petición al backend para eliminar la venta
					await Axios.delete(`http://localhost:3001/api/venta/${id}`);
					// Actualizar la lista de ventas llamando a refetchVentas
					await refetchVentas();
					Swal.fire('¡Eliminada!', 'La venta ha sido eliminada.', 'success');
				} catch (error) {
					console.error('Error al eliminar la venta:', error);
					Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
				}
			}
		});
	};

	return (
		<div className='container animate__animated animate__fadeIn p-3 '>
			<h2 className='text-center mb-4'>Reporte de Ventas</h2>

			<div className='text-center'>
				<DatePicker selected={diasSeleccionados[0]} onChange={(date) => handleSeleccionarDias([date])} inline />
			</div>

			{isLoading ? (
				<LoadingSpinner />
			) : isError ? (
				<ErrorComponent />
			) : (
				<div className='mt-4 my-2'>
					{data?.ventas.length > 0 ? (
						Object.entries(agruparVentasPorFecha(data.ventas)).map(
							([fecha, { ventas, totalProductos, totalDinero, totalGanancia }]) => (
								<div key={fecha}>
									<br />
									<h3 className='text-center'>Ventas del {fecha}</h3>
									<div className='text-center mb-3'>
										<strong>Total de Productos Vendidos: </strong>
										{totalProductos || 0} | <strong>Total Recaudado:</strong> $
										{totalDinero?.toFixed(2) || '0.00'} CUP | <strong>Total Recaudado:</strong> $
										{totalDinero && usdRate ? (totalDinero / usdRate).toFixed(2) : '0.00'} USD |{' '}
										<strong>Ganancia Total: </strong> ${totalGanancia?.toFixed(2) || '0.00'} CUP |{' '}
										<strong>Ganancia Total:</strong> $
										{totalGanancia && usdRate ? (totalGanancia / usdRate).toFixed(2) : '0.00'} USD
									</div>
									<hr />
									<div className='table-responsive'>
										<table className='table table-striped'>
											<thead>
												<tr>
													<th>Hora</th>
													<th>Total Productos</th>
													<th>Precio Total CUP</th>
													<th>Precio Total USD</th>
													<th>Tipo de Pago</th>
													<th>Productos</th>
													<th>Cliente</th>
													<th>Acciones</th>
												</tr>
											</thead>
											<tbody>
												{ventas.map((venta) => (
													<tr key={venta.uid}>
														<td>
															{new Date(venta.fecha).toLocaleString('es-ES', {
																timeZone: 'UTC',
																hour: '2-digit',
																minute: '2-digit',
																second: '2-digit',
															})}
														</td>

														<td>{venta.totalProductos || 0}</td>
														<td>${venta.precioTotal?.toFixed(2) || '0.00'}</td>
														<td>
															$
															{venta.precioTotal && usdRate
																? (venta.precioTotal / usdRate).toFixed(2)
																: '0.00'}
														</td>
														<td>
															{venta.tipoPago === 'presencial' && (
																<span className='tipo-pago-presencial'>
																	Pago Presencial
																</span>
															)}
															{venta.tipoPago === 'online' && (
																<span className='tipo-pago-online'>
																	Pago con Tarjeta
																</span>
															)}
															{venta.tipoPago === 'dependiente' && (
																<span className='tipo-pago-en-tienda'>
																	En la Tienda
																</span>
															)}
														</td>
														<td>
															<ul className='list-group'>
																{venta.productos.map((producto) => (
																	<li key={producto._id} className='list-group-item'>
																		{producto.nombre} - {producto.cantidad} x $
																		{producto.precio?.toFixed(2) || '0.00'}
																	</li>
																))}
															</ul>
														</td>

														<td>
															{venta.cliente ? (
																<>
																	<strong>{venta.cliente.nombre}</strong>
																	<br />
																	Teléfono: {venta.cliente.telefono}
																	<br />
																	Dirección: {venta.cliente.direccion},{' '}
																	{venta.cliente.municipio},{venta.cliente.reparto}
																</>
															) : (
																'En la Tienda'
															)}
														</td>
														<td>
															<button
																className='btn btn-danger'
																onClick={() => handleDeleteVenta(venta.uid)}
															>
																Eliminar
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)
						)
					) : (
						<div className='alert alert-info text-center'>No hay ventas para mostrar.</div>
					)}
					<Suspense fallback={<LoadingSpinner />}>
						<Pagination
							currentPage={currentPage}
							totalPages={data?.totalPages}
							handlePreviousPage={handlePreviousPage}
							handleNextPage={handleNextPage}
							className='mt-4'
						/>
					</Suspense>
				</div>
			)}
		</div>
	);
};

export default ReporteVentas;
