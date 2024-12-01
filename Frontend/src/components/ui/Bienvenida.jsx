import { Link } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import { Carousel, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './Bienvenida.css';

const BusinessStatus = lazy(() => import('./BusinessStatus'));

const Bienvenida = () => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<div className='bienvenida-container'>
			<Carousel
				className='bienvenida-carousel'
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
						<h2>Explora nuestra selección exclusiva de productos y combos de comida en La Habana.</h2>
						<h1>Bienvenidos a Ricardo & Neyde</h1>
						<div className='caption-buttons'>
							<Link to='/productos' className='btn btn-light mx-2'>
								Ver Productos
							</Link>
							<Link to='/combos' className='btn btn-light mx-2'>
								Ver Combos
							</Link>
							<Link to='/cafeteria' className='btn btn-light mx-2'>
								Ir a la Cafetería
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
						alt='Second Slide'
					/>
					<Carousel.Caption>
						<h2>Descubre nuestra amplia gama de productos seleccionados con la mayor calidad.</h2>
						<h1>Explora Nuestros Productos</h1>
						<div className='caption-buttons'>
							<Link to='/productos' className='btn btn-light mx-2'>
								Ver Productos
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
						<h2>Prueba nuestros irresistibles combos, perfectos para cualquier ocasión.</h2>
						<h1>Combos Especiales</h1>
						<div className='caption-buttons'>
							<Link to='/combos' className='btn btn-light mx-2'>
								Ver Combos
							</Link>
						</div>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<LazyLoadImage
						threshold={10}
						effect='blur'
						src='https://res.cloudinary.com/dber1pxea/image/upload/v1718041269/ota6mfg9z7yz6uyh9adz.jpg'
						className='d-block w-100'
						alt='Fourth Slide'
					/>
					<Carousel.Caption>
						<h2>Disfruta de la mejor comida en Ricardo & Neyde Cafetería.</h2>
						<h1>Visita nuestra Cafetería</h1>
						<div className='caption-buttons'>
							<Link to='/cafeteria' className='btn btn-light mx-2'>
								Ir a la Cafetería
							</Link>
						</div>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
			<div className='reloj-container'>
				<Button variant='outline-light' onClick={handleShow}>
					<FontAwesomeIcon icon={faClock} size='2x' />
				</Button>
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton className='bg-dark'>
						<Modal.Title style={{ color: 'white' }}>Estado del Negocio</Modal.Title>
					</Modal.Header>
					<Modal.Body className='bg-dark'>
						<Suspense fallback={<span>Loading...</span>}>
							<BusinessStatus />
						</Suspense>
					</Modal.Body>
					<Modal.Footer className='bg-dark'>
						<Button variant='secondary' onClick={handleClose}>
							Cerrar
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	);
};

export default Bienvenida;
