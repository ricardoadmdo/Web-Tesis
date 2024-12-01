import { useContext, useState } from 'react';
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import Swal from 'sweetalert2';
import Axios from 'axios';

const UserProfile = () => {
	const { user, dispatch } = useContext(AuthContext);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [showChangeName, setShowChangeName] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [nombre, setnombre] = useState('');

	const handlePasswordChange = async (e) => {
		e.preventDefault();

		// Validación de campos vacíos y coincidencia de contraseñas
		if (!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6) {
			return Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: newPassword.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : 'Las contraseñas no coinciden o faltan datos',
			});
		}

		try {
			const correo = user.correo;
			const response = await Axios.put('http://localhost:3001/api/auth/changePassword', {
				newPassword,
				correo,
			});

			if (response.data.ok) {
				Swal.fire({
					icon: 'success',
					title: 'Éxito',
					text: 'Contraseña actualizada',
				});
				setShowChangePassword(false); // Ocultar formulario al cambiar la contraseña correctamente
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: response.data.msg || 'No se pudo actualizar la contraseña',
				});
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error.response?.data?.msg || 'Ocurrió un error al actualizar la contraseña',
			});
		}
	};

	const changeUserName = async (e) => {
		e.preventDefault();

		// Validación de nombre vacío
		if (!nombre) {
			return Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'El campo de nombre es obligatorio',
			});
		}

		try {
			const correo = user.correo;
			const response = await Axios.put('http://localhost:3001/api/auth/changeUserName', {
				nombre,
				correo,
			});

			if (response.data.ok) {
				Swal.fire({
					icon: 'success',
					title: 'Éxito',
					text: 'Nombre actualizado',
				});
				setShowChangeName(false); // Ocultar formulario al cambiar el nombre correctamente

				// Actualizar el estado global con el nuevo nombre
				dispatch({
					type: types.login,
					payload: {
						...user,
						nombre, // Cambiar al nuevo nombre
					},
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: response.data.msg || 'No se pudo actualizar el nombre',
				});
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error.response?.data?.msg || 'Ocurrió un error al actualizar el nombre',
			});
		}
	};

	return (
		<div className='container mt-5'>
			<div className='card shadow p-3 mb-5 bg-white rounded'>
				<div className='row'>
					<div className='col-md-4 text-center'>
						<img src='https://via.placeholder.com/150' alt='User Avatar' className='rounded-circle img-fluid' />
						<h4 className='mt-3'>{user.nombre}</h4>
						<p className='text-muted'>{user.correo}</p>
					</div>
					<div className='col-md-8'>
						<div className='card-body'>
							<h5 className='card-title'>Información Personal</h5>
							<div className='row mb-3'>
								<div className='col'>
									<p>
										<strong>Nombre: </strong>
										{user.nombre}
									</p>
									<p>
										<strong>Correo: </strong>
										{user.correo}
									</p>
									<p>
										<strong>Rol: </strong>
										{user.rol}
									</p>
								</div>
							</div>

							{/* Botón para cambiar contraseña */}
							{!showChangePassword && (
								<button className='btn btn-primary mb-3' onClick={() => setShowChangePassword(true)}>
									Cambiar Contraseña
								</button>
							)}

							{/* Formulario de cambiar contraseña */}
							{showChangePassword && (
								<div className='card p-3 mb-4'>
									<form onSubmit={handlePasswordChange}>
										<div className='form-group'>
											<label htmlFor='formCurrentPassword'>Contraseña Actual</label>
											<input
												type='password'
												className='form-control'
												id='formCurrentPassword'
												value={currentPassword}
												onChange={(e) => setCurrentPassword(e.target.value)}
												required
											/>
										</div>
										<div className='form-group mt-3'>
											<label htmlFor='formNewPassword'>Nueva Contraseña</label>
											<input
												type='password'
												className='form-control'
												id='formNewPassword'
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												required
											/>
										</div>
										<div className='form-group mt-3'>
											<label htmlFor='formConfirmPassword'>Confirmar Contraseña</label>
											<input
												type='password'
												className='form-control'
												id='formConfirmPassword'
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												required
											/>
										</div>
										<div className='d-flex justify-content-between mt-3'>
											<button className='btn btn-danger' type='button' onClick={() => setShowChangePassword(false)}>
												Cancelar
											</button>
											<button className='btn btn-success' type='submit'>
												Actualizar Contraseña
											</button>
										</div>
									</form>
								</div>
							)}

							{/* Botón para cambiar nombre */}
							{!showChangeName && (
								<button className='btn btn-secondary' onClick={() => setShowChangeName(true)}>
									Cambiar Nombre
								</button>
							)}

							{/* Formulario de cambiar nombre */}
							{showChangeName && (
								<div className='card p-3 mb-4'>
									<form onSubmit={changeUserName}>
										<div className='form-group'>
											<label htmlFor='formnombre'>Nuevo Nombre</label>
											<input
												type='text'
												className='form-control'
												id='formnombre'
												value={nombre}
												onChange={(e) => setnombre(e.target.value)}
												required
											/>
										</div>
										<div className='d-flex justify-content-between mt-3'>
											<button className='btn btn-danger' type='button' onClick={() => setShowChangeName(false)}>
												Cancelar
											</button>
											<button className='btn btn-success' type='submit'>
												Actualizar Nombre
											</button>
										</div>
									</form>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
