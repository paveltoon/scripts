db.claims.find({
    "oktmo": "46000000",
    $and: [{
        "service.srguServicePassportId": {
            $ne: "5000000000196394746"
        }
    }, {
        "service.srguServicePassportId": {
            $ne: "5000000000167433775"
        }
    }, {
        "service.srguServicePassportId": {
            $ne: "5000000000160299214"
        }
    }, ],
    "provLevel": "ОМСУ",
    "claimCreate": {
        $gte: ISODate("2019-08-05T01:03:09.046+0000")
    }
}).forEach(function (claim) {
    var ccn = claim.customClaimNumber;
    var origId = claim._id;
    var fields = claim.fields.sequenceValue;
    for (var i in fields) {
        if (fields[i].stringId == "municipality") {
            var oktmo = fields[i].value;
            var upd = db.claims.update({
                "_id": origId
            }, {
                $set: {
                    "oktmo": oktmo
                }
            });
            print(ccn + ' ' + upd.nModified + ' / ' + upd.nMatched)
            return;
        } else if (i >= fields.length - 1 && fields[i].stringId != "municipality") {
            print(ccn)
        }
    }
});