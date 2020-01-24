var cursor = db.claims.find({
    "activationDate": {
        $gte: ISODate("2019-12-21T00:00:00.000+0300"),
        $lte: ISODate("2020-01-10T00:00:00.000+0300")
    },
    "consultation": false,
    "oktmo": {
        $ne: "99999999"
    },
    "personsInfo.currIdentityDocId": {
        $exists: false
    },
    "personsInfo.type": "PHYSICAL"
}).addOption(DBQuery.Option.noTimeout).forEach(function(claim){
    var ccn = claim.customClaimNumber;
    var persId = claim.personsInfo[0]._id;
    var searchDoc = db.docs.find({ "ownerId": persId.valueOf(), "title": "Паспорт гражданина РФ" }).sort({"lastModified": -1});
    if(searchDoc[0]){
        var docId = searchDoc[0]._id;
        var docData = searchDoc[0];
        delete docData["_class"]
        var upd = db.claims.update(
            { "customClaimNumber": ccn },
            { $set: { "personsInfo.0.currIdentityDocId": docId.valueOf(), "personsInfo.0.currIdentityDoc": docData } },
            { multi: true }
        );
        var findPerson = db.persons.find({ "_id": persId });
        if(findPerson[0] && !findPerson[0].currIdentityDocId){
            var persUpd = db.persons.update(
                { "_id": persId },
                { $set: { "currIdentityDocId": docId } },
                { multi: true }
            );
            print("[INFO] Person has been corrected. id: " + persId.valueOf() + ". Progress person: " + persUpd.nModified + ' / ' + persUpd.nMatched)
        } else if(findPerson[0] && findPerson[0].currIdentityDocId){
            print("[INFO] No need to update person. id: " + persId.valueOf() + ". Claim: " + ccn)
        } else if(!findPerson[0]){
            print("[WARNING] Can't find person. id: " + persId.valueOf() + ". Claim: " + ccn)
        }
        print("Claim: " + ccn + " has been updated. Progress claims: " + upd.nModified + ' / ' + upd.nMatched);
    } else {
        print("[WARNING] Can't find docs of id: " + persId.valueOf() + " person. Claim: " + ccn)
    }
})