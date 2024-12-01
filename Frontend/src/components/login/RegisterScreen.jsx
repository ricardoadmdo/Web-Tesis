import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import Axios from 'axios';

const RegisterScreen = () => {
	const [nombre, setNombre] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (password !== confirmPassword) {
				throw new Error('Las contraseñas no coinciden');
			}

			await Axios.post('http://localhost:3001/api/auth/register', {
				nombre,
				password,
				correo: email,
				rol: 'USER_ROLE',
			});

			const response = await Axios.post(`http://localhost:3001/api/auth/verify/${email}`);
			const token = response.data.token;

			Swal.fire({
				title: 'Código enviado',
				text: 'Por favor revisa tu correo electrónico',
				icon: 'info',
			});

			navigate(`/verify-code?token=${token}`);
		} catch (error) {
			if (error.response && error.response.data && error.response.data.msg) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: error.response.data.msg,
				});
			} else {
				Swal.fire({
					icon: 'warning',
					title: 'Error',
					text: error.message || 'Ocurrió un error inesperado. Por favor, intente nuevamente.',
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div
			className='container-fluid d-flex justify-content-center align-items-center vh-100 '
			style={{
				backgroundImage: `url(https://res.cloudinary.com/dber1pxea/image/upload/v1718041412/i0agcr3wwtibxdhwgoo6.jpg)`,
				backgroundSize: 'cover',
				backgroundPosition: 'center center',
				zIndex: '-1',
			}}
		>
			<div
				className='card p-4 shadow text-center animate__animated animate__fadeIn'
				style={{ borderRadius: '24px', backgroundColor: 'rgba(250, 250, 250, 0.819)', zIndex: '2' }}
			>
				<h4 className='mb-3'>¡Crea una cuenta para continuar!</h4>
				<h2 className='mb-4'>Registrarse</h2>
				<form className='d-grid gap-3' onSubmit={handleRegister}>
					<div className='form-group'>
						<label>Su nombre:</label>
						<input
							className='form-control'
							onChange={(event) => setNombre(event.target.value)}
							value={nombre}
							type='text'
							name='name'
							placeholder='Nombre Completo'
							required
						/>
					</div>
					<div className='form-group'>
						<label>Correo electrónico:</label>
						<input
							className='form-control'
							onChange={(event) => setEmail(event.target.value)}
							value={email}
							type='email'
							name='address'
							placeholder='Correo electrónico'
							required
						/>
					</div>
					<div className='form-group position-relative'>
						<label>Contraseña:</label>
						<input
							className='form-control'
							onChange={(event) => setPassword(event.target.value)}
							value={password}
							type={showPassword ? 'text' : 'password'}
							name='password'
							placeholder='Al menos 6 caracteres'
							required
						/>
						<FontAwesomeIcon
							className='position-absolute top-50 end-0 translate-middle-y me-3'
							icon={showPassword ? faEyeSlash : faEye}
							onClick={togglePasswordVisibility}
						/>
					</div>
					<div className='form-group position-relative'>
						<label>Confirmar Contraseña:</label>
						<input
							className='form-control'
							onChange={(event) => setConfirmPassword(event.target.value)}
							value={confirmPassword}
							type={showPassword ? 'text' : 'password'}
							name='confirmPassword'
							placeholder='Introduzca su contraseña otra vez'
							required
						/>
						<FontAwesomeIcon
							className='position-absolute top-50 end-0 translate-middle-y me-3'
							icon={showPassword ? faEyeSlash : faEye}
							onClick={togglePasswordVisibility}
						/>
					</div>
					<button className='btn btn-success' type='submit' disabled={isLoading}>
						{isLoading ? 'Registrando...' : 'Registrarse'}
					</button>
					<NavLink to='/login' className='text-primary'>
						¿Ya tienes una cuenta? Inicia Sesión aquí
					</NavLink>
				</form>
			</div>
		</div>
	);
};

export default RegisterScreen;
