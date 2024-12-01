import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHamburger } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const EmptyProducts = () => {
	return (
		<div className='text-center py-5 vh-100'>
			<div className='mb-4'>
				<FontAwesomeIcon icon={faHamburger} size='9x' className='text-muted' />
			</div>
			<p className='h5'>No se encontraron productos</p>
			<p className='mb-4'>Vuelva más tarde.</p>
			<NavLink to='/' className='btn btn-dark btn-lg'>
				Volver a Tienda
			</NavLink>
		</div>
	);
};

export default EmptyProducts;
