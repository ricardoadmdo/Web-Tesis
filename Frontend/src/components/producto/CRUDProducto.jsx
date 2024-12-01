import { lazy, useState, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TableSkeleton from '../ui/TableSkeleton.jsx';
import ErrorComponent from '../ui/ErrorComponent.jsx';
const Pagination = lazy(() => import('../reutilizable-tablaCrud/Pagination.jsx'));
const TablaCRUD = lazy(() => import('../reutilizable-tablaCrud/TablaCRUD.jsx'));

const fetchProductos = async ({ page, searchTerm }) => {
	const response = await Axios.get(`http://localhost:3001/api/product?page=${page}&search=${searchTerm}`);
	return response.data;
};

const CRUDProducto = () => {
	const [id, setId] = useState('');
	const [formState, setFormState] = useState({
		nombre: '',
		cantidad: '',
		cantidadTienda: '',
		precio: '',
		url: '',
		precioCosto: '',
		minimoEnTienda: '',
		minimoEnAlmacen: '',
	});
	const [operationMode, setOperationMode] = useState(1);
	const [title, setTitle] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const refetchProductos = () => {
		queryClient.invalidateQueries(['combos']);
	};

	const {
		data: productosData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['productos', { page: currentPage, searchTerm: debouncedSearchTerm }],
		queryFn: () => fetchProductos({ page: currentPage, searchTerm: debouncedSearchTerm }),
		keepPreviousData: true,
	});

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < (productosData?.totalPages || 0)) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};
	// Debounce logic
	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 4000); // 4 segundos de retraso
		return () => {
			clearTimeout(timerId); // Limpiar el temporizador en cada cambio de término de búsqueda
		};
	}, [searchTerm]);

	if (isLoading) {
		return <TableSkeleton />;
	}

	if (isError) {
		return <ErrorComponent />;
	}

	const productosList = productosData?.productos || [];
	const totalPages = productosData?.totalPages || 0;

	const limpiarCampos = () => {
		setFormState({
			nombre: '',
			cantidad: '',
			cantidadTienda: '',
			precio: '',
			url: '',
			precioCosto: '',
			minimoEnTienda: '',
			minimoEnAlmacen: '',
		});
	};

	const addProductos = () => {
		Axios.post('http://localhost:3001/api/product', formState)
			.then(() => {
				refetchProductos();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Registro exitoso!!!</strong>',
					html: '<i>El producto <strong>' + formState.nombre + '</strong> fue registrado con éxito</i>',
					icon: 'success',
					timer: 3000,
				});
			})
			.catch(function (error) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text:
						JSON.parse(JSON.stringify(error)).message === 'Network Error'
							? 'Intente mas tarde'
							: JSON.parse(JSON.stringify(error)).message,
				});
			});
	};

	const updateProductos = () => {
		Axios.put(`http://localhost:3001/api/product/${id}`, formState)
			.then(() => {
				refetchProductos();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Actualización exitoso!!!</strong>',
					html: '<i>El producto <strong>' + formState.nombre + '</strong> fue actualizado con éxito</i>',
					icon: 'success',
					timer: 3000,
				});
			})
			.catch(function (error) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text:
						JSON.parse(JSON.stringify(error)).message === 'Network Error'
							? 'Intente mas tarde'
							: JSON.parse(JSON.stringify(error)).message,
				});
			});
	};

	const deleteProductos = (val) => {
		Swal.fire({
			title: 'Confirmar eliminado?',
			html: '<i>Realmente desea eliminar a <strong>' + val.nombre + '</strong>?</i>',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminarlo!',
		}).then((result) => {
			if (result.isConfirmed) {
				Axios.delete(`http://localhost:3001/api/product/${val.uid}`)
					.then(() => {
						refetchProductos();
						limpiarCampos();
						Swal.fire({
							icon: 'success',
							title: 'El producto ' + val.nombre + ' fue eliminado.',
							showConfirmButton: false,
							timer: 2000,
						});
					})
					.catch(function (error) {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'No se logro eliminar el producto!',
							footer:
								JSON.parse(JSON.stringify(error)).message === 'Network Error'
									? 'Intente mas tarde'
									: JSON.parse(JSON.stringify(error)).message,
						});
					});
			}
		});
	};

	const validar = (event) => {
		event.preventDefault();
		const { nombre, cantidad, precio, url, cantidadTienda, precioCosto, minimoEnTienda, minimoEnAlmacen } = formState;
		if (
			nombre.trim() === '' ||
			cantidad === 0 ||
			precio === 0 ||
			url.trim() === '' ||
			cantidadTienda === 0 ||
			precioCosto === 0 ||
			minimoEnTienda === 0 ||
			minimoEnAlmacen === 0
		) {
			Swal.fire({
				icon: 'error',
				title: 'Campos Vacíos',
				text: 'Todos los campos son obligatorios',
			});
		} else {
			if (operationMode === 1) {
				addProductos();
			}

			if (operationMode === 2) {
				updateProductos();
			}

			document.getElementById('btnCerrar').click();
			refetchProductos();
		}
	};

	const openModal = (op, producto) => {
		setFormState({
			nombre: op === 2 ? producto.nombre : '',
			cantidad: op === 2 ? producto.cantidad : '',
			cantidadTienda: op === 2 ? producto.cantidadTienda : '',
			precio: op === 2 ? producto.precio : '',
			url: op === 2 ? producto.url : '',
			precioCosto: op === 2 ? producto.precioCosto : '',
			minimoEnTienda: op === 2 ? producto.minimoEnTienda : '',
			minimoEnAlmacen: op === 2 ? producto.minimoEnAlmacen : '',
		});
		setOperationMode(op);
		setTitle(op === 1 ? 'Registrar Producto' : 'Editar Producto');

		// Si es modo de edición, establece el ID
		if (op === 2) {
			setId(producto.uid);
		} else {
			setId('');
		}

		// Enfoca el primer campo del formulario después de un breve retraso
		window.setTimeout(() => {
			document.getElementById('nombre').focus();
		}, 500);
	};

	const handleSearchChange = (e) => setSearchTerm(e.target.value);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/dashboard/buscarproductos?query=${searchTerm}`);
	};

	return (
		<>
			<Suspense fallback={<TableSkeleton />}>
				<TablaCRUD
					searchTerm={searchTerm}
					handleSearchChange={handleSearchChange}
					handleSearchSubmit={handleSearchSubmit}
					titleBuscar={'Buscar producto...'}
					busqueda={true}
					data={productosList}
					onAdd={() => openModal(1)}
					columns={[
						{ header: 'Nombre', accessor: 'nombre' },
						{ header: 'Cantidad en Tienda', accessor: 'cantidad' },
						{ header: 'Cantidad en Almacén', accessor: 'cantidadTienda' },
						{ header: 'Precio de Costo', accessor: 'precioCosto' },
						{ header: 'Precio en CUP', accessor: 'precio' },
						{ header: 'Precio en USD', accessor: 'usd' },
						{ header: 'Minimo en la Tienda', accessor: 'minimoEnTienda' },
						{ header: 'Minimo en el Almacen', accessor: 'minimoEnAlmacen' },
					]}
					onEdit={(producto) => openModal(2, producto)}
					onDelete={deleteProductos}
					title={title}
					modalTitle='Añadir nuevo Producto'
					validate={validar}
					operationMode={operationMode}
					setOperationMode={setOperationMode}
					formFields={[
						{ name: 'nombre', label: 'Nombre', placeholder: 'Ingrese un nombre', type: 'text' },
						{ name: 'cantidad', label: 'Cantidad en Tienda', placeholder: 'Ingrese la cantidad', type: 'number' },
						{ name: 'cantidadTienda', label: 'Cantidad en Almacén', placeholder: 'Ingrese la cantidad', type: 'number' },
						{ name: 'precioCosto', label: 'Precio de Costo', placeholder: 'Ingrese un precio de costo', type: 'number' },
						{ name: 'precio', label: 'Precio', placeholder: 'Ingrese un precio', type: 'number' },
						{ name: 'minimoEnTienda', label: 'Minimo en la Tienda ', placeholder: 'Ingrese un minimo en Tienda', type: 'number' },
						{ name: 'minimoEnAlmacen', label: 'Minimo en el Almacen', placeholder: 'Ingrese un minimo en Almacen', type: 'number' },
						{ name: 'url', label: 'Url', placeholder: 'Ingrese una url', type: 'text' },
					]}
					formState={formState}
					setFormState={setFormState}
				/>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					handlePreviousPage={handlePreviousPage}
					handleNextPage={handleNextPage}
				/>
			</Suspense>
		</>
	);
};

export default CRUDProducto;
