import { Toast } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const CustomToast = ({ showToast, setShowToast, message, position }) => {
	const [styles, setStyles] = useState({});

	useEffect(() => {
		const positions = {
			topRight: { top: '20px', right: '20px' },
			topLeft: { top: '20px', left: '20px' },
			bottomRight: { bottom: '20px', right: '20px' },
			bottomLeft: { bottom: '20px', left: '20px' },
			bottomCenter: { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
		};
		setStyles(positions[position] || positions.topRight);
	}, [position]);

	return (
		<Toast
			show={showToast}
			onClose={() => setShowToast(false)}
			delay={500}
			autohide
			className={`custom-toast ${showToast ? 'fade-in' : 'fade-out'}`}
			style={{
				position: 'fixed',
				backgroundColor: '#28a745',
				color: 'white',
				borderRadius: '8px',
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
				...styles,
			}}
		>
			<Toast.Body>{message}</Toast.Body>
		</Toast>
	);
};

CustomToast.propTypes = {
	showToast: PropTypes.bool.isRequired,
	setShowToast: PropTypes.func.isRequired,
	message: PropTypes.string,
	position: PropTypes.oneOf(['topRight', 'topLeft', 'bottomRight', 'bottomLeft', 'bottomCenter']),
};

export default CustomToast;
