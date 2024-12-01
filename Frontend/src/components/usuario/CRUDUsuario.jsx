import { useState, useContext, useEffect, lazy, Suspense } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../auth/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TableSkeleton from '../ui/TableSkeleton.jsx';
import ErrorComponent from '../ui/ErrorComponent.jsx';
const Pagination = lazy(() => import('../reutilizable-tablaCrud/Pagination.jsx'));
const TablaCRUD = lazy(() => import('../reutilizable-tablaCrud/TablaCRUD.jsx'));

const fetchUsuarios = async ({ page, searchTerm }) => {
	const response = await Axios.get(`http://localhost:3001/api/users?page=${page}&search=${searchTerm}`);
	return response.data;
};

const CRUDUsuario = () => {
	const [id, setId] = useState('');
	const [formState, setFormState] = useState({
		nombre: '',
		password: '',
		correo: '',
		rol: 'USER_ROLE',
		estado: false,
	});
	const navigate = useNavigate();
	const [operationMode, setOperationMode] = useState(1);
	const { user } = useContext(AuthContext);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [title, setTitle] = useState('');

	const queryClient = useQueryClient();
	const refetchUsuarios = () => {
		queryClient.invalidateQueries(['usuarios']);
	};

	const { data, isLoading, isError } = useQuery({
		queryKey: ['usuarios', { page: currentPage, searchTerm: debouncedSearchTerm }],
		queryFn: () => fetchUsuarios({ page: currentPage, searchTerm: debouncedSearchTerm }),
		keepPreviousData: true,
	});

	const mutation = useMutation({
		mutationFn: (newUser) => Axios.post('http://localhost:3001/api/users', newUser),
		onSuccess: () => {
			refetchUsuarios();
			limpiarCampos();
			Swal.fire({
				title: '<strong>Registro exitoso!!!</strong>',
				html: '<i>El usuario <strong>' + formState.nombre + '</strong> fue registrado con éxito</i>',
				icon: 'success',
				timer: 3000,
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Error al agregar un usuario',
				text: error.response?.data?.error || 'Error desconocido al agregar un usuario',
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }) => Axios.put(`http://localhost:3001/api/users/${id}`, data),
		onSuccess: () => {
			refetchUsuarios();
			limpiarCampos();
			Swal.fire({
				title: '<strong>Actualización exitosa!!!</strong>',
				html: '<i>El usuario <strong>' + formState.nombre + '</strong> fue actualizado con éxito</i>',
				icon: 'success',
				timer: 3000,
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.response?.data?.msg || 'Error desconocido al actualizar el usuario',
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (uid) =>
			Axios.delete(`http://localhost:3001/api/users/${uid}`, {
				headers: { 'x-token': user.token },
			}),
		onSuccess: () => {
			refetchUsuarios();
			limpiarCampos();
			Swal.fire({
				icon: 'success',
				title: 'Usuario eliminado.',
				showConfirmButton: false,
				timer: 2000,
				willOpen: () => {
					document.body.classList.add('no-scroll'); // Deshabilitar scroll
				},
				willClose: () => {
					document.body.classList.remove('no-scroll'); // Habilitar scroll
				},
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.response?.data?.msg || 'Error desconocido al eliminar el usuario',
				willOpen: () => {
					document.body.classList.add('no-scroll'); // Deshabilitar scroll
				},
				willClose: () => {
					document.body.classList.remove('no-scroll'); // Habilitar scroll
				},
			});
		},
	});

	const deleteUserWithConfirmation = (val) => {
		Swal.fire({
			title: 'Confirmar eliminado?',
			html: '<i>Realmente desea eliminar a <strong>' + val.nombre + '</strong>?</i>',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'green',
			cancelButtonColor: 'red',
			confirmButtonText: 'Si, eliminarlo!',
			willOpen: () => {
				document.body.classList.add('no-scroll'); // Deshabilitar scroll
			},
			willClose: () => {
				document.body.classList.remove('no-scroll'); // Habilitar scroll
			},
		}).then((result) => {
			if (result.isConfirmed) {
				deleteMutation.mutate(val.uid);
			}
		});
	};

	const handleSearchChange = (e) => setSearchTerm(e.target.value);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/dashboard/buscarusuarios?query=${searchTerm}`);
	};

	const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

	const handleNextPage = () => currentPage < (data?.totalPages || 0) && setCurrentPage((prev) => prev + 1);

	const limpiarCampos = () => setFormState({ nombre: '', password: '', correo: '', rol: 'USER_ROLE', estado: '' });

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

	const validar = (event) => {
		event.preventDefault();
		const { nombre, correo, password, rol, estado } = formState;
		if (nombre.trim() === '' || correo.trim() === '' || rol === '' || estado === '') {
			Swal.fire({ icon: 'error', title: 'Campos Vacíos', text: 'Todos los campos son obligatorios' });
			return;
		}
		if (operationMode === 1 && (!password || password.length < 6)) {
			Swal.fire({ icon: 'error', title: 'Contraseña no válida', text: 'La contraseña tiene que tener 6 o más caracteres' });
			return;
		}
		if (operationMode === 1) {
			mutation.mutate(formState);
		} else if (operationMode === 2) {
			updateMutation.mutate({ id, data: { ...formState, password: undefined } });
		}
		document.getElementById('btnCerrar').click();
	};

	const openModal = (op, usuario) => {
		setFormState({
			nombre: op === 2 ? usuario.nombre : '',
			password: '',
			correo: op === 2 ? usuario.correo : '',
			rol: op === 2 ? usuario.rol : 'USER_ROLE',
			estado: op === 2 ? usuario.estado : '',
		});
		setOperationMode(op);
		setTitle(op === 1 ? 'Registrar Usuario' : 'Editar Usuario');
		if (op === 2) setId(usuario.uid);
		window.setTimeout(() => document.getElementById('nombre').focus(), 500);
	};

	return (
		<>
			<Suspense fallback={<TableSkeleton />}>
				<TablaCRUD
					filtro={true}
					searchTerm={searchTerm}
					handleSearchChange={handleSearchChange}
					handleSearchSubmit={handleSearchSubmit}
					titleBuscar={'Buscar usuario...'}
					busqueda={true}
					data={data?.usuarios || []}
					onAdd={() => openModal(1)}
					columns={[
						{ header: 'Nombre', accessor: 'nombre' },
						{ header: 'Correo Electrónico', accessor: 'correo' },
						{ header: 'Rol', accessor: 'rol' },
						{ header: 'Estado', accessor: 'estado' },
					]}
					onEdit={(usuario) => openModal(2, usuario)}
					onDelete={(usuario) => deleteUserWithConfirmation(usuario)}
					title={title}
					modalTitle='Añadir nuevo Usuario'
					validate={validar}
					operationMode={operationMode}
					setOperationMode={setOperationMode}
					formFields={[
						{ name: 'nombre', label: 'Nombre', placeholder: 'Ingrese un nombre', type: 'text' },
						{ name: 'password', label: 'Contraseña', placeholder: 'Ingrese una contraseña', type: 'password' },
						{ name: 'correo', label: 'Correo Electrónico', placeholder: 'Ingrese un correo electrónico', type: 'email' },
						{
							name: 'rol',
							label: 'Rol',
							type: 'select',
							options: [
								{ value: 'USER_ROLE', label: 'USER_ROLE' },
								{ value: 'ADMIN_ROLE', label: 'ADMIN_ROLE' },
								{ value: 'GESTOR_VENTAS', label: 'GESTOR_VENTAS' },
							],
						},
						{
							name: 'estado',
							label: 'Estado',
							type: 'select',
							options: [
								{ value: true, label: 'Activo' },
								{ value: false, label: 'Inactivo' },
							],
						},
					]}
					formState={formState}
					setFormState={setFormState}
				/>
				<Pagination
					currentPage={currentPage}
					totalPages={data?.totalPages || 0}
					handlePreviousPage={handlePreviousPage}
					handleNextPage={handleNextPage}
				/>
			</Suspense>
		</>
	);
};

export default CRUDUsuario;
