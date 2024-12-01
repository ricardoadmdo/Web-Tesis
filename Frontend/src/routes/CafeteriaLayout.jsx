import { Outlet } from 'react-router-dom';
import NavbarCaf from '../components/cafeteria/ui/NavbarCaf';
import Footer from '../components/footer/Footer';

const CafeteriaLayout = () => (
	<>
		<NavbarCaf />
		<div className='content'>
			<Outlet />
		</div>
		<Footer />
	</>
);

export default CafeteriaLayout;
