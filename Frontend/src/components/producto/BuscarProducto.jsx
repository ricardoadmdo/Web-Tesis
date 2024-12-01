import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';
import TableSkeleton from '../ui/TableSkeleton.jsx';
const Pagination = lazy(() => import('../reutilizable-tablaCrud/Pagination.jsx'));
const TablaCRUD = lazy(() => import('../reutilizable-tablaCrud/TablaCRUD.jsx'));

const BuscarProducto = () => {
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
	const [resultados, setResultados] = useState([]);
	const location = useLocation(); // Usa useLocation para obtener la ubicación actual
	const query = new URLSearchParams(location.search).get('query'); // Obtén el valor de query aquí
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [title, setTitle] = useState('');
	const [operationMode, setOperationMode] = useState(1);

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

	useEffect(() => {
		setResultados([]); // Limpiar resultados antes de cada búsqueda
		if (query) {
			buscar(query);
		}
	}, [query]);

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			getProductos(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			getProductos(currentPage + 1);
		}
	};
	useEffect(() => {
		getProductos();
	}, []);

	const getProductos = () => {
		Axios.get('http://localhost:3001/api/product')
			.then((response) => {
				const { totalPages, page } = response.data;
				setTotalPages(totalPages); // Actualizar el total de páginas
				setCurrentPage(page); // Actualizar la página actual
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Función para buscar usuarios
	const buscar = (query) => {
		Axios.get(`http://localhost:3001/api/product/search?query=${query}`)
			.then((response) => {
				const { productos, totalPages, page } = response.data;
				setResultados(productos);
				setTotalPages(totalPages);
				setCurrentPage(page);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const addProductos = () => {
		Axios.post('http://localhost:3001/api/product', formState)
			.then(() => {
				buscar(query);
				limpiarCampos();
				Swal.fire({
					title: '<strong>Registro exitoso!!!</strong>',
					html: '<i>El producto <strong>' + formState.nombre + '</strong> fue registrado con éxito</i>',
					icon: 'success',
					timer: 3000,
				});
			})
			.catch((error) => {
				const errorMessage =
					error.response && error.response.data && error.response.data.error
						? error.response.data.error
						: 'Error desconocido al agregar un producto';
				Swal.fire({
					icon: 'error',
					title: 'Error al agregar un producto',
					text: errorMessage,
				});
			});
	};

	const updateProductos = () => {
		// eslint-disable-next-line no-unused-vars
		const { password, ...dataToUpdate } = formState; // Destructura para excluir la contraseña
		Axios.put(`http://localhost:3001/api/product/${id}`, dataToUpdate)
			.then(() => {
				buscar(query);
				limpiarCampos();
				Swal.fire({
					title: '<strong>Actualización exitosa!!!</strong>',
					html: '<i>El producto <strong>' + formState.nombre + '</strong> fue actualizado con éxito</i>',
					icon: 'success',
					timer: 3000,
				});
			})
			.catch(function (error) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: error.response.data.msg,
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
						getProductos();
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
			buscar(query);
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

	return (
		<div className='container-fluid my-5'>
			{resultados.length > 0 ? (
				<>
					<h2 className='text-center mb-4'>Resultados de la Búsqueda</h2>
					<div className='row'></div>
					<Suspense fallback={<TableSkeleton />}>
						<TablaCRUD
							busqueda={false}
							data={resultados}
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
								{
									name: 'minimoEnAlmacen',
									label: 'Minimo en el Almacen',
									placeholder: 'Ingrese un minimo en Almacen',
									type: 'number',
								},
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
			) : (
				<div className='container-fluid d-flex justify-content-center vh-100'>
					<h2>No se encontró ningún producto</h2>
				</div>
			)}
		</div>
	);
};

export default BuscarProducto;
