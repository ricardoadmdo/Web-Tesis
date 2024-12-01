const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosBuscar } = require('../controllers/usuarios');
const router = Router();

router.get('/', usuariosGet);
router.get('/search', usuariosBuscar);

router.post(
	'/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'El password debe ser de mas de 6 letras').isLength({
			min: 6,
		}),
		check('correo', 'El correo no es valido').isEmail(),
		check('correo').custom(emailExiste),
		// check('rol', 'No es un rol permitido').isIn([
		// 	'ADMIN_ROLE',
		// 	'USER_ROLE',
		// ]),
		check('rol').custom(esRoleValido),
		validarCampos,
	],
	usuariosPost
);

router.put(
	'/:id',
	[
		check('id', 'No es un ID válido de Mongo').isMongoId(),
		check('id').custom(existeUsuarioPorId),
		check('rol').custom(esRoleValido),
		validarCampos,
	],
	usuariosPut
);

router.delete(
	'/:id',
	[
		validarJWT,
		// esAdminRole, //Middleware para que se permita solo si es ADMIN
		tieneRole('ADMIN_ROLE'), //Middleware para permitir el rol especificado
		check('id', 'No es un ID válido de Mongo').isMongoId(),
		check('id').custom(existeUsuarioPorId),
		validarCampos,
	],
	usuariosDelete
);

module.exports = router;
