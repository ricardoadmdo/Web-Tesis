import { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from '../reutilizable-tablaCrud/Pagination.jsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AnimatedNumber from '../ui/AnimatedNumber.jsx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import useExchangeRates from '../../hooks/useExchangeRates.js';

const fetchProductos = async ({ page, searchTerm }) => {
	const response = await Axios.get(`http://localhost:3001/api/product?page=${page}&search=${searchTerm}`);
	return response.data;
};

const fetchCafeteriaProductos = async ({ page, searchTerm }) => {
	const response = await Axios.get(`http://localhost:3001/api/cafeteria?page=${page}&search=${searchTerm}`);
	return response.data;
};

const CRUDVentas = () => {
	const { usdRate } = useExchangeRates();
	const [formState, setFormState] = useState(() => {
		const savedFormState = localStorage.getItem('formState');
		return savedFormState
			? JSON.parse(savedFormState)
			: {
					productos: [],
					totalProductos: 0,
					precioTotal: 0,
					fecha: new Date(),
					tipoPago: 'dependiente',
			  };
	});

	useEffect(() => {
		localStorage.setItem('formState', JSON.stringify(formState));
	}, [formState]);

	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

	const queryClient = useQueryClient();
	const refetchProductos = () => {
		queryClient.invalidateQueries(['productos']);
	};

	const {
		data: productosData,
		isLoading: isLoadingProductos,
		isError: isErrorProductos,
		error: errorProductos,
	} = useQuery({
		queryKey: ['productos', { page: currentPage, searchTerm: debouncedSearchTerm }],
		queryFn: () => fetchProductos({ page: currentPage, searchTerm: debouncedSearchTerm }),
		keepPreviousData: true,
	});

	const {
		data: cafeteriaData,
		isLoading: isLoadingCafeteria,
		isError: isErrorCafeteria,
		error: errorCafeteria,
	} = useQuery({
		queryKey: ['cafeteria', { page: currentPage, searchTerm: debouncedSearchTerm }],
		queryFn: () => fetchCafeteriaProductos({ page: currentPage, searchTerm: debouncedSearchTerm }),
		keepPreviousData: true,
	});

	const productos = productosData?.productos || [];
	const cafeteriaProductos = cafeteriaData?.productos || [];
	const allProductos = [...productos, ...cafeteriaProductos];

	const ventaMutation = useMutation({
		mutationFn: (newVenta) => Axios.post('http://localhost:3001/api/venta', newVenta),
		onSuccess: () => {
			refetchProductos();
			limpiarCampos();
			Swal.fire({
				title: '<strong>Venta registrada con éxito!</strong>',
				html: '<i>La venta fue registrada exitosamente</i>',
				icon: 'success',
				timer: 3000,
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Error al registrar la venta',
				text: error.response?.data?.error || 'Error desconocido al registrar la venta',
			});
		},
	});

	const handleSearchChange = (e) => setSearchTerm(e.target.value);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setDebouncedSearchTerm(searchTerm);
		setCurrentPage(1);
	};

	const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

	const handleNextPage = () => currentPage < (productosData?.totalPages || 0) && setCurrentPage((prev) => prev + 1);

	const limpiarCampos = () => {
		setFormState({
			productos: [],
			totalProductos: 0,
			precioTotal: 0,
			fecha: new Date(),
		});
	};

	const openModal = (producto) => {
		Swal.fire({
			title: 'Ingrese la cantidad',
			input: 'number',
			inputAttributes: {
				min: 1,
				autocapitalize: 'off',
			},
			inputValue: '1',
			showCancelButton: true,
			confirmButtonText: 'Agregar',
			showLoaderOnConfirm: true,
			preConfirm: (cantidad) => {
				if (!cantidad || cantidad < 1) {
					Swal.showValidationMessage('Debe ingresar una cantidad válida');
					return false;
				}
				agregarProducto(producto, parseInt(cantidad));
			},
			allowOutsideClick: () => !Swal.isLoading(),
		});
	};

	const agregarProducto = (producto, cantidad) => {
		setFormState((prevState) => {
			const nuevosProductos = [...prevState.productos];
			const index = nuevosProductos.findIndex((p) => p.uid === producto.uid);

			if (index !== -1) {
				nuevosProductos[index].cantidad += cantidad;
			} else {
				nuevosProductos.push({ ...producto, cantidad });
			}

			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const eliminarProducto = (productoId) => {
		setFormState((prevState) => {
			const nuevosProductos = prevState.productos.filter((p) => p.uid !== productoId);
			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const aumentarCantidad = (productoId) => {
		setFormState((prevState) => {
			const nuevosProductos = prevState.productos.map((p) => (p.uid === productoId ? { ...p, cantidad: p.cantidad + 1 } : p));

			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const disminuirCantidad = (productoId) => {
		setFormState((prevState) => {
			const nuevosProductos = prevState.productos.map((p) => (p.uid === productoId ? { ...p, cantidad: p.cantidad - 1 } : p));

			const totalProductos = nuevosProductos.reduce((acc, p) => acc + p.cantidad, 0);
			const precioTotal = nuevosProductos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

			return {
				...prevState,
				productos: nuevosProductos,
				totalProductos,
				precioTotal,
			};
		});
	};

	const validar = (event) => {
		event.preventDefault();
		const { productos } = formState;

		if (productos.length === 0) {
			Swal.fire({
				icon: 'error',
				title: 'No hay productos',
				text: 'Debe agregar al menos un producto a la venta',
			});
			return;
		}

		// Asegurarse de que cada producto tenga los campos requeridos
		const productosValidados = productos.map((producto) => ({
			...producto,
			minimoEnAlmacen: producto.minimoEnAlmacen || 0,
			minimoEnTienda: producto.minimoEnTienda || 0,
			precioCosto: producto.precioCosto || 0,
			// Asegúrate de agregar todos los campos necesarios según tu modelo
		}));

		ventaMutation.mutate({
			productos: productosValidados,
			totalProductos: formState.totalProductos,
			precioTotal: formState.precioTotal,
			fecha: new Date(),
			tipoPago: 'dependiente', // Asegurando que tipoPago siempre se envía como 'dependiente'
		});
	};

	return (
		<div className='container mt-4 my-5 animate__animated animate__fadeIn'>
			<h2 className='text-center mb-4'>Registrar Ventas</h2>
			<h3 className='text-center mb-4'>Día de Hoy: {new Date().toLocaleDateString()}</h3>
			<form onSubmit={handleSearchSubmit} className='mb-4'>
				<div className='input-group'>
					<input type='text' className='form-control' placeholder='Buscar producto' value={searchTerm} onChange={handleSearchChange} />
					<button className='btn' style={{ backgroundColor: '#7066e0', color: 'white' }} type='submit'>
						Buscar
					</button>
				</div>
			</form>
			{isLoadingProductos || isLoadingCafeteria ? (
				<LoadingSpinner />
			) : isErrorProductos || isErrorCafeteria ? (
				<div className='alert alert-danger'>Error: {errorProductos?.message || errorCafeteria?.message}</div>
			) : (
				<>
					<div className='text-center mb-4'>
						<div className='row'>
							{allProductos.map((producto) => (
								<div key={producto.uid} className='col-sm-6 col-md-4 col-lg-3 mb-3'>
									<div className='card h-100 shadow-sm'>
										<LazyLoadImage
											threshold={10}
											effect='blur'
											src={producto.url}
											className='card-img-top img-fluid'
											alt={`Imagen del producto: ${producto.nombre}`}
											style={{ objectFit: 'contain', height: '200px' }}
										/>
										<div className='card-header'>
											<h5 className='card-title'>{producto.nombre}</h5>
										</div>
										<div className='card-body'>
											<div className='d-flex justify-content-between'>
												<p className='card-text mb-0'>
													<strong>${producto.precio} CUP</strong>
												</p>
												<p className='card-text mb-0'>
													<strong>${usdRate ? (producto.precio / usdRate).toFixed(2) : 'N/A'} USD</strong>
												</p>
											</div>
											<hr />
											<button
												className='btn btn-success w-100'
												onClick={() => openModal(producto)}
												aria-label={`Agregar ${producto.nombre}`}
											>
												Agregar
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='25px'
													height='25px'
													viewBox='0 0 24 24'
													fill='currentColor'
													className='ml-2'
												>
													<path d='M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4zm1 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8' />
												</svg>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<Pagination
						currentPage={currentPage}
						totalPages={productosData?.totalPages || 0}
						handlePreviousPage={handlePreviousPage}
						handleNextPage={handleNextPage}
					/>
				</>
			)}
			<div className='mt-5'>
				<h4>Productos en la venta</h4>
				<ul className='list-group'>
					<div className='mt-3 text-center'>
						<div>
							Total de productos:{' '}
							<strong className='animated-number-container me-1'>
								<AnimatedNumber value={formState.totalProductos} />
							</strong>
						</div>
						<div>
							Precio total: <strong>$</strong>
							<strong className='animated-number-container me-1'>
								<AnimatedNumber value={formState.precioTotal} />
							</strong>
							<strong>CUP</strong>
						</div>
						<div>
							Precio total en USD: <strong>$</strong>
							{usdRate ? (
								<strong className='animated-number-container me-1'>
									<AnimatedNumber value={(formState.precioTotal / usdRate).toFixed(2)} />
								</strong>
							) : (
								'N/A'
							)}{' '}
							<strong>USD</strong>
						</div>
					</div>

					{formState.productos.map((producto) => (
						<li key={producto.uid} className='list-group-item d-flex justify-content-between align-items-center'>
							<div>
								<span className='badge bg-success rounded-pill'>{producto.cantidad}</span> {producto.nombre} - ${producto.precio}
							</div>
							<div>
								<button className='btn btn-secondary me-1' onClick={() => aumentarCantidad(producto.uid)}>
									<FontAwesomeIcon icon={faPlus} />
								</button>

								<button
									className='btn btn-danger'
									onClick={() => {
										if (producto.cantidad <= 1) {
											eliminarProducto(producto.uid);
										} else {
											disminuirCantidad(producto.uid);
										}
									}}
								>
									{producto.cantidad <= 1 ? <FontAwesomeIcon icon={faTrashAlt} /> : <FontAwesomeIcon icon={faMinus} />}
								</button>
							</div>
						</li>
					))}
				</ul>

				<div className='mt-4 d-flex justify-content-end'>
					<button className='btn btn-secondary ml-2 me-1' onClick={limpiarCampos}>
						Limpiar
					</button>
					<button className='btn btn-success' onClick={validar}>
						Registrar Venta
					</button>
				</div>
			</div>
		</div>
	);
};

export default CRUDVentas;
