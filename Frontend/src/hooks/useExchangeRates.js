import { useContext } from 'react';
import ExchangeRatesContext from '../auth/ExchangeRatesContext';

const useExchangeRates = () => {
	return useContext(ExchangeRatesContext);
};

export default useExchangeRates;
