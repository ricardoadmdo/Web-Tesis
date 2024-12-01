const validar = require('./validar');

describe('validar', () => {
	let formState;
	let operationMode;

	beforeEach(() => {
		formState = {
			nombre: '',
			description: '',
			precio: 0,
			url: '',
			cantidad: 0,
		};
		operationMode = 0;
	});

	test('should return 0 if any field is empty or has invalid value', () => {
		const event = { preventDefault: jest.fn() };

		// Test with empty nombre
		formState.nombre = '';
		expect(validar(event, formState, operationMode)).toBe(0);

		// Test with empty description
		formState.nombre = 'Product';
		formState.description = '';
		expect(validar(event, formState, operationMode)).toBe(0);

		// Test with precio = 0
		formState.description = 'Description';
		formState.precio = 0;
		expect(validar(event, formState, operationMode)).toBe(0);

		// Test with empty url
		formState.precio = 10;
		formState.url = '';
		expect(validar(event, formState, operationMode)).toBe(0);

		// Test with cantidad = 0
		formState.url = 'http://example.com';
		formState.cantidad = 0;
		expect(validar(event, formState, operationMode)).toBe(0);
	});

	test('should return 1 if operationMode is 1', () => {
		const event = { preventDefault: jest.fn() };
		formState = { nombre: 'Product', description: 'Description', precio: 10, url: 'http://example.com', cantidad: 1 };
		operationMode = 1;
		expect(validar(event, formState, operationMode)).toBe(1);
	});

	test('should return 2 if operationMode is 2', () => {
		const event = { preventDefault: jest.fn() };
		formState = { nombre: 'Product', description: 'Description', precio: 10, url: 'http://example.com', cantidad: 1 };
		operationMode = 2;
		expect(validar(event, formState, operationMode)).toBe(2);
	});

	test('should return undefined if operationMode is neither 1 nor 2', () => {
		const event = { preventDefault: jest.fn() };
		formState = { nombre: 'Product', description: 'Description', precio: 10, url: 'http://example.com', cantidad: 1 };
		operationMode = 0; // Or any other value different from 1 and 2
		expect(validar(event, formState, operationMode)).toBeUndefined();
	});
});
