var email = "5590999@bk.ru";
var count = 0;
db.claims.find({
    $or: [{
        "personsInfo.contacts": {
            $elemMatch: {
                "type": "EML",
                "value": email
            }
        }
    }, {
        "trustedPersons.trustedPerson.trustedPersonInfo.contacts": {
            $elemMatch: {
                "type": "EML",
                "value": email
            }
        }
    }]
}).limit(10).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var updateObj = {}

    // Correct PersonsInfo
    if (claim.personsInfo != undefined && claim.personsInfo[0] != undefined && claim.personsInfo[0].contacts != undefined) {
        var personContacts = claim.personsInfo[0].contacts;
        for (var i in personContacts) {
            var personUpd = "personsInfo.0.contacts.";
            for (var j in personContacts[i]) {
                if (personContacts[i][j] == email) {
                    personPath = personUpd + i + ".value";
                    updateObj[personPath] = "";
                }
            }
        }
    }

    // Correct TrustedPersons
    if (claim.trustedPersons != undefined && claim.trustedPersons[0] != undefined &&  claim.trustedPersons[0].trustedPerson != undefined && claim.trustedPersons[0].trustedPerson.trustedPersonInfo != undefined && claim.trustedPersons[0].trustedPerson.trustedPersonInfo.contacts != undefined) {
        var trustedContacts = claim.trustedPersons[0].trustedPerson.trustedPersonInfo.contacts;
        for (var i in trustedContacts) {
            var trustedUpd = "trustedPersons.0.trustedPerson.trustedPersonInfo.contacts.";
            for (var j in trustedContacts[i]) {
                if (trustedContacts[i][j] == email) {
                    trustedPath = trustedUpd + i + ".value";
                    updateObj[trustedPath] = "";
                }
            }
        }
    }

    // Correct TrustedPersons in PersonsInfo
    if (claim.personsInfo != undefined && claim.personsInfo[0] != undefined && claim.personsInfo[0].trustedPersons != undefined && claim.personsInfo[0].trustedPersons[0] != undefined && claim.personsInfo[0].trustedPersons[0].trustedPersonInfo != undefined && claim.personsInfo[0].trustedPersons[0].trustedPersonInfo.contacts != undefined) {
        var personTrustContacts = claim.personsInfo[0].trustedPersons[0].trustedPersonInfo.contacts;
        for (var i in personTrustContacts) {
            var personTrustedUpd = "personsInfo.0.trustedPersons.0.trustedPersonInfo.contacts.";
            for (var j in personTrustContacts[i]) {
                if (personTrustContacts[i][j] == email) {
                    personTrustedPath = personTrustedUpd + i + ".value";
                    updateObj[personTrustedPath] = "";
                }
            }
        }
    }
    // Update & Print
    if(Object.keys(updateObj).length != 0){
        var upd = db.claims.update({
            "customClaimNumber": ccn
        }, {
            $set: updateObj
        }, {
            multi: true
        });
        print(ccn + ' ' + upd.nModified + ' / ' + upd.nMatched)
        count++;
    }
});
print("Updated claims: " + count + '.')