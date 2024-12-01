import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const Cafeteria = () => {
	return (
		<div className='cafeteria-container'>
			<Carousel
				className='cafeteria-carousel'
				interval={null}
				nextIcon={<span className='carousel-control-next-icon' aria-hidden='true'></span>}
				prevIcon={<span className='carousel-control-prev-icon' aria-hidden='true'></span>}
			>
				<Carousel.Item>
					<LazyLoadImage
						threshold={10}
						effect='blur'
						src='https://res.cloudinary.com/dber1pxea/image/upload/v1718041412/i0agcr3wwtibxdhwgoo6.jpg'
						className='d-block w-100'
						alt='First Slide'
					/>
					<Carousel.Caption>
						<h2>Descubre los mejores productos de nuestra cafetería.</h2>
						<h1>Bienvenidos a la Cafetería Ricardo & Neyde</h1>
						<div className='caption-buttons'>
							<Link to='/cafeteria/menu' className='btn btn-light mx-2'>
								Pastas
							</Link>
							<Link to='/cafeteria/menu' className='btn btn-light mx-2'>
								Bebidas
							</Link>
							<Link to='/cafeteria/menu' className='btn btn-light mx-2'>
								Postres
							</Link>
						</div>
					</Carousel.Caption>
				</Carousel.Item>

				<Carousel.Item>
					<LazyLoadImage
						threshold={10}
						effect='blur'
						src='https://res.cloudinary.com/dber1pxea/image/upload/v1720390484/ecwmvqfwy0f7ydpsndlh.jpg'
						className='d-block w-100'
						alt='Second Slide'
					/>
					<Carousel.Caption>
						<h2>Deléitate con nuestras bebidas especiales.</h2>
						<h1>Bebidas Únicas</h1>
						<div className='caption-buttons'>
							<Link to='/cafeteria/menu' className='btn btn-light mx-2'>
								Ver Bebidas
							</Link>
						</div>
					</Carousel.Caption>
				</Carousel.Item>

				<Carousel.Item>
					<LazyLoadImage
						threshold={10}
						effect='blur'
						src='https://res.cloudinary.com/dber1pxea/image/upload/v1720390483/dfmzmyph4ecjmnhb1nfd.jpg'
						className='d-block w-100'
						alt='Third Slide'
					/>
					<Carousel.Caption>
						<h2>No te pierdas nuestros deliciosos postres.</h2>
						<h1>Postres Especiales</h1>
						<div className='caption-buttons'>
							<Link to='/cafeteria/menu' className='btn btn-light mx-2'>
								Ver Postres
							</Link>
						</div>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
		</div>
	);
};

export default Cafeteria;
