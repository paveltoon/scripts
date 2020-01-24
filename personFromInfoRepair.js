var cursor = db.claims.find({
    "claimCreate": {
        $gte: ISODate("2019-12-21T00:00:00.000+0300"),
        $lte: ISODate("2020-01-10T00:00:00.000+0300")
    },
    "consultation": false,
    "oktmo": {
        $ne: "99999999"
    },
    "personsInfo.currIdentityDocId": {
        $exists: true
    },
    "personsInfo.currIdentityDoc": {
        $exists: false
    },
    "personsInfo.type": "PHYSICAL"
}).addOption(DBQuery.Option.noTimeout).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var persId = claim.personsInfo[0]._id;
    if (claim.personsInfo[0].currIdentityDocId) {
        claim.personsInfo[0].currIdentityDocId.length == 24 ? docId = ObjectId(claim.personsInfo[0].currIdentityDocId) : docId = claim.personsInfo[0].currIdentityDocId;
        var searchDoc = db.docs.find({
            "_id": docId
        });
        if (searchDoc[0]) {
            var docData = searchDoc[0];
            delete docData["_class"]
            var upd = db.claims.update({
                "customClaimNumber": ccn
            }, {
                $set: {
                    "personsInfo.0.currIdentityDoc": docData
                }
            }, {
                multi: true
            });
            print("Claim: " + ccn + " has been updated. Progress claims: " + upd.nModified + ' / ' + upd.nMatched);
        } else {
            print("[WARNING] Can't find docs of id: " + persId.valueOf() + " person. Claim: " + ccn)
        }
    }
})