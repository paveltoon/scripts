var mail = 'adadada@gmail.com';

// Удаление email у персоны

      var updatePersons =  db.persons.update(
        	{	contacts: { $elemMatch: { "value": mail}}
        	},
        	{$set : {"contacts.$.value" : ""}
        	},
        	{ multi: true }
        );

// Удаление email во всех заявках
	
 	var updateClaims =  db.claims.update(
        	{	"personsInfo.0.contacts" : { $elemMatch: { "value": mail}}
        	},
        	{$set : {"personsInfo.0.contacts.$.value" : ""}
        	}, 
        	{ multi: true }
        );
        print("Updated PERSONS: " + updatePersons.nModified + "/" + updatePersons.nMatched + "\n" +
        "Updated CLAIMS: " + updateClaims.nModified + "/" + updateClaims.nMatched);