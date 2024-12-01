import { useState, useContext, Suspense, lazy } from 'react';
import { CartContext } from '../../auth/CartProvider';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Axios from 'axios';
import useFetch from '../../hooks/useFetch';
import ProductSkeleton from '../producto/ProductSkeleton';
import useExchangeRates from '../../hooks/useExchangeRates';
import Categorias from './Categorias';
import EmptyProducts from '../producto/EmptyProducts';
import CustomToast from '../ui/CustomToast';
import LoadingSpinner from '../ui/LoadingSpinner';
const Pagination = lazy(() => import('../reutilizable-tablaCrud/Pagination'));

const fetchCafeteriaProductos = async ({ queryKey }) => {
	const [, page, limit] = queryKey;
	const response = await Axios.get(`http://localhost:3001/api/cafeteria?page=${page}&limit=${limit}`);
	return response.data;
};

const Menu = () => {
	const { usdRate } = useExchangeRates();
	const [cantidad, setCantidad] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const { addToCart, setShowToast, showToast } = useContext(CartContext);
	const [selectedCategory, setSelectedCategory] = useState(null);

	const {
		data: productosData,
		isLoading,
		isError,
		error,
	} = useFetch(['productos', currentPage, 8], fetchCafeteriaProductos, { keepPreviousData: true });

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < (productosData?.totalPages || 0)) {
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	if (isLoading) {
		return <ProductSkeleton />;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	const productosList = productosData?.productos || [];
	const totalPages = productosData?.totalPages || 0;

	return (
		<div className='container animate__animated animate__fadeIn my-5'>
			<div className='row'>
				<div className='row'>
					<div className='col-12 col-md-3'>
						<h4>Filtrar por categoría:</h4>
						<select className='form-select mb-3' value={selectedCategory || ''} onChange={(e) => setSelectedCategory(e.target.value)}>
							<option value=''>Todas las categorías</option>
							{Categorias.map((categoria) => (
								<option key={categoria.value} value={categoria.value}>
									{categoria.label}
								</option>
							))}
						</select>
					</div>
				</div>
				{productosList.length > 0 ? (
					productosList
						.filter((producto) => !selectedCategory || producto.categoria === selectedCategory)
						.map((val) => (
							<div key={val.uid} className='col-sm-6 col-md-4 col-lg-3 mb-3'>
								<div className='card h-100 shadow'>
									<LazyLoadImage
										threshold={10}
										effect='blur'
										src={val.url}
										className='card-img-top img-fluid'
										alt='Imagen del producto'
										style={{ objectFit: 'cover', height: '200px' }}
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
												<hr />
												<p className='card-text'>{val.categoria}</p>
												<div className='row align-items-center'>
													<div className='col-6'>
														<input
															type='number'
															className='form-control'
															placeholder='Cantidad'
															min='1'
															defaultValue='1'
															onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
														/>
													</div>
													<div className='col-6'>
														<button
															aria-label='añadir al carrito'
															className='btn btn-outline-success w-100 btn-animated'
															onClick={() => addToCart(val, cantidad)}
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
												<strong className='text-uppercase text-center' style={{ fontSize: '1.5rem' }}>
													Agotado
												</strong>
											</div>
										)}
									</div>
								</div>
							</div>
						))
				) : (
					<div className='text-center'>
						<EmptyProducts />
					</div>
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
			<CustomToast showToast={showToast} setShowToast={setShowToast} message='Producto agregado' position='bottomCenter' />
		</div>
	);
};

export default Menu;
