import { useContext, useState, useEffect, lazy, Suspense } from 'react';
import { CartContext } from '../../auth/CartProvider';
import { AuthContext } from '../../auth/authContext';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faMapMarkerAlt, faCreditCard, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../ui/LoadingSpinner';
import useExchangeRates from '../../hooks/useExchangeRates';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import municipiosRepartos from '../../helpers/municipiosRepartos';
import AnimatedNumber from '../ui/AnimatedNumber';
const TermsAndConditions = lazy(() => import('./TermsAndConditions'));
const CountryCodeSelect = lazy(() => import('./CountryCodeSelect'));
const EmptyCart = lazy(() => import('./EmptyCart'));

const Carrito = () => {
	const { usdRate } = useExchangeRates();
	const [loading, setLoading] = useState(false);
	const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
	const { user } = useContext(AuthContext);
	const location = useLocation();
	const [countryCode, setCountryCode] = useState('+53'); // Valor predeterminado del código de país
	const [recipient, setRecipient] = useState({
		name: '',
		mobile: '',
		address: '',
		municipio: '',
		nota: '',
		reparto: '',
		termsAccepted: false,
	});

	const registrarVenta = async (tipoPago) => {
		const venta = {
			productos: cart.map((item) => ({
				uid: item.uid,
				nombre: item.nombre,
				cantidad: item.cantidadAdd,
				precio: item.precio,
				precioCosto: item.precioCosto,
				url: item.url,
			})),
			totalProductos: cart.reduce((acc, item) => acc + item.cantidadAdd, 0),
			precioTotal: total,
			fecha: new Date(),
			cliente: {
				nombre: recipient.name,
				telefono: recipient.mobile,
				direccion: recipient.address,
				municipio: recipient.municipio,
				reparto: recipient.reparto,
				nota: recipient.nota,
			},
			tipoPago: tipoPago,
		};

		return ventaMutation.mutateAsync(venta);
	};

	const queryClient = useQueryClient();
	//Función para agregar venta usando Mutation react query
	const ventaMutation = useMutation({
		mutationFn: (newVenta) => Axios.post('http://localhost:3001/api/venta', newVenta),
		onSuccess: () => {
			queryClient.invalidateQueries('productos'); // Refrescar la lista de productos si es necesario
			Swal.fire({
				title: '<strong>Venta registrada con éxito!</strong>',
				html: '<i>La venta fue registrada exitosamente</i>',
				icon: 'success',
				timer: 3000,
			});
		},
		onError: (error) => {
			Swal.fire({
				icon: 'error',
				title: 'Error al registrar la venta',
				text: error.response?.data?.error || 'Error desconocido al registrar la venta',
			});
		},
	});

	// Calcula el total general de la compra
	const total = cart.reduce((acc, val) => acc + val.precio * val.cantidadAdd, 0);

	// Función para actualizar la cantidad de un producto en el carrito
	const changeQuantity = (id, delta) => {
		updateQuantity(id, delta);
	};

	const handleInputChange = (e) => {
		const { name, value, checked, type } = e.target;
		setRecipient({
			...recipient,
			[name]: type === 'checkbox' ? checked : value,
		});
		if (name === 'municipio') {
			setRecipient({ ...recipient, municipio: value, reparto: '' });
		}
	};

	const handleCountryCodeChange = (event) => {
		setCountryCode(event.target.value);
	};

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const status = query.get('status');

		if (status === 'success') {
			Swal.fire({
				title: 'Compra Satisfactoria',
				text: 'Gracias por comprar en Ricardo & Neyde',
				icon: 'success',
			});
			clearCart();
		} else if (status === 'cancel') {
			Swal.fire({
				title: 'Compra Cancelada',
				text: 'Su compra ha sido cancelada.',
				icon: 'error',
			});
		}
	}, [location]);

	const finalizeOrder = async () => {
		if (!user.logged) {
			Swal.fire({ title: 'Inicia Sesión', text: 'No has iniciado sesión!', icon: 'warning' });
			return;
		}

		if (
			!recipient.name ||
			!recipient.mobile ||
			!recipient.address ||
			!recipient.municipio ||
			!recipient.reparto ||
			!recipient.termsAccepted
		) {
			Swal.fire({
				title: 'Formulario Incompleto',
				text: 'Por favor, completa todos los campos y acepta los términos y condiciones.',
				icon: 'error',
			});
			return;
		}

		try {
			await registrarVenta('presencial');
			Swal.fire({
				title: 'Compra Satisfactoria',
				text: 'Gracias por comprar en Ricardo & Neyde',
				icon: 'success',
			}).then(() => {
				setRecipient({
					name: '',
					mobile: '',
					address: '',
					municipio: '',
					nota: '',
					reparto: '',
					termsAccepted: false,
				});
				clearCart();
			});
		} catch (error) {
			Swal.fire({
				title: 'Error',
				text: 'Ha ocurrido un error con su compra',
				icon: 'error',
			});
			console.error('Error en el registro de la venta:', error.response?.data || error.message || error);
		}
	};

	const pagoOnline = async () => {
		setLoading(true);

		if (cart.length === 0) {
			Swal.fire({ title: 'El carrito está vacío', text: 'Añada elementos a su compra', icon: 'warning' });
			setLoading(false);
			return;
		}

		if (
			!recipient.name ||
			!recipient.mobile ||
			!recipient.address ||
			!recipient.municipio ||
			!recipient.reparto ||
			!recipient.termsAccepted
		) {
			Swal.fire({
				title: 'Formulario Incompleto',
				text: 'Por favor, completa todos los campos y acepta los términos y condiciones.',
				icon: 'error',
			});
			setLoading(false);
			return;
		}

		try {
			// Crear datos para enviar al backend
			const requestData = {
				cartItems: cart.map((item) => ({
					uid: item.uid,
					nombre: item.nombre,
					cantidadAdd: item.cantidadAdd,
					precio: item.precio,
					description: item.description, // Agrega esta línea si tienes descripciones
				})),
				usdRate,
			};

			// Llamar a la API para crear la sesión de pago
			const { data } = await Axios.post('http://localhost:3001/api/pago/create-checkout-session', requestData);

			// Redirigir al usuario a la URL de Stripe Checkout
			window.location.href = data.url;
		} catch (error) {
			Swal.fire({
				title: 'Error',
				text: 'No se pudo iniciar el proceso de pago en línea.',
				icon: 'error',
			});
			console.error('Error en Stripe Checkout:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className='container my-5 '>
						<div className='row'>
							{cart.length === 0 ? (
								<Suspense fallback={<LoadingSpinner />}>
									<EmptyCart />
								</Suspense>
							) : (
								<div className='col-lg-8 animate__animated animate__fadeIn'>
									<div className='row'>
										{cart.map((val) => (
											<div key={val.uid} className='col-sm-6 col-md-4 col-lg-4 mb-3'>
												<div className='card h-100 shadow'>
													<img
														src={val.url}
														className='card-img-top img-fluid'
														alt={val.nombre}
														style={{ height: '200px', objectFit: 'cover' }}
													/>
													<h5 className='card-header'>{val.nombre}</h5>
													<div className='card-body'>
														<div className='card-text'>
															<strong>
																<p className='card-text'>{val.precio}$ CUP</p>
															</strong>
															<strong>
																<p className='card-text'>
																	{usdRate
																		? Math.round((val.precio / usdRate) * 10) / 10
																		: 'N/A'}
																	$ USD
																</p>
															</strong>
														</div>
														<div className='card-text'>
															<strong className='me-1'>Cantidad a comprar:</strong>
															<div className='animated-number-container me-1'>
																<AnimatedNumber value={val.cantidadAdd} />
															</div>
														</div>

														<div className='card-text'>
															<strong className='me-1'>Subtotal:</strong>
															<div className='animated-number-container me-1'>
																<AnimatedNumber value={val.precio * val.cantidadAdd} />
															</div>
															CUP
														</div>
														<div className='card-text'>
															<strong className='me-1'>Subtotal:</strong>
															<div className='animated-number-container me-1'>
																{usdRate ? (
																	<AnimatedNumber
																		value={Number(
																			(
																				(val.precio * val.cantidadAdd) /
																				usdRate
																			).toFixed(2)
																		)}
																	/>
																) : (
																	'N/A'
																)}
															</div>
															USD
														</div>
														<hr />
														<div className='row align-items-center'>
															<div className='col-2'>
																<button
																	className='btn btn-danger'
																	onClick={() => {
																		if (val.cantidadAdd <= 1) {
																			removeFromCart(val.uid);
																		} else {
																			changeQuantity(val.uid, -1);
																		}
																	}}
																>
																	{val.cantidadAdd <= 1 ? (
																		<FontAwesomeIcon icon={faTrashAlt} />
																	) : (
																		<FontAwesomeIcon icon={faMinus} />
																	)}
																</button>
															</div>
															<div className='col-4'>
																<button
																	className='btn btn-secondary'
																	onClick={() => changeQuantity(val.uid, 1)}
																>
																	<FontAwesomeIcon icon={faPlus} />
																</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{cart.length > 0 && (
								<div className='col-lg-4'>
									<div className='card p-3 mb-2'>
										<div className='text-center mb-3'>
											<h5>Valor Total de la Compra</h5>
										</div>
										<div className='d-flex justify-content-between align-items-center'>
											<div>
												<h5>Total CUP: </h5>
											</div>
											<div>
												<h5>
													$
													<div className='animated-number-container me-1'>
														<AnimatedNumber value={total} />
													</div>
													CUP
												</h5>
											</div>
										</div>
										<div className='d-flex justify-content-between align-items-center'>
											<div>
												<h5>Total USD:</h5>
											</div>
											<div>
												<h5>
													$
													{usdRate ? (
														<div className='animated-number-container me-1'>
															<AnimatedNumber
																value={Number((total / usdRate).toFixed(2))}
															/>
														</div>
													) : (
														'N/A'
													)}
													USD
												</h5>
											</div>
										</div>
									</div>

									<form>
										<div className='mb-3'>
											<input
												type='text'
												className='form-control'
												name='name'
												placeholder='Nombre y apellidos del receptor'
												value={recipient.name}
												onChange={handleInputChange}
												required
											/>
										</div>
										<div className='mb-3 d-flex'>
											<Suspense fallback={<LoadingSpinner />}>
												<CountryCodeSelect
													value={countryCode}
													onChange={handleCountryCodeChange}
												/>
											</Suspense>
											<input
												type='number'
												className='form-control'
												name='mobile'
												placeholder='Teléfono móvil'
												value={recipient.mobile}
												onChange={handleInputChange}
												required
											/>
										</div>
										<div className='mb-3'>
											<input
												type='text'
												className='form-control'
												name='address'
												placeholder='Dirección exacta'
												value={recipient.address}
												onChange={handleInputChange}
												required
											/>
										</div>
										<div className='mb-3'>
											<select
												className='form-control'
												name='municipio'
												value={recipient.municipio}
												onChange={handleInputChange}
												required
											>
												<option value=''>Seleccione un municipio</option>
												{Object.keys(municipiosRepartos).map((municipio) => (
													<option key={municipio} value={municipio}>
														{municipio}
													</option>
												))}
											</select>
										</div>
										<div className='mb-3'>
											<select
												className='form-control'
												name='reparto'
												value={recipient.reparto}
												onChange={handleInputChange}
												required
												disabled={!recipient.municipio}
											>
												<option value=''>Seleccione el barrio</option>
												{recipient.municipio &&
													municipiosRepartos[recipient.municipio].map((reparto) => (
														<option key={reparto} value={reparto}>
															{reparto}
														</option>
													))}
											</select>
										</div>
										<div className='mb-3'>
											<input
												type='text'
												className='form-control'
												name='nota'
												placeholder='Escribe alguna nota para el mensajero..'
												value={recipient.nota}
												onChange={handleInputChange}
												required
											/>
										</div>
										<div className='form-check mb-4'>
											<input
												type='checkbox'
												className='form-check-input'
												name='termsAccepted'
												checked={recipient.termsAccepted}
												id='termsAccepted'
												onChange={handleInputChange}
												required
											/>
											<label className='form-check-label me-3' htmlFor='termsAccepted'>
												Acepto Términos y Condiciones.
											</label>
											<button
												type='button'
												className='btn btn-link p-0'
												data-toggle='modal'
												data-target='#termsModal'
											>
												Ver Términos
											</button>
										</div>

										<div
											className='modal fade'
											id='termsModal'
											tabIndex='-1'
											role='dialog'
											aria-labelledby='termsModalLabel'
											aria-hidden='true'
										>
											<div className='modal-dialog' role='document'>
												<div className='modal-content'>
													<div className='modal-header'>
														<h5 className='modal-title' id='termsModalLabel'>
															Términos y Condiciones
														</h5>
														<button
															type='button'
															className='close'
															data-dismiss='modal'
															aria-label='Close'
														>
															<span aria-hidden='true'> &times;</span>
														</button>
													</div>
													<div className='modal-body'>
														<Suspense fallback={<LoadingSpinner />}>
															<TermsAndConditions />
														</Suspense>
													</div>

													<div className='modal-footer'>
														<button
															type='button'
															className='btn btn-secondary'
															data-dismiss='modal'
														>
															Cerrar
														</button>
													</div>
												</div>
											</div>
										</div>
										<div className='d-grid gap-2'>
											<button
												type='button'
												className='btn btn-outline-dark btn-lg custom-button'
												onClick={finalizeOrder}
											>
												<FontAwesomeIcon icon={faMapMarkerAlt} /> Pago Presencial
											</button>
											<button
												type='button'
												className='btn btn-outline-dark btn-lg custom-button mt-2'
												onClick={pagoOnline}
											>
												<FontAwesomeIcon icon={faCreditCard} /> Pago con Tarjeta
											</button>
											<hr />
											<button type='button' className='btn btn-dark mt-3' onClick={clearCart}>
												<FontAwesomeIcon icon={faTrashAlt} /> Limpiar Carrito
											</button>
										</div>
									</form>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Carrito;
