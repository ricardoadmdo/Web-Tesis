import { useNavigate, NavLink } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import Axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { dispatch } = useContext(AuthContext);
	const [newUser, setNewUser] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const login = useGoogleLogin({
		onSuccess: handleGoogleLogin,
		onError: (error) => console.log('Login Failed:', error),
	});

	async function handleGoogleLogin(codeResponse) {
		try {
			const response = await Axios.post('http://localhost:3001/api/auth/google', {
				access_token: codeResponse.access_token,
			});
			const userData = response.data.usuario;

			if (response.data.newUser || response.data.cambiarPassword) {
				setNewUser(true);
				setEmail(response.data.correo || userData.correo);
			} else {
				handleLoginSuccess(userData, response.data.token);
			}
		} catch (error) {
			console.error('Error durante la autenticación con Google:', error);
		}
	}

	async function handleNewUserSubmit(e) {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Las contraseñas no coinciden',
			});
			return;
		}

		try {
			const response = await Axios.post('http://localhost:3001/api/auth/create-password', {
				correo: email,
				password: newPassword,
			});
			const userData = response.data.usuario;
			handleLoginSuccess(userData, response.data.token);
		} catch (error) {
			console.error('Error durante la creación de contraseña:', error);
		}
	}

	async function handleLogin(e) {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await Axios.post('http://localhost:3001/api/auth/login', {
				correo: email,
				password: password,
			});

			const data = response.data;
			if (data) {
				handleLoginSuccess(data.usuario, data.token);
				showConfirm();
			} else {
				showErrorAlert();
			}
		} catch (error) {
			console.error('Error al iniciar sesión:', error);
			showErrorAlert();
		} finally {
			setIsLoading(false);
		}
	}

	function handleLoginSuccess(userData, token) {
		const action = {
			type: types.login,
			payload: {
				nombre: userData.nombre,
				correo: userData.correo,
				token: token,
				rol: userData.rol,
				uid: userData.uid,
				google: true,
			},
		};
		dispatch(action);
		const lastPath = localStorage.getItem('lastPath') || '/';
		navigate(lastPath, { replace: true });
	}

	function handleChange(e) {
		const { name, value } = e.target;
		switch (name) {
			case 'email':
				setEmail(value);
				break;
			case 'password':
				setPassword(value);
				break;
			case 'newPassword':
				setNewPassword(value);
				break;
			case 'confirmPassword':
				setConfirmPassword(value);
				break;
			default:
				break;
		}
	}

	function togglePasswordVisibility() {
		setShowPassword(!showPassword);
	}

	function showErrorAlert() {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Usuario o contraseña incorrectos',
		});
	}

	function showConfirm() {
		Swal.fire({
			title: 'Bienvenido a la web de ventas de Ricardo & Neyde',
			text: 'Sesión iniciada correctamente',
			icon: 'success',
		});
	}

	return (
		<div
			className=' container-fluid d-flex justify-content-center align-items-center vh-100 '
			style={{
				backgroundImage: `url(https://res.cloudinary.com/dber1pxea/image/upload/v1718041412/i0agcr3wwtibxdhwgoo6.jpg)`,
				backgroundSize: 'cover',
				backgroundPosition: 'center center',
			}}
		>
			<div
				className='card p-4 shadow text-center animate__animated animate__fadeIn'
				style={{ borderRadius: '24px', backgroundColor: 'rgba(250, 250, 250, 0.9)' }}
			>
				{newUser ? (
					<>
						<h3 className='mb-3'>Necesita una contraseña para su cuenta: </h3>
						<form className='d-grid gap-3' onSubmit={handleNewUserSubmit}>
							<div className='form-group'>
								<label>Contraseña:</label>
								<input
									className='form-control'
									onChange={handleChange}
									value={newPassword}
									type='password'
									name='newPassword'
									placeholder='Contraseña'
									required
								/>
							</div>
							<div className='form-group'>
								<label>Confirmar Contraseña:</label>
								<input
									className='form-control'
									onChange={handleChange}
									value={confirmPassword}
									type='password'
									name='confirmPassword'
									placeholder='Confirmar Contraseña'
									required
								/>
							</div>
							<button className='btn btn-success' type='submit'>
								Crear Contraseña
							</button>
						</form>
					</>
				) : (
					<>
						<h4 className='mb-3'>Bienvenido Amigo!</h4>
						<h2 className='mb-4'>Inicia Sesión</h2>
						<form className='d-grid gap-3' onSubmit={handleLogin}>
							<div className='form-group'>
								<label>Su dirección de correo electrónico:</label>
								<input
									className='form-control'
									onChange={handleChange}
									value={email}
									type='email'
									name='email'
									placeholder='correo@.com'
									required
									autoComplete='off'
								/>
							</div>
							<div className='form-group position-relative'>
								<label>Contraseña:</label>
								<input
									className='form-control'
									onChange={handleChange}
									value={password}
									type={showPassword ? 'text' : 'password'}
									name='password'
									placeholder='Contraseña'
									autoComplete='off'
									required
								/>
								<FontAwesomeIcon
									className='position-absolute top-50 end-0 translate-middle-y me-3'
									icon={showPassword ? faEyeSlash : faEye}
									onClick={togglePasswordVisibility}
									style={{ cursor: 'pointer' }}
								/>
							</div>
							<button className='btn btn-success' type='submit' disabled={isLoading}>
								{isLoading ? 'Cargando...' : 'Iniciar Sesión'}
							</button>
						</form>
						<div className='mt-3'>
							<button className='btn btn-outline-dark d-flex align-items-center' onClick={login}>
								<img src='https://img.icons8.com/color/16/000000/google-logo.png' alt='Google icon' className='me-2' />
								Iniciar sesión con Google
							</button>
						</div>
						<NavLink to='/register' className='text-primary mt-3'>
							¿No tienes una cuenta? Regístrate aquí
						</NavLink>
					</>
				)}
			</div>
		</div>
	);
};

export default LoginScreen;
