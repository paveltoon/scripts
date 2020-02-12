db.claims.find({
    "claimCreate": {
        $gte: ISODate("2019-12-21T00:00:00.000+0300"),
        $lte: ISODate("2020-01-10T00:00:00.000+0300")
    },
    "consultation": false,
    "oktmo": {
        $ne: "99999999"
    },
    "personsInfo.currIdentityDoc.serial": {
        $exists: false
    },
    "personsInfo.type": "PHYSICAL"
}).limit(500).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var origId = claim._id;

    // Claim person vars
    var persId = claim.personsInfo[0]._id;
    var searchPerson = db.persons.findOne({
        "_id": persId
    });
    var surname = searchPerson.surname;
    var firstName = searchPerson.firstName;
    var middleName = searchPerson.middleName;
    if (searchPerson.dateOfBirth != undefined) {
        var dateOfBirth = searchPerson.dateOfBirth.substr(0, 10);
        try {
            // Find same person with docs
            var searchSamePerson = db.persons.findOne({
                "surname": surname,
                "firstName": firstName,
                "middleName": middleName,
                "dateOfBirth": new RegExp('^' + dateOfBirth, 'i'),
                "currIdentityDocId": {
                    $exists: true
                }
            })
            if (searchSamePerson != undefined) {
                var personInfo = [];
                var persInfoObj = searchSamePerson;
                var samePersonId = searchSamePerson._id;
                //Add Document Data in personsIinfo
                if (persInfoObj.currIdentityDocId != (undefined && null)) {
                    var docId;
                    persInfoObj.currIdentityDocId.length == 24 ? docId = ObjectId(persInfoObj.currIdentityDocId) : docId = persInfoObj.currIdentityDocId;
                    var docFind = db.docs.findOne({
                        "_id": docId
                    });
                    if (docFind != (undefined && null)) {
                        var fullDoc = docFind;
                        delete fullDoc._class;
                        persInfoObj.currIdentityDoc = fullDoc;
                    }
                }

                //Add Registration Address in personsIinfo
                if (persInfoObj.registrationAddressId != (undefined && null)) {
                    var regAddressId;
                    persInfoObj.registrationAddressId.length == 24 ? regAddressId = ObjectId(persInfoObj.registrationAddressId) : regAddressId = persInfoObj.registrationAddressId;
                    var regAddressFind = db.addresses.findOne({
                        "_id": regAddressId
                    });
                    if (regAddressFind != (undefined && null)) {
                        var fullRegAddress = regAddressFind;
                        delete fullRegAddress._class;
                        persInfoObj.registrationAddress = fullRegAddress;
                    }
                }

                //Add Location Address in personsIinfo
                if (persInfoObj.locationAddressId != (undefined && null)) {
                    var locAddressId;
                    persInfoObj.locationAddressId.length == 24 ? locAddressId = ObjectId(persInfoObj.locationAddressId) : locAddressId = persInfoObj.locationAddressId;
                    var locAddressFind = db.addresses.findOne({
                        "_id": locAddressId
                    });
                    if (locAddressFind != (undefined && null)) {
                        var fullLocAddress = locAddressFind;
                        delete fullLocAddress._class;
                        persInfoObj.locationAddress = fullLocAddress;
                    }
                }

                //Add Work Address in personsIinfo
                if (persInfoObj.ipWorkPlaceAddressId != (undefined && null)) {
                    var workAddressId;
                    persInfoObj.ipWorkPlaceAddressId.length == 24 ? workAddressId = ObjectId(persInfoObj.ipWorkPlaceAddressId) : workAddressId = persInfoObj.ipWorkPlaceAddressId;
                    var workAddressFind = db.addresses.findOne({
                        "_id": workAddressId
                    });
                    if (workAddressFind != (undefined && null)) {
                        var fullWorkAddress = workAddressFind;
                        delete fullWorkAddress._class;
                        persInfoObj.ipWorkPlaceAddress = fullWorkAddress;
                    }
                }

                //Add Birth Address in personsIinfo
                if (persInfoObj.birthAddressId != (undefined && null)) {
                    var birthAddressId;
                    persInfoObj.birthAddressId.length == 24 ? birthAddressId = ObjectId(persInfoObj.birthAddressId) : birthAddressId = persInfoObj.birthAddressId;
                    var birthAddressFind = db.addresses.findOne({
                        "_id": birthAddressId
                    });
                    if (birthAddressFind != (undefined && null)) {
                        var fullbirthAddress = birthAddressFind;
                        delete fullbirthAddress._class;
                        persInfoObj.birthAddress = fullbirthAddress;
                    }
                }

                //Add person in claim
                var personObj
                if (persInfoObj.type == "JURIDICAL") {
                    personObj = {
                        "applicantType": persInfoObj.type,
                        "orgName": persInfoObj.orgName
                    }
                } else {
                    personObj = {
                        "surname": persInfoObj.surname,
                        "firstName": persInfoObj.firstName,
                        "middleName": persInfoObj.middleName,
                        "applicantType": persInfoObj.type,
                        "fio": persInfoObj.surname + ' ' + persInfoObj.firstName + ' ' + persInfoObj.middleName
                    }
                }

                for (var j in personObj) {
                    if (personObj[j] == undefined) {
                        delete personObj[j];
                    }
                }

                delete persInfoObj._class;
                personInfo.push(persInfoObj)

                var upd = db.claims.update({
                    "customClaimNumber": ccn
                }, {
                    $set: {
                        "personsInfo": personInfo,
                        "persons.0": samePersonId
                    }
                }, {
                    multi: true
                })
                print(ccn + ' ' + upd.nModified + ' / ' + upd.nMatched)
            } else {
                print(ccn)
            }
        } catch(err){
            print(ccn + ' ' + err.message)
        }

    }
})