import { createContext, useState, useEffect } from 'react';
import apiToke from '../helpers/apiToke'; // Asegúrate de que la ruta sea correcta
import PropTypes from 'prop-types';

const ExchangeRatesContext = createContext();

export const ExchangeRatesProvider = ({ children }) => {
	const [usdRate, setUsdRate] = useState(() => {
		// Intenta recuperar la tasa de cambio del sessionStorage al inicializar
		const savedRate = sessionStorage.getItem('usdRate');
		return savedRate ? Number(savedRate) : null;
	});

	useEffect(() => {
		const obtenerTasas = async () => {
			if (usdRate === null) {
				try {
					const currentDate = new Date(); // Obtiene la fecha y hora actual en la zona horaria local
					const year = currentDate.getFullYear(); // Obtiene el año actual
					const month = currentDate.getMonth() + 1; // Obtiene el mes actual (los meses son indexados desde 0)
					const day = currentDate.getDate(); // Obtiene el día del mes actual

					// Formatea la fecha en formato YYYY-MM-DD
					const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
					const { USD } = await apiToke(formattedDate); // Llama a la función para obtener las tasas de cambio
					const usdRateNumber = Number(USD);

					if (!isNaN(usdRateNumber)) {
						setUsdRate(usdRateNumber);
						sessionStorage.setItem('usdRate', usdRateNumber); // Guarda la tasa en sessionStorage
					}
				} catch (error) {
					console.error('Error al obtener las tasas de cambio:', error);
				}
			}
		};

		obtenerTasas();
	}, [usdRate]);

	return <ExchangeRatesContext.Provider value={{ usdRate }}>{children}</ExchangeRatesContext.Provider>;
};

ExchangeRatesProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ExchangeRatesContext;
