import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const EmptyCombos = () => {
	return (
		<div className='text-center py-5 vh-100'>
			<div className='mb-4'>
				<FontAwesomeIcon icon={faUtensils} size='9x' className='text-muted' />
			</div>
			<p className='h5'>No se encontraron combos</p>
			<p className='mb-4'>Vuelva más tarde.</p>
			<NavLink to='/' className='btn btn-dark btn-lg'>
				Volver a Tienda
			</NavLink>
		</div>
	);
};

export default EmptyCombos;
