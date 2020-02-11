db.claims.find({
    "senderCode": "RRTR01001",
    "activationDate": {
        $gte: ISODate("2019-01-01T21:00:00.000+0300"),
        $lte: ISODate("2019-03-01T21:00:00.000+0300")
    },
    "currStatus.statusCode": {
        $ne: "24"
    },
    "resultStatus": {
        $exists: true
    }
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var origId = claim._id.valueOf();
    var findStatus = db.claims_status.findOne({
        "claimId": origId,
        "statusCode": "24"
    });
    if (findStatus != undefined) {
        var newCurrStatus = findStatus;

        newCurrStatus._id = new ObjectId();
        newCurrStatus.statusDate = new Date();
        newCurrStatus.createDate = new Date();
        newCurrStatus.lastModified = new Date();
        db.claims_status.save(newCurrStatus);

        delete newCurrStatus._class;
        var upd = db.claims.update({
            "customClaimNumber": ccn
        }, {
            $set: {
                "currStatus": newCurrStatus
            }
        }, {
            multi: true
        });
        print(ccn + ' ' + upd.nModified + ' / ' + upd.nMatched);
    }
});