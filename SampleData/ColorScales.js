
conn = new Mongo();
db = conn.getDB('school_modules');

db.actions.insert([
	{
		name:	'Valoración de Desempeño',
		items:  [
					{
						label: 'Cumple las expectativas',
						Max: 20,
						Min: 18,
						color: '#042d6e'
					},
					{
						label: 'Cumple la mayoría de las expectativas',
						Max: 17,
						Min: 13,
						color: '#00ba54'
					},
					{
						label: 'Cumple parcialmente las expectativas',
						Max: 12,
						Min: 6,
						color: '#ffea00'
					},
					{
						label: 'No cumple las expectativas',
						Max: 5,
						Min: 1,
						color: '#ff0000'
					}
		]
	}
]);