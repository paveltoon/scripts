var cursor = db.claims.find({
    "personsInfo.currIdentityDocId": {
        $exists: false
    },
    "activationDate": {
        $gte: ISODate("2019-12-20T21:00:00.000+0000"),
        $lte: ISODate("2020-01-06T21:00:00.000+0000")
    },
    "consultation": false,
    "personsInfo.type": "PHYSICAL"
}).addOption(DBQuery.Option.noTimeout).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var persId = claim.personsInfo[0]._id;
    var samePerson = db.claims.find({
        "personsInfo._id": persId,
        "personsInfo.currIdentityDocId": {
            $exists: true
        },
        "personsInfo.registrationAddressId": {
            $exists: true
        }
    }).sort({"activationDate": -1});
    if (samePerson[0]) {
        var docId = samePerson[0].personsInfo[0].currIdentityDocId;
        var regId = samePerson[0].personsInfo[0].registrationAddressId;
        var docObj = samePerson[0].personsInfo[0].currIdentityDoc;
        var regObj = samePerson[0].personsInfo[0].registrationAddress;
        var upd = db.claims.update({
            "customClaimNumber": ccn
        }, {
            $set: {
                "personsInfo.0.currIdentityDocId": docId,
                "personsInfo.0.registrationAddressId" : regId,
                "personsInfo.0.currIdentityDoc": docObj,
                "personsInfo.0.registrationAddress": regObj
            }
        }, {
            multi: true
        });
        print("Claim: " + ccn + " corrected. DocID: " + docId + ". AddressID: " + regId + ". Progress: " + upd.nModified + ' / ' + upd.nMatched)
    } else {
        var samePersonNoAddress = db.claims.find({
            "personsInfo._id": persId,
            "personsInfo.currIdentityDocId": {
                $exists: true
            }
        }).sort({"activationDate": -1});
        if (samePersonNoAddress[0]) {
            var sameDocId = samePersonNoAddress[0].personsInfo[0].currIdentityDocId;
            var sameDoc = samePersonNoAddress[0].personsInfo[0].currIdentityDoc;
            var sameUpd = db.claims.update({
                "customClaimNumber": ccn
            }, {
                $set: {
                    "personsInfo.0.currIdentityDocId": sameDocId,
                    "personsInfo.0.currIdentityDoc": sameDoc,
                }
            }, {
                multi: true
            });
            print("Claim: " + ccn + " corrected docs only. DocID: " + docId + ". Progress: " + sameUpd.nModified + ' / ' + sameUpd.nMatched)
        } else {
            print("[WARNING] There were no matches to person: " + persId + ". Claim: " + ccn)
        }
    }
})