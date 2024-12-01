import PropTypes from 'prop-types';
import './styles.css';

const ErrorComponent = ({ message }) => {
	return (
		<div className='container-fluid d-flex justify-content-center align-items-center vh-100'>
			<div className='error-container text-center'>
				<h2>¡Ups! Algo salió mal</h2>
				<p>{message}</p>
				<p>Por favor, inténtelo de nuevo más tarde.</p>
			</div>
		</div>
	);
};

ErrorComponent.propTypes = {
	message: PropTypes.string.isRequired,
};

export default ErrorComponent;
