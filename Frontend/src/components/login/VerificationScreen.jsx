import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from 'axios';
import './styles.css';

const VerificationScreen = () => {
	const [code, setCode] = useState('');
	const navigate = useNavigate();
	const location = useLocation();
	const [token, setToken] = useState('');

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const tokenFromURL = query.get('token');
		if (tokenFromURL) {
			setToken(tokenFromURL);
		}
	}, [location.search]);

	const handleVerifyCode = (e) => {
		e.preventDefault();
		Axios.post('http://localhost:3001/api/auth/verify', { token, code })
			.then(() => {
				Swal.fire({
					title: 'Código verificado',
					text: 'Bienvenido a Ricardo & Neyde',
					icon: 'success',
				});
				navigate('/login');
			})
			.catch((error) => {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: error.response.data.msg,
				});
			});
	};

	return (
		<div className='container-fluid d-flex justify-content-center align-items-center vh-100 verification-container'>
			<div className='card p-4 shadow text-center animate__animated animate__fadeIn verification-card'>
				<h2 className='mb-4'>Verificación de Código</h2>
				<form onSubmit={handleVerifyCode}>
					<div className='form-group mb-3'>
						<label htmlFor='code'>Código:</label>
						<input
							type='text'
							placeholder='Código aquí...'
							className='form-control'
							id='code'
							value={code}
							onChange={(e) => setCode(e.target.value)}
							required
						/>
					</div>
					<button type='submit' className='btn btn-success w-100'>
						Verificar
					</button>
				</form>
			</div>
		</div>
	);
};

export default VerificationScreen;
