import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const EmptySearch = () => {
	return (
		<div className='text-center py-5 vh-100'>
			<div className='mb-4'>
				<FontAwesomeIcon icon={faSearch} size='9x' className='text-muted' />
			</div>
			<p className='h5'>No se encontraron resultados</p>
			<p className='mb-4'>Intenta ajustar los términos de búsqueda o verifica la ortografía.</p>
			<NavLink to='/' className='btn btn-dark btn-lg'>
				Volver a Tienda
			</NavLink>
		</div>
	);
};

export default EmptySearch;
