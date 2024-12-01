import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [showToast, setShowToast] = useState(false);
	const [cart, setCart] = useState(() => {
		const localCart = localStorage.getItem('cart');
		return localCart ? JSON.parse(localCart) : [];
	});

	const removeFromCart = (productId) => {
		setCart(cart.filter((item) => item.uid !== productId));
	};

	const clearCart = () => {
		setCart([]);
	};

	const updateQuantity = (id, delta) => {
		setCart((currentCart) => {
			return currentCart.map((item) => {
				if (item.uid === id) {
					const newQuantity = item.cantidadAdd + delta >= 1 ? item.cantidadAdd + delta : 1;
					return { ...item, cantidadAdd: newQuantity };
				}
				return item;
			});
		});
	};

	const addToCart = (producto, cantidadAdd) => {
		const productoToAdd = { ...producto };
		const existeProductoIndex = cart.findIndex((item) => item.uid === productoToAdd.uid);
		if (existeProductoIndex !== -1) {
			const updatedCart = cart.map((item, index) => {
				if (index === existeProductoIndex) {
					return { ...item, cantidadAdd: item.cantidadAdd + Number(cantidadAdd) };
				}
				return item;
			});
			setCart(updatedCart);
		} else {
			setCart([...cart, { ...productoToAdd, cantidadAdd: Number(cantidadAdd) }]);
		}
		setShowToast(true);
	};

	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));
	}, [cart]);

	return (
		<CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, setShowToast, showToast }}>
			{children}
		</CartContext.Provider>
	);
};

CartProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
