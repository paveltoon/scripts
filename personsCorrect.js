var pes = {
    "P001-6707623780-32203939": "5b98e044a78efb5287e14ea7"
}

var thisClaim = Object.keys(pes);

for (var i in thisClaim) {
    var persId;
    pes[thisClaim[i]].length == 24 ? persId = ObjectId(pes[thisClaim[i]]) : persId = pes[thisClaim[i]]
    var ccn = thisClaim[i];

    var personsInfo = [];

    //Find person
    var personFind = db.persons.findOne({
        "_id": persId
    });
    if (personFind != (undefined && null)) {
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

        //Add Location Address in personsIinfo
        if (fullPerson.locationAddressId != (undefined && null)) {
            var locAddressId;
            fullPerson.locationAddressId.length == 24 ? locAddressId = ObjectId(fullPerson.locationAddressId) : locAddressId = fullPerson.locationAddressId;
            var locAddressFind = db.addresses.findOne({
                "_id": locAddressId
            });
            if (locAddressFind != (undefined && null)) {
                var fullLocAddress = locAddressFind;
                delete fullLocAddress._class;
                fullPerson.locationAddress = fullLocAddress;
            }
        }

        //Add Work Address in personsIinfo
        if (fullPerson.ipWorkPlaceAddressId != (undefined && null)) {
            var workAddressId;
            fullPerson.ipWorkPlaceAddressId.length == 24 ? workAddressId = ObjectId(fullPerson.ipWorkPlaceAddressId) : workAddressId = fullPerson.ipWorkPlaceAddressId;
            var workAddressFind = db.addresses.findOne({
                "_id": workAddressId
            });
            if (workAddressFind != (undefined && null)) {
                var fullWorkAddress = workAddressFind;
                delete fullWorkAddress._class;
                fullPerson.ipWorkPlaceAddress = fullWorkAddress;
            }
        }


        //Add person in claim
        var personObj
        if (fullPerson.type == "JURIDICAL") {
            personObj = {
                "applicantType": fullPerson.type,
                "orgName": fullPerson.orgName
            }
        } else {
            personObj = {
                "surname": fullPerson.surname,
                "firstName": fullPerson.firstName,
                "middleName": fullPerson.middleName,
                "applicantType": fullPerson.type,
                "fio": fullPerson.surname + ' ' + fullPerson.firstName + ' ' + fullPerson.middleName
            }
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
                "persons.0": pes[thisClaim[i]],
                "person": personObj,
                "personsInfo": personsInfo
            }
        }, {
            multi: true
        });
        print(ccn + ' ' + upd.nModified + ' / ' + upd.nMatched);
    }
}