import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const LoginScreen = lazy(() => import('../components/login/LoginScreen'));
const RegisterScreen = lazy(() => import('../components/login/RegisterScreen'));
const Bienvenida = lazy(() => import('../components/ui/Bienvenida'));
const Productos = lazy(() => import('../components/producto/Productos'));
const Carrito = lazy(() => import('../components/carrito de compra/Carrito'));
const Combos = lazy(() => import('../components/combos/Combos'));
const Busqueda = lazy(() => import('../components/ui/Busqueda'));
const VerificationScreen = lazy(() => import('../components/login/VerificationScreen'));
const NoEncontrado = lazy(() => import('../components/NoEncontrado.jsx'));
const Cafeteria = lazy(() => import('../components/cafeteria/Cafeteria.jsx'));
const ReporteVentas = lazy(() => import('../components/ventas/ReporteVentas.jsx'));
const Menu = lazy(() => import('../components/cafeteria/Menu.jsx'));
const CafBusqueda = lazy(() => import('../components/cafeteria/ui/CafBusqueda.jsx'));
const CRUDCafeteria = lazy(() => import('../components/cafeteria/CRUDCafeteria.jsx'));
const UserProfile = lazy(() => import('../components/ui/UserProfile.jsx'));
import MainLayout from './MainLayout';
import CafeteriaLayout from './CafeteriaLayout';
import AdminRoute from './AdminRoute';
import PrivateRoute from './PrivateRoute';
import DashboardRoutes from './DashboardRoutes.jsx';
import ProductSkeleton from '../components/producto/ProductSkeleton.jsx';
import TableSkeleton from '../components/ui/TableSkeleton.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { Spinner } from 'react-bootstrap';

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* Rutas de la Tienda */}
				<Route path='/' element={<MainLayout />}>
					<Route
						index
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<Bienvenida />
							</Suspense>
						}
					/>
					<Route
						path='register'
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<RegisterScreen />
							</Suspense>
						}
					/>
					<Route
						path='login'
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<LoginScreen />
							</Suspense>
						}
					/>

					<Route
						path='productos'
						element={
							<Suspense fallback={<ProductSkeleton />}>
								<Productos />
							</Suspense>
						}
					/>
					<Route
						path='carrito'
						element={
							<Suspense fallback={<ProductSkeleton />}>
								<Carrito />
							</Suspense>
						}
					/>
					<Route
						path='combos'
						element={
							<Suspense fallback={<ProductSkeleton />}>
								<Combos />
							</Suspense>
						}
					/>

					<Route
						path='busqueda'
						element={
							<Suspense fallback={<ProductSkeleton />}>
								<Busqueda />
							</Suspense>
						}
					/>

					<Route
						path='verify-code'
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<VerificationScreen />
							</Suspense>
						}
					/>
					<Route
						path='dashboard/*'
						element={
							<PrivateRoute>
								<DashboardRoutes />
							</PrivateRoute>
						}
					/>

					<Route
						path='userprofile'
						element={
							<PrivateRoute>
								<Suspense fallback={<Spinner />}>
									<UserProfile />
								</Suspense>
							</PrivateRoute>
						}
					/>

					{/* Ruta 404 */}
					<Route
						path='*'
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<NoEncontrado />
							</Suspense>
						}
					/>
				</Route>

				{/* Rutas de la Cafeteria */}
				<Route path='/cafeteria/*' element={<CafeteriaLayout />}>
					<Route
						index
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<Cafeteria />
							</Suspense>
						}
					/>
					<Route
						path='menu'
						element={
							<Suspense fallback={<ProductSkeleton />}>
								<Menu />
							</Suspense>
						}
					/>
					<Route
						path='cafBusqueda'
						element={
							<Suspense fallback={<ProductSkeleton />}>
								<CafBusqueda />
							</Suspense>
						}
					/>
					<Route
						path='reporte-ventas'
						element={
							<PrivateRoute>
								<AdminRoute>
									<Suspense fallback={<LoadingSpinner />}>
										<ReporteVentas />
									</Suspense>
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path='gestionar-cafeteria'
						element={
							<PrivateRoute>
								<AdminRoute>
									<Suspense fallback={<TableSkeleton />}>
										<CRUDCafeteria />
									</Suspense>
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path='userprofile'
						element={
							<PrivateRoute>
								<Suspense fallback={<Spinner />}>
									<UserProfile />
								</Suspense>
							</PrivateRoute>
						}
					/>

					{/* Ruta 404 */}
					<Route
						path='*'
						element={
							<Suspense fallback={<LoadingSpinner />}>
								<NoEncontrado />
							</Suspense>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
