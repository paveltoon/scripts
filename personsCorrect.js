var pes = {
    "B503-0536508936-31357647": "5688538ca78e08d778401608",
    "B503-1846873177-31357508": "58072affa78e0d70b86d7c59",
    "B503-8726499774-31357309": "5697bb52a78e8a3f3957bdbe",
    "M503-7302429189-31336424": "5baa4a43a78ebb34851d79ce",
    "B504-1273836225-31349203": "5b3b9589a78ec59ef8e9c5be",
    "B503-4640355941-31333973": "5a4025a7a78e30c3e67fc0fb",
    "B503-8842573423-31357104": "55df4143a78e425c6f415e6f",
    "B503-2941502057-31357577": "572c2ae7a78e5d89f8cebe69",
    "B503-3249856239-31357425": "57bad839a78ec1553e44caef",
    "B504-8473681689-31325215": "5de0c766ce8ad00001f3f195",
    "M502-8484488560-31344086": "592e8b6ea78e1f04d4a894b3",
    "M503-1814045323-31348995": "5ae06ae3a78e3426f71fa49d",
    "M503-0450145708-31358993": "5bcafacca78e24e3b5d9cf0a",
    "M505-8419327355-31351323": "5de8a04824aa9a000192b746",
    "M505-8449758702-31355283": "588213d6a78e50fb3345fdee",
    "M503-1629330089-31346980": "5829d544a78e3d8000cffaa9",
    "M503-5545447495-31325458": "5d77a4ec7979c40001dc9447",
    "M502-2223570049-31344378": "5bc852f3a78e71a2e44458c7",
    "B508-9578849282-31338526": "5dd7ac8412f7920001214d01",
    "B508-9578849282-31338631": "58623a63a78e20012bd05769",
    "M503-1811785778-31351247": "5c541f22f2a243ce27d31ab0",
    "B504-2917264208-31341701": "5deb8f1e24aa9a0001b93e15",
    "M503-5423396444-31356246": "5cebf4a25ea290ade3365a5c",
    "M503-9119154545-31351773": "5a7077a1a78e4baebdf0bc53",
    "M503-5345824251-31352204": "59fb0a7ca78e01b7b4e671fb"
}

var thisClaim = Object.keys(pes);

for (var i in thisClaim) {
    var persId = pes[thisClaim[i]];
    var ccn = thisClaim[i];
    var personData = db.persons.findOne({
        "_id": ObjectId(persId)
    });

    var cursor = db.claims.findOne({
        "customClaimNumber": ccn
    })

    if (personData != (undefined && null) && cursor != (undefined && null)) {

        var personsInfo = [{
            "_id": ObjectId(persId),
            "type": personData.type,
            "contacts": [],
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
                contacts.push({
                    value: contactValue,
                    type: contactType
                });
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

            for (var key in registrationAddress) {
                if (registrationAddress[key] == undefined) {
                    delete registrationAddress[key];
                }
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
            for (var key in locationAddress) {
                if (locationAddress[key] == undefined) {
                    delete locationAddress[key];
                }
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
            for (var key in birthAddress) {
                if (birthAddress[key] == undefined) {
                    delete birthAddress[key];
                }
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
            for (var key in ipWorkPlaceAddress) {
                if (ipWorkPlaceAddress[key] == undefined) {
                    delete ipWorkPlaceAddress[key];
                }
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
            for (var key in currIdentityDoc) {
                if (currIdentityDoc[key] == undefined) {
                    delete currIdentityDoc[key];
                }
            }
            personsInfo[0].currIdentityDoc = currIdentityDoc;

        } else if (personData.currIdentityDoc) {
            var currIdentityDoc = Object.assign({}, personData.currIdentityDoc);
            for (var int in currIdentityDoc) {
                if (typeof currIdentityDoc[int] == "number") {
                    currIdentityDoc[int] = NumberInt(currIdentityDoc[int]);
                }
            }
            personsInfo[0].currIdentityDoc = currIdentityDoc;
        }

        for (var key in personsInfo[0]) {
            if (personsInfo[0][key] == undefined) {
                delete personsInfo[0][key];
            }
        }

        for (var key in personsInfo[0].agreements) {
            if (personsInfo[0].agreements[key] == undefined) {
                delete personsInfo[0].agreements[key];
            }
        }

        // Claim Persons array
        var personsArr = [persId];

        // Claim person object
        var personObj = {
            surname: personsInfo[0].surname,
            firstName: personsInfo[0].firstName,
            middleName: personsInfo[0].middleName,
            applicantType: personsInfo[0].type,
        }

        if (personObj.surname != undefined && personObj.firstName != undefined && personObj.middleName != undefined) {
            personObj.fio = personsInfo[0].surname + ' ' + personsInfo[0].firstName + ' ' + personsInfo[0].middleName;
        }

        for (var key in personObj) {
            if (personObj[key] == undefined) {
                delete personObj[key];
            }
        }

        // UPDATE CLAIMS NEED TESTS
        var upd = db.claims.update({
            "customClaimNumber": ccn
        }, {
            $set: {
                "persons": personsArr,
                "person": personObj,
                "personsInfo": personsInfo
            }
        },{
            multi: true
        });
        
        print("claim: " + ccn + ' updated: ' + upd.nModified + ' / ' + upd.nMatched);
    }
}