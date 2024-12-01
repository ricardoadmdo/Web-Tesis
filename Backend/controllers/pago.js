const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const createSession = async (req, res) => {
	try {
		const { cartItems, usdRate } = req.body;
		if (!cartItems || cartItems.length === 0) {
			return res.status(400).json({ error: 'No cart items provided' });
		}

		const lineItems = cartItems.map((item) => ({
			price_data: {
				currency: 'usd',
				product_data: {
					name: item.nombre,
					description: item.description ? item.description : 'Sin descripción', // Verifica si la descripción está vacía
				},
				unit_amount: Math.round((item.precio / usdRate) * 100), // Stripe expects the amount in cents
			},
			quantity: item.cantidadAdd,
		}));

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: lineItems,
			mode: 'payment',
			success_url: 'http://localhost:5173/carrito?status=success',
			cancel_url: 'http://localhost:5173/carrito?status=cancel',
		});

		res.json({ url: session.url });
	} catch (error) {
		console.error('Error creating Stripe session:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports = {
	createSession,
};
