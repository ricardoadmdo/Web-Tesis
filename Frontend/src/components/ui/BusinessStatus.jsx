import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const BusinessStatus = () => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const checkBusinessStatus = () => {
			const now = new Date();
			const day = now.getDay();
			const hour = now.getHours();
			const minutes = now.getMinutes();

			let open = false;

			if (day >= 1 && day <= 5) {
				if ((hour > 9 || (hour === 9 && minutes >= 0)) && (hour < 20 || (hour === 20 && minutes === 0))) {
					open = true;
				}
			} else if (day === 6) {
				if ((hour > 10 || (hour === 10 && minutes >= 0)) && (hour < 18 || (hour === 18 && minutes === 0))) {
					open = true;
				}
			}

			setIsOpen(open);
		};

		checkBusinessStatus();

		const intervalId = setInterval(checkBusinessStatus, 60000);

		return () => clearInterval(intervalId);
	}, []);

	const iconColor = isOpen ? 'green' : 'red';

	return (
		<div
			className='card text-center animate__animated animate__bounceIn'
			style={{
				border: '1px solid #333',
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
				margin: '20px auto',
				maxWidth: '400px',
				backgroundColor: '#343a40',
				color: 'white',
			}}
		>
			<div
				className='card-header'
				style={{
					backgroundColor: isOpen ? '#28a745' : '#dc3545',
					color: 'white',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<FontAwesomeIcon icon={faClock} size='lg' style={{ color: iconColor, marginRight: '10px' }} />
				{isOpen ? 'Abierto' : 'Cerrado'}
			</div>
			<div className='card-body'>
				<h5 className='card-title'>
					<span
						className={`badge ${isOpen ? 'bg-success' : 'bg-danger'}`}
						style={{
							width: '15px',
							height: '15px',
							borderRadius: '50%',
							display: 'inline-block',
							marginRight: '10px',
						}}
					></span>
					{isOpen ? 'Estamos Abiertos!' : 'Estamos Cerrados'}
				</h5>
				<p>Hoy ({new Date().toLocaleDateString('es-ES', { weekday: 'long' })})</p>
				<p className='card-text'>
					<strong>Horario:</strong>
					<br />
					Lunes a Viernes: 9:00 AM - 8:00 PM
					<br />
					Sábado: 10:00 AM - 6:00 PM
					<br />
					Domingo: Cerrado
				</p>
			</div>
		</div>
	);
};

export default BusinessStatus;
