var pes = {
    "B001-7608631664-27": "57960e6ea78e881609de0d70",
    "B001-4967173383-59": "565ef9988fee5e7495d13d07"
}

var thisClaim = Object.keys(pes);

for (var i in thisClaim) {
    var persId = pes[thisClaim[i]];
    var personData = db.persons.findOne({
        "_id": ObjectId(persId)
    });

    if (personData != (undefined && null)) {

        var personsInfo = [{
            "_id": ObjectId(persId),
            "type": personData.type,
            "surname": personData.surname,
            "firstName": personData.firstName,
            "middleName": personData.middleName,
            "gender": personData.gender,
            "dateOfBirth": personData.dateOfBirth,
            "placeOfBirth": personData.placeOfBirth,
            "noCitizenship": personData.noCitizenship,
            "citizenship": personData.citizenship,
            "citizenshipCode": personData.citizenshipCode,
            "familyStatus": personData.familyStatus,
            "agreements": {
                "fiscalAgreementDate": personData.agreements.fiscalAgreementDate,
                "smsConsent": personData.agreements.smsConsent,
                "emailConsent": personData.agreements.emailConsent,
                "snilsInnFineConsent": personData.agreements.snilsInnFineConsent
            },
            "esiaAutorisation": personData.esiaAutorisation
        }]


        if (personData.contacts != (undefined && null)) {
            var contacts = [];
            var claimContacts = personData.contacts;
            for (var i in claimContacts) {
                var contactValue = claimContacts[i].value;
                var contactType = claimContacts[i].type;
                contacts[i].value = contactValue;
                contacts[i].type = contactType;
            }

            personsInfo[0].contacts = contacts;
        } else {
            var contacts = [];
            personsInfo[0].contacts = contacts;
        }

        personsInfo[0].registrationAddressId = personData.registrationAddressId;
        personsInfo[0].locationAddressId = personData.locationAddressId;
        personsInfo[0].birthAddressId = personData.birthAddressId;
        personsInfo[0].ipWorkPlaceAddressId = personData.ipWorkPlaceAddressId;
        personsInfo[0].currIdentityDocId = personData.currIdentityDocId;

        if (personData.registrationAddressId) {
            var regAdressId = personData.registrationAddressId;
            var adressData = db.addresses.findOne({
                "_id": ObjectId(regAdressId)
            });

            var registrationAddress = {
                "_id": ObjectId(adressData._id.valueOf()),
                "personId": adressData.personId,
                "type": adressData.type,
                "country": adressData.country,
                "region": adressData.region,
                "area": adressData.area,
                "locality": adressData.locality,
                "houseNumber": adressData.houseNumber,
                "zipCode": adressData.zipCode,
                "kladrCode": adressData.kladrCode,
                "regionPrefix": adressData.regionPrefix,
                "areaPrefix": adressData.areaPrefix,
                "superTownPrefix": adressData.superTownPrefix,
                "localityPrefix": adressData.localityPrefix,
                "streetPrefix": adressData.streetPrefix,
                "urbanDistrictPrefix": adressData.urbanDistrictPrefix,
                "regionFiasCode": adressData.regionFiasCode,
                "areaFiasCode": adressData.areaFiasCode,
                "localityFiasCode": adressData.localityFiasCode,
                "urbanDistrictFiasCode": adressData.urbanDistrictFiasCode,
                "streetFiasCode": adressData.streetFiasCode,
                "houseFiasCode": adressData.houseFiasCode
            }

            personsInfo[0].registrationAddress = registrationAddress;
        }

        if (personData.locationAddressId) {
            var locAdressId = personData.locationAddressId;
            var localData = db.addresses.findOne({
                "_id": ObjectId(locAdressId)
            });

            var locationAddress = {
                "_id": ObjectId(localData._id.valueOf()),
                "personId": localData.personId,
                "type": localData.type,
                "country": localData.country,
                "region": localData.region,
                "area": localData.area,
                "locality": localData.locality,
                "houseNumber": localData.houseNumber,
                "zipCode": localData.zipCode,
                "kladrCode": localData.kladrCode,
                "regionPrefix": localData.regionPrefix,
                "areaPrefix": localData.areaPrefix,
                "superTownPrefix": localData.superTownPrefix,
                "localityPrefix": localData.localityPrefix,
                "streetPrefix": localData.streetPrefix,
                "urbanDistrictPrefix": localData.urbanDistrictPrefix,
                "regionFiasCode": localData.regionFiasCode,
                "areaFiasCode": localData.areaFiasCode,
                "localityFiasCode": localData.localityFiasCode,
                "urbanDistrictFiasCode": localData.urbanDistrictFiasCode,
                "streetFiasCode": localData.streetFiasCode,
                "houseFiasCode": localData.houseFiasCode
            }

            personsInfo[0].locationAddress = locationAddress;
        }

        if (personData.birthAddressId) {
            var birthAdressId = personData.birthAddressId;
            var birthData = db.addresses.findOne({
                "_id": ObjectId(birthAdressId)
            });

            var birthAddress = {
                "_id": ObjectId(birthData._id.valueOf()),
                "personId": birthData.personId,
                "type": birthData.type,
                "country": birthData.country,
                "region": birthData.region,
                "kladrCode": birthData.kladrCode,
                "regionPrefix": birthData.regionPrefix,
                "areaPrefix": birthData.areaPrefix,
                "superTownPrefix": birthData.superTownPrefix,
                "localityPrefix": birthData.localityPrefix,
                "streetPrefix": birthData.streetPrefix,
                "urbanDistrictPrefix": birthData.urbanDistrictPrefix,
                "regionFiasCode": birthData.regionFiasCode,
                "areaFiasCode": birthData.areaFiasCode,
                "localityFiasCode": birthData.localityFiasCode,
                "urbanDistrictFiasCode": birthData.urbanDistrictFiasCode,
                "streetFiasCode": birthData.streetFiasCode,
                "houseFiasCode": birthData.houseFiasCode
            }

            personsInfo[0].birthAddress = birthAddress;
        }

        if (personData.ipWorkPlaceAddressId) {
            var workAdressId = personData.ipWorkPlaceAddressId;
            var workData = db.addresses.findOne({
                "_id": ObjectId(workAdressId)
            });

            var ipWorkPlaceAddress = {
                "_id": ObjectId(workData._id.valueOf()),
                "personId": workData.personId,
                "type": workData.type,
                "country": workData.country,
                "region": workData.region,
                "kladrCode": workData.kladrCode,
                "regionPrefix": workData.regionPrefix,
                "areaPrefix": workData.areaPrefix,
                "superTownPrefix": workData.superTownPrefix,
                "localityPrefix": workData.localityPrefix,
                "streetPrefix": workData.streetPrefix,
                "urbanDistrictPrefix": workData.urbanDistrictPrefix,
                "regionFiasCode": workData.regionFiasCode,
                "areaFiasCode": workData.areaFiasCode,
                "localityFiasCode": workData.localityFiasCode,
                "urbanDistrictFiasCode": workData.urbanDistrictFiasCode,
                "streetFiasCode": workData.streetFiasCode,
                "houseFiasCode": workData.houseFiasCode
            }

            personsInfo[0].ipWorkPlaceAddress = ipWorkPlaceAddress;
        }

        if (personData.currIdentityDocId) {
            var docAdrId = personData.currIdentityDocId;
            var docData = db.docs.findOne({
                "_id": ObjectId(docAdrId)
            });

            var currIdentityDoc = {
                "_id": ObjectId(docData._id.valueOf()),
                "ownerId": docData.ownerId,
                "ownerType": docData.ownerType,
                "title": docData.title,
                "serial": docData.serial,
                "number": docData.number,
                "fromDate": docData.fromDate,
                "org": docData.org,
                "originPageCount": NumberInt(docData.originPageCount),
                "originCount": NumberInt(docData.originCount),
                "copyPageCount": NumberInt(docData.copyPageCount),
                "copyCount": NumberInt(docData.copyCount),
                "petitionTypeElectronic": docData.petitionTypeElectronic,
                "refusedByRecipient": docData.refusedByRecipient,
                "createDate": docData.createDate,
                "lastModified": docData.lastModified,
                "createBy": docData.createBy,
                "lastModifiedBy": docData.lastModifiedBy
            }

            personsInfo[0].currIdentityDoc = currIdentityDoc;

        }
        for (var key in personsInfo[0]) {
            if (personsInfo[0][key] == undefined) {
                delete personsInfo[0][key];
            }
        }
        printjson(personsInfo[0]);
    }
}