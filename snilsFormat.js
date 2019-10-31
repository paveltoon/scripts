var count = 0;
var cursor = db.claims.find({
    "personsInfo.0.snils": {
        $exists: true
    },
    $or: [{
            "personsInfo.0.snils": /.* .*/i
        }, {
            "personsInfo.0.snils": /.*-.*/i
        }
    ]
});
	
cursor.forEach(function (claim){
   	var ccn = claim.customClaimNumber;
   
    var persId =   claim.personsInfo[0]._id;

    var actualSnils = claim.personsInfo[0].snils.trim();
    var prettySnils = actualSnils.split(' ').join('');
    var veryPrettySnils = prettySnils.split('-').join('');
    
    // Обновление СНИЛС в заявке
	var upd = db.claims.update(
	    { "customClaimNumber": ccn },
	    { $set: {
            "personsInfo.0.snils": veryPrettySnils
            } 
	    },
	    { multi:true }
    );

    // Обновление СНИЛС в персоне
     var pers = db.persons.update(
        {"_id" : persId},
        {$set: {
            "snils": veryPrettySnils
            }
        },
        {multi : true}
    );
        
	print(ccn + ' snils: ' + veryPrettySnils + " Updated CLAIMS: " + upd.nModified + "/" + upd.nMatched + " Updated PERSON: " + pers.nModified + "/" + pers.nMatched );
	count++;
});
print('Claims updated: ' + count);