import { useState, useContext, lazy, Suspense } from 'react';
import { CartContext } from '../../auth/CartProvider';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Axios from 'axios';
import Pagination from '../reutilizable-tablaCrud/Pagination';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../ui/LoadingSpinner';
import useExchangeRates from '../../hooks/useExchangeRates';
import ProductSkeleton from '../producto/ProductSkeleton.jsx';
import CustomToast from '../ui/CustomToast.jsx';
const EmptyCombos = lazy(() => import('./EmptyCombos.jsx'));
const ErrorComponent = lazy(() => import('../ui/ErrorComponent.jsx'));

const fetchCombos = async ({ queryKey }) => {
	const [, page, limit] = queryKey;
	const response = await Axios.get(`http://localhost:3001/api/combo?page=${page}&limit=${limit}`);
	return response.data;
};

const Combos = () => {
	const { usdRate } = useExchangeRates();
	const [cantidad, setCantidad] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const { addToCart, showToast, setShowToast } = useContext(CartContext);

	const { data: combosData, isLoading, isError, error } = useFetch(['combos', currentPage, 8], fetchCombos, { keepPreviousData: true });

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < (combosData?.totalPages || 0)) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	const handleChangeCantidad = (uid, value) => {
		setCantidad((prevCantidad) => ({
			...prevCantidad,
			[uid]: parseInt(value, 10),
		}));
	};

	if (isLoading) {
		return (
			<div className='container my-5'>
				<div className='row'>
					{Array.from({ length: 8 }).map((_, index) => (
						<ProductSkeleton key={index} />
					))}
				</div>
			</div>
		);
	}
	if (isError) {
		return (
			<Suspense fallback={<LoadingSpinner />}>
				<ErrorComponent message={error.message} />;
			</Suspense>
		);
	}

	const combosList = combosData?.combos || [];
	const totalPages = combosData?.totalPages || 0;

	return (
		<div className='container animate__animated animate__fadeIn my-5'>
			<div className='row'>
				<h2 className='text-center mb-4'>Combos</h2>
				{combosList.length > 0 ? (
					combosList.map((val) => (
						<div key={val.uid} className='col-sm-6 col-md-4 col-lg-3 mb-3'>
							<div className='card h-100 shadow'>
								<LazyLoadImage
									threshold={10}
									effect='blur'
									src={val.url}
									className='card-img-top img-fluid'
									alt='Imagen del combo'
									style={{ objectFit: 'contain', height: '200px' }}
								/>
								<h3 className='card-header'>{val.nombre}</h3>
								<div className='card-body'>
									{val.cantidad > 0 ? (
										<>
											<strong>
												<p className='card-text'>{val.precio}$ CUP</p>
											</strong>
											<strong>
												<p className='card-text'>{usdRate ? (val.precio / usdRate).toFixed(2) : 'N/A'}$ USD</p>
											</strong>
											<p className='card-text'>{val.description}</p>
											<hr />
											<div className='row align-items-center'>
												<div className='col-6'>
													<input
														type='number'
														className='form-control'
														placeholder='Cantidad'
														min='1'
														value={cantidad[val.uid] || 1}
														onChange={(e) => handleChangeCantidad(val.uid, e.target.value)}
													/>
												</div>
												<div className='col-6'>
													<button
														aria-label='añadir al carrito'
														className='btn btn-outline-success w-100 btn-animated'
														onClick={() => addToCart(val, cantidad[val.uid] || 1)}
													>
														<svg xmlns='http://www.w3.org/2000/svg' width='1.13em' height='1em' viewBox='0 0 576 512'>
															<path
																fill='currentColor'
																d='M0 24C0 10.7 10.7 0 24 0h45.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5l-51.6-271c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24m128 440a48 48 0 1 1 96 0a48 48 0 1 1-96 0m336-48a48 48 0 1 1 0 96a48 48 0 1 1 0-96M252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20v-44h44c11 0 20-9 20-20s-9-20-20-20h-44V96c0-11-9-20-20-20s-20 9-20 20v44h-44c-11 0-20 9-20 20'
															/>
														</svg>
													</button>
												</div>
											</div>
										</>
									) : (
										<div className='text-center'>
											<strong className='text-uppercase' style={{ fontSize: '1.5rem' }}>
												Agotado
											</strong>
										</div>
									)}
								</div>
							</div>
						</div>
					))
				) : (
					<Suspense fallback={<LoadingSpinner />}>
						<EmptyCombos />
					</Suspense>
				)}
			</div>
			<Suspense fallback={<LoadingSpinner />}>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					handlePreviousPage={handlePreviousPage}
					handleNextPage={handleNextPage}
				/>
			</Suspense>
			<CustomToast showToast={showToast} setShowToast={setShowToast} message='Combo agregado' position='bottomCenter' />
		</div>
	);
};

export default Combos;
