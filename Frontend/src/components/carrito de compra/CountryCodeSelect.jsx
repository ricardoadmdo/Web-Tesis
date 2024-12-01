import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import './CountryCodeSelect.css'; // Asegúrate de tener el archivo CSS en la misma carpeta

const CountryCodeSelect = () => {
	const [phone, setPhone] = useState('');

	const handlePhoneChange = (value) => {
		setPhone(value);
	};

	return (
		<div className='custom-phone-input-container'>
			<PhoneInput country={'us'} value={phone} onChange={handlePhoneChange} containerStyle={{ width: '70%' }} inputStyle={{ width: '100%' }} />
		</div>
	);
};

export default CountryCodeSelect;
