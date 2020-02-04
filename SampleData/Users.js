
conn = new Mongo();
db = conn.getDB('school_modules');


db.users.insert([
	{
		name:	'Anna Pacheco',
		type:	ObjectId("5e34cd1ece291291636436f8"),
		email:	'apacheco@gmail.com',
		password: ''
	},
	{
		name:	'Bruno Lopez',
		type:	ObjectId("5e34cd1ece291291636436f9"),
		email:	'blopez@gmail.com',
		password: ''
	},
	{
		name:	'Carlos Delgado',
		type:	ObjectId("5e34cd1ece291291636436fa"),
		email:	'cdelgado@gmail.com',
		password: ''
	}
]);
