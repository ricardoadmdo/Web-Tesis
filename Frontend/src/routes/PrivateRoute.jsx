import { useContext } from 'react';
import { AuthContext } from '../auth/authContext.jsx';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
	const { user } = useContext(AuthContext);
	const { pathname, search } = useLocation();

	localStorage.setItem('lastPath', pathname + search);

	return user.logged ? children : <Navigate to='/not-found' />;
};

PrivateRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default PrivateRoute;
