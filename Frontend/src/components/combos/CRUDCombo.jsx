import { useState, lazy, Suspense } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import useFetch from '../../hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import TableSkeleton from '../ui/TableSkeleton.jsx';
import ErrorComponent from '../ui/ErrorComponent.jsx';
const TablaCRUD = lazy(() => import('../reutilizable-tablaCrud/TablaCRUD.jsx'));
const Pagination = lazy(() => import('../reutilizable-tablaCrud/Pagination.jsx'));

const fetchCombos = async ({ queryKey }) => {
	const [, page, limit] = queryKey;
	const response = await Axios.get(`http://localhost:3001/api/combo?page=${page}&limit=${limit}`);
	return response.data;
};

const CRUDCombo = () => {
	const [id, setId] = useState('');
	const [formState, setFormState] = useState({
		nombre: '',
		precio: '',
		description: '',
		url: '',
		cantidad: '',
		estado: true, //Predeterminado como activo
	});
	const [operationMode, setOperationMode] = useState(1);
	const [title, setTitle] = useState('');
	const [currentPage, setCurrentPage] = useState(1);

	const queryClient = useQueryClient();
	const refetchCombos = () => {
		queryClient.invalidateQueries(['combos']);
	};

	const { data: combosData, isLoading, isError } = useFetch(['combos', currentPage, 8], fetchCombos, { keepPreviousData: true });

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < (combosData?.totalPages || 0)) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	if (isLoading) {
		return <TableSkeleton />;
	}

	if (isError) {
		return <ErrorComponent />;
	}

	const combosList = combosData?.combos || [];
	const totalPages = combosData?.totalPages || 0;

	const limpiarCampos = () => {
		setFormState({
			nombre: '',
			description: '',
			precio: '',
			url: '',
			cantidad: '',
			estado: false,
		});
	};

	const addCombos = () => {
		Axios.post('http://localhost:3001/api/combo', formState)
			.then(() => {
				refetchCombos();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Registro exitoso!!!</strong>',
					html: '<i>El combo <strong>' + formState.nombre + '</strong> fue registrado con éxito</i>',
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

	const updateCombos = () => {
		Axios.put(`http://localhost:3001/api/combo/${id}`, formState)
			.then(() => {
				refetchCombos();
				limpiarCampos();
				Swal.fire({
					title: '<strong>Actualización exitoso!!!</strong>',
					html: '<i>El combo <strong>' + formState.nombre + '</strong> fue actualizado con éxito</i>',
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

	const deleteCombos = (val) => {
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
				Axios.delete(`http://localhost:3001/api/combo/${val.uid}`)
					.then(() => {
						refetchCombos();
						limpiarCampos();
						Swal.fire({
							icon: 'success',
							title: 'El combo ' + val.nombre + ' fue eliminado.',
							showConfirmButton: false,
							timer: 2000,
						});
					})
					.catch(function (error) {
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'No se logro eliminar el combo!',
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
		const { nombre, description, precio, url, cantidad } = formState;
		if (nombre.trim() === '' || description.trim() === '' || precio === 0 || url.trim() === '' || cantidad === 0) {
			Swal.fire({
				icon: 'error',
				title: 'Campos Vacíos',
				text: 'Todos los campos son obligatorios',
			});
		} else {
			if (operationMode === 1) {
				addCombos();
			}

			if (operationMode === 2) {
				updateCombos();
			}

			document.getElementById('btnCerrar').click();
			refetchCombos();
		}
	};

	const openModal = (op, combo) => {
		setFormState({
			nombre: op === 2 ? combo.nombre : '',
			cantidad: op === 2 ? combo.cantidad : '',
			description: op === 2 ? combo.description : '',
			precio: op === 2 ? combo.precio : '',
			url: op === 2 ? combo.url : '',
			estado: op === 2 ? combo.estado : false,
		});

		setOperationMode(op);
		setTitle(op === 1 ? 'Registrar Combo' : 'Editar Combo');

		// Si es modo de edición, establece el ID
		setId(op === 2 ? combo.uid : '');

		// Enfoca el primer campo del formulario después de un breve retraso
		window.setTimeout(() => {
			document.getElementById('nombre').focus();
		}, 500);
	};

	return (
		<>
			<Suspense fallback={<TableSkeleton />}>
				<TablaCRUD
					busqueda={false}
					data={combosList}
					onAdd={() => openModal(1)}
					columns={[
						{ header: 'Nombre', accessor: 'nombre' },
						{ header: 'Cantidad', accessor: 'cantidad' },
						{ header: 'Precio en CUP', accessor: 'precio' },
						{ header: 'Precio en USD', accessor: 'usd' },
						{ header: 'Descripción', accessor: 'description' },
						{ header: 'Estado en DB', accessor: 'estado' },
					]}
					onEdit={(combo) => openModal(2, combo)}
					onDelete={deleteCombos}
					title={title}
					modalTitle='Añadir nuevo Combo'
					validate={validar}
					operationMode={operationMode}
					setOperationMode={setOperationMode}
					formFields={[
						{ name: 'nombre', label: 'Nombre', placeholder: 'Ingrese un nombre', type: 'text' },
						{ name: 'cantidad', label: 'Cantidad', placeholder: 'Ingrese la cantidad', type: 'number' },
						{ name: 'description', label: 'Descripción', placeholder: 'Ingrese una descripción', type: 'text' },
						{ name: 'precio', label: 'Precio', placeholder: 'Ingrese un precio', type: 'number' },
						{
							name: 'estado',
							label: 'Estado en Base de Datos',
							type: 'select',
							options: [
								{ value: true, label: 'Activo' },
								{ value: false, label: 'Inactivo' },
							],
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
	);
};

export default CRUDCombo;
