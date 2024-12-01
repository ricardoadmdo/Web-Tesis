const validar = (event, formState, operationMode) => {
	const { nombre, description, precio, url, cantidad } = formState;
	if (nombre.trim() === '' || description.trim() === '' || precio === 0 || url.trim() === '' || cantidad === 0) {
		return 0;
	} else {
		if (operationMode === 1) {
			return 1;
		}
		if (operationMode === 2) {
			return 2;
		}
	}
};

module.exports = validar;
