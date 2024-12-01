import Axios from 'axios';

const apiToke = async (currentDate = null) => {
	const apiKey = import.meta.env.VITE_API_TOKE;

	// Si no se proporciona currentDate, usar la fecha de ayer
	const now = currentDate ? new Date(currentDate) : new Date();
	if (!currentDate) {
		now.setDate(now.getDate() - 1);
	}

	// Formatear la fecha adecuadamente
	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const formattedDate = formatDate(now);
	const fromDate = `${formattedDate} 00:00:01`; // Fecha inicial del intervalo de tiempo
	const toDate = `${formattedDate} 23:59:01`; // Fecha final del intervalo de tiempo

	try {
		const response = await Axios.get('http://localhost:5173/api/v1/trmi', {
			params: {
				date_from: fromDate,
				date_to: toDate,
			},
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});
		const { USD } = response.data.tasas;
		return { USD };
	} catch (error) {
		console.error('Error al obtener las tasas de cambio:', error);
		throw error;
	}
};

export default apiToke;
