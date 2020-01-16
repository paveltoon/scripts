var cursor = db.claims.find({
      "activationDate": {
        $gte: ISODate("2019-12-20T21:00:00.000+0000"),
        $lte: ISODate("2020-01-06T21:00:00.000+0000")
    },
    "trustedPersons": {
        $exists: false
    },
    "provLevel": "ОМСУ"
});
cursor.forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    if (claim.personsInfo && claim.personsInfo[0] && !claim.trustedPersons && claim.personsInfo[0].trustedPersons && claim.personsInfo[0].trustedPersons[0] && claim.personsInfo[0].trustedPersons[0].trustedId) {
        var trustedId = claim.personsInfo[0].trustedPersons[0].trustedId;

        if (trustedId.length == 24) {
            var trust = ObjectId(trustedId);
        } else {
            var trust = trustedId;
        }

        var personCard = db.persons.findOne({
            "_id": trust
        });

        //Main Object
        var trustedPers = [{
            "trustedPersonId": new ObjectId().valueOf(),
            "trustedPerson": {
                "trustedId": trustedId,
                "type": claim.personsInfo[0].trustedPersons[0].type,
                "trustedPersonInfo": {
                    "_id": personCard._id,
                    "type": personCard.type,
                    "inn": personCard.inn,
                    "snils": personCard.snils,
                    "contacts": [],
                    "surname": personCard.surname,
                    "firstName": personCard.firstName,
                    "middleName": personCard.middleName,
                    "gender": personCard.gender,
                    "dateOfBirth": personCard.dateOfBirth,
                    "citizenship": personCard.citizenship,
                    "registrationAddressId": personCard.registrationAddressId,
                    "currIdentityDocId": personCard.currIdentityDocId,
                    "lowerCaseSurname": personCard.lowerCaseSurname,
                    "lowerCaseFirstName": personCard.lowerCaseFirstName,
                    "lowerCaseMiddleName": personCard.lowerCaseMiddleName,
                    "registrationAddress": {},
                    "currIdentityDoc": {},
                    "agreements": {
                        "smsConsent": personCard.agreements.smsConsent,
                        "emailConsent": personCard.agreements.emailConsent,
                        "snilsInnFineConsent": personCard.agreements.snilsInnFineConsent
                    },
                    "lastModified": personCard.lastModified,
                    "lastModifiedBy": personCard.lastModifiedBy,
                    "esiaAutorisation": personCard.esiaAutorisation
                }
            }
        }];

        // Contacts
        if (personCard.contacts != (undefined && null)) {
            trustedPers[0].trustedPerson.trustedPersonInfo.contacts = personCard.contacts;
        } else {
            var contacts = [];
            trustedPers[0].trustedPerson.trustedPersonInfo.contacts = contacts;
        }

        //Address
        if (personCard.registrationAddressId) {
            var addressId = personCard.registrationAddressId
            var addressCard = db.addresses.findOne({
                "_id": ObjectId(addressId)
            });
            if (addressCard != (undefined && null)) {
                trustedPers[0].trustedPerson.trustedPersonInfo.registrationAddress = addressCard;
                delete trustedPers[0].trustedPerson.trustedPersonInfo.registrationAddress._class;
            }
        } else {
            var addressCard = db.addresses.findOne({
                "personId": trustedId,
                "type": "REGISTRATION"
            });
            if (addressCard != (undefined && null)) {
                trustedPers[0].trustedPerson.trustedPersonInfo.registrationAddress = addressCard;
                delete trustedPers[0].trustedPerson.trustedPersonInfo.registrationAddress._class;
            }
        }

        //Passport
        if (personCard.currIdentityDocId) {
            var passportId = personCard.currIdentityDocId
            var passportCard = db.docs.findOne({
                "_id": ObjectId(passportId)
            });
            if (passportCard != (undefined && null)) {
                trustedPers[0].trustedPerson.trustedPersonInfo.currIdentityDoc = passportCard;
                delete trustedPers[0].trustedPerson.trustedPersonInfo.currIdentityDoc._class;
            }
        } else {
            var passportCard = db.docs.findOne({
                "ownerId": trustedId,
                "ownerType": "PERSON"
            });
            if (passportCard != (undefined && null)) {
                trustedPers[0].trustedPerson.trustedPersonInfo.currIdentityDoc = passportCard;
                delete trustedPers[0].trustedPerson.trustedPersonInfo.currIdentityDoc._class;
            }
        }


        //Delete empty fields
        for (var key in trustedPers[0].trustedPerson.trustedPersonInfo) {
            if (trustedPers[0].trustedPerson.trustedPersonInfo[key] == undefined) {
                delete trustedPers[0].trustedPerson.trustedPersonInfo[key];
            }
        }

        for (var key in trustedPers[0].trustedPerson.trustedPersonInfo.agreements) {
            if (trustedPers[0].trustedPerson.trustedPersonInfo.agreements[key] == undefined) {
                delete trustedPers[0].trustedPerson.trustedPersonInfo.agreements[key];
            }
        }

        // Save and Print
        var upd = db.claims.update({
            "activationDate": {
                $gte: ISODate("2019-12-20T21:00:00.000+0000"),
                $lte: ISODate("2020-01-06T21:00:00.000+0000")
            },
            "trustedPersons": {
                $exists: false
            },
            "customClaimNumber": ccn
        }, {
            $set: {
                "trustedPersons": trustedPers
            }
        }, {
            multi: true
        });

        print(ccn + ' ' + upd.nModified + ' / ' + upd.nMatched);
    } else if (!claim.personsInfo || !claim.personsInfo[0]){
        print(ccn)
    }

});