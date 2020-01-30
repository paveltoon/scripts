db.claims.find({
    "activationDate": {
        $gte: ISODate("2019-12-20T21:00:00.000+0000"),
        $lte: ISODate("2020-01-06T21:00:00.000+0000")
    },
    "personsInfo": {
        $exists: false
    },
    "persons": {
        $exists: true
    }
}).forEach(function (claim) {
    if (claim.persons[0].length > 24) {
        var ccn = claim.customClaimNumber;
        var personsInfo = [];
        var person = claim.persons[0].substr(0, 8);
        //Find person with regex
        var personFind = db.persons.findOne({
            "_id": new RegExp('^' + person, 'i')
        });
        if (personFind != (undefined && null)) {
            var personId = personFind._id;
            var fullPerson = personFind;
            delete fullPerson._class

            //Add Document Data in personsIinfo
            if (fullPerson.currIdentityDocId != (undefined && null)) {
                var docId;
                fullPerson.currIdentityDocId.length == 24 ? docId = ObjectId(fullPerson.currIdentityDocId) : docId = fullPerson.currIdentityDocId;
                var docFind = db.docs.findOne({
                    "_id": docId
                });
                if (docFind != (undefined && null)) {
                    var fullDoc = docFind;
                    delete fullDoc._class;
                    fullPerson.currIdentityDoc = fullDoc;
                }
            }

            //Add Registration Address in personsIinfo
            if (fullPerson.registrationAddressId != (undefined && null)) {
                var regAddressId;
                fullPerson.registrationAddressId.length == 24 ? regAddressId = ObjectId(fullPerson.registrationAddressId) : regAddressId = fullPerson.registrationAddressId;
                var regAddressFind = db.addresses.findOne({
                    "_id": regAddressId
                });
                if (regAddressFind != (undefined && null)) {
                    var fullRegAddress = regAddressFind;
                    delete fullRegAddress._class;
                    fullPerson.registrationAddress = fullRegAddress;
                }
            }

            //Add person in claim
            var personObj = {
                "surname": fullPerson.surname,
                "firstName": fullPerson.firstName,
                "middleName": fullPerson.middleName,
                "applicantType": fullPerson.type,
                "fio": fullPerson.surname + ' ' + fullPerson.firstName + ' ' + fullPerson.middleName
            }
            for (var j in personObj) {
                if (personObj[j] == undefined) {
                    delete personObj[j];
                }
            }

            //Push personsInfo in Array
            personsInfo.push(fullPerson);

            // Update & print
            var upd = db.claims.update({
                "customClaimNumber": ccn
            }, {
                $set: {
                    "persons.0": personId,
                    "person": personObj,
                    "personsInfo": personsInfo
                }
            }, {
                multi: true
            });
            print(ccn + ' ' + upd.nModified + ' / ' + upd.nMatched);
        }
    }
})