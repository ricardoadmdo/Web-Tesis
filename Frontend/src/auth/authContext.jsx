import { createContext, useReducer, useEffect } from 'react';
import { authReducer } from './authReducer';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

const init = () => {
	return JSON.parse(localStorage.getItem('user')) || { logged: false };
};

export const AuthProvider = ({ children }) => {
	const [user, dispatch] = useReducer(authReducer, {}, init);

	useEffect(() => {
		if (!user) return;
		localStorage.setItem('user', JSON.stringify(user));
	}, [user]);

	const login = (credentials) => {
		dispatch({
			type: 'login',
			payload: credentials,
		});
	};

	const logout = () => {
		dispatch({ type: 'logout' });
	};

	return <AuthContext.Provider value={{ user, dispatch, login, logout }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
