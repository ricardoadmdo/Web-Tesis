const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config.js');
require('dotenv').config();

//Crear el servidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(
	cors({
		origin: 'http://localhost:5173', // Permitir solicitudes desde este origen
	})
);

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/users', require('./routes/usuarios.js'));
app.use('/api/product', require('./routes/productos.js'));
app.use('/api/cafeteria', require('./routes/cafeterias.js'));
app.use('/api/combo', require('./routes/combos.js'));
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/pago', require('./routes/pago.js'));
app.use('/api/venta', require('./routes/ventas.js'));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log(`Backend corriendo en el puerto: ${process.env.PORT}`);
});
