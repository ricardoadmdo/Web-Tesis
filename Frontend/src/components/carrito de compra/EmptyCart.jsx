import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const EmptyCart = () => {
	return (
		<div className='text-center py-5 vh-100'>
			<div className='mb-4'>
				<FontAwesomeIcon icon={faShoppingCart} size='9x' className='text-muted' />
			</div>
			<p className='h5'>Tu carrito se encuentra vacío</p>
			<p className='mb-4'>Parece que aún no has agregado ningún producto</p>
			<NavLink to='/productos' className=' btn btn-dark btn-lg'>
				Ir a Comprar
			</NavLink>
		</div>
	);
};

export default EmptyCart;
