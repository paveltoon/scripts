db.claims.find({
    "person": {
        $exists: false
    },
    "activationDate": {
        $gte: ISODate("2019-12-01T00:00:00.000+0300")
    },
    "consultation": false,
    "personsInfo": {
        $exists: true
    }
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    if (claim.personsInfo[0] != undefined) {
        var personsInfo = claim.personsInfo[0];
        var person;
        if (personsInfo.type == "JURIDICAL") {
            person = {
                "orgName": personsInfo.orgName,
                "applicantType": personsInfo.type,
            }
        } else {
            person = {
                "surname": personsInfo.surname,
                "firstName": personsInfo.firstName,
                "middleName": personsInfo.middleName,
                "applicantType": personsInfo.type,
                "fio": personsInfo.surname + ' ' + personsInfo.firstName + ' ' + personsInfo.middleName,
            }
        }
        for (var i in person) {
            if (person[i] == undefined) {
                delete person[i];
            }
        }

        //Update & print
        try {
            var upd = db.claims.update({
                "customClaimNumber": ccn
            }, {
                $set: {
                    "person": person,
                    "persons.0": personsInfo._id.valueOf()
                }
            }, {
                multi: true
            });
            print(ccn + ' ' + upd.nModified + ' / ' + upd.nMatched);
        } catch (err) {
            print(ccn + ' ' + err.message)
        }
    }
});