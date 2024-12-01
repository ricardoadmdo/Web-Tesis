const NoEncontrado = () => {
	return (
		<div
			className='container-fluid text-center vh-100  animate__animated animate__fadeIn'
			style={{
				backgroundImage: `url(https://res.cloudinary.com/dber1pxea/image/upload/v1718429890/eepyqzqjqlzl6umteojw.jpg)`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				color: 'white',
			}}
		>
			<div className='row h-100'>
				<div className='col d-flex justify-content-center align-items-center flex-column'>
					<h1 className='display-1 font-weight-bold'> Error 404</h1>
					<p className='lead'>Página no encontrada</p>
					<p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
					<a className='btn btn-outline-light' href='/'>
						Volver al inicio
					</a>
				</div>
			</div>
		</div>
	);
};

export default NoEncontrado;
