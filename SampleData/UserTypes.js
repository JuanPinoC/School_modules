
conn = new Mongo();
db = conn.getDB('school_modules');


db.userTypes.insert([
	{
		name: 'Administrador',
		rules:  [
			ObjectId("5e34cc9e36de7367c4e0c0b5"),
			ObjectId("5e34cc9e36de7367c4e0c0b6"),
			ObjectId("5e34cc9e36de7367c4e0c0b7"),
			ObjectId("5e34cc9e36de7367c4e0c0b8"),
			ObjectId("5e34cc9e36de7367c4e0c0b9"),
			ObjectId("5e34cc9e36de7367c4e0c0ba"),
			ObjectId("5e34cc9e36de7367c4e0c0bb"),
			ObjectId("5e34cc9e36de7367c4e0c0bc"),
			ObjectId("5e34cc9e36de7367c4e0c0bd"),
			ObjectId("5e34cc9e36de7367c4e0c0be")
		]
	},
	{
		name: 'Evaluador',
		rules: []
	},
	{
		name: 'Empleado',
		rules: []
	}
]);
