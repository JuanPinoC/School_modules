
conn = new Mongo();
db = conn.getDB('school_modules');

db.actions.insert([
	{
		name: 'Crear Formularios',
		route: '/formEditor/create'
	},
	{ 
		name: 'Ver Formularios',
		route: '/formEditor/find'
	},
	{ 
		name: 'Modificar Formularios',
		route: '/formEditor/update'
	},
	{ 
		name: 'Eliminar Formularios',
		route: '/formEditor/delete'
	},
	{ 
		name: 'Listar Formularios',
		route: '/formEditor'
	},

	{ 
		name: 'Crear Usuarios',
		route: '/user/create'
	},
	{ 
		name: 'Ver Usuarios',
		route: '/user/find'
	},
	{ 
		name: 'Modificar Usuarios',
		route: '/user/update'
	},
	{ 
		name: 'Eliminar Usuarios',
		route: '/user/delete'
	},
	{ 
		name: 'Listar Usuarios',
		route: '/user'
	}
]);