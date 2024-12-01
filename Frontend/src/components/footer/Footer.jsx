import { FaWhatsapp, FaFacebook, FaInstagram, FaShareAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
	const year = new Date().getFullYear();
	const shareUrl = window.location.href;

	const handleShare = () => {
		if (navigator.share) {
			navigator
				.share({
					title: 'Ricardo & Neyde',
					text: 'Descripción breve de tu web',
					url: shareUrl,
				})
				.then(() => {
					console.log('Compartido con éxito');
				})
				.catch((error) => {
					console.log('Error al compartir:', error);
				});
		} else {
			alert('El navegador no soporta la función de compartir');
		}
	};

	return (
		<footer className='footer bg-dark'>
			<div className='container'>
				<h2 className='footer-title'>Contacto</h2>
				<div className='social-icons'>
					<a href='https://wa.me/+5358175289' target='_blank' rel='noopener noreferrer'>
						<FaWhatsapp size={30} className='icon whatsapp' />
						<span>Whatsapp</span>
					</a>
					<a href='https://www.facebook.com/ricardo.descoubet.1' target='_blank' rel='noopener noreferrer'>
						<FaFacebook size={30} className='icon facebook' />
						<span>Facebook</span>
					</a>
					<a href='https://www.instagram.com/ricardoluisdescoubetbravo' target='_blank' rel='noopener noreferrer'>
						<FaInstagram size={30} className='icon instagram' />
						<span>Instagram</span>
					</a>
					<button className='icon' onClick={handleShare}>
						<FaShareAlt size={30} />
						<span>Compartir</span>
					</button>
				</div>
				<div className='legal'>
					<span>&copy; {year} Ricardo & Neyde. Todos los derechos reservados.</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
